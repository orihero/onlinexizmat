import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';
import { getMainKeyboard } from '../keyboards/mainKeyboard.js';

export async function handleAnswer(bot, query) {
  try {
    const chatId = query.message.chat.id;

    // Get user's current state
    const { data: state } = await supabase
      .from('user_service_state')
      .select('*')
      .eq('telegram_user_id', query.from.id)
      .single();

    if (!state) {
      await bot.sendMessage(chatId, 'Please start the service selection process first.');
      return;
    }

    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', query.from.id)
      .single();

    const language = user?.language || 'uz';

    // Handle confirmation
    if (query.data === 'confirm_answer') {
      // Get next question
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('service_id', state.service_id)
        .order('order');

      const nextIndex = state.current_question_index + 1;
      const nextQuestion = questions[nextIndex];

      if (nextQuestion) {
        // Move to next question
        await supabase
          .from('user_service_state')
          .update({
            current_question_index: nextIndex,
            updated_at: new Date().toISOString()
          })
          .eq('telegram_user_id', query.from.id);

        // Send next question
        await bot.editMessageText(nextQuestion[`question_${language}`], {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: getQuestionKeyboard(nextQuestion.type, language)
        });
      } else {
        // Create order with all answers
        await supabase
          .from('orders')
          .insert([{
            telegram_user_id: query.from.id,
            service_id: state.service_id,
            answers: state.answers,
            status: 'pending',
            files: state.answers.filter(a => a.file_type)
          }]);

        // Clear user state
        await supabase
          .from('user_service_state')
          .delete()
          .eq('telegram_user_id', query.from.id);

        // Send completion message
        const completionMessage = language === 'uz' 
          ? 'Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.'
          : 'Ваш заказ принят! Мы свяжемся с вами в ближайшее время.';

        await bot.editMessageText(completionMessage, {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard: [] }
        });
      }
      return;
    }

    // Handle cancellation
    if (query.data === 'cancel_answer') {
      // Clear user state
      await supabase
        .from('user_service_state')
        .delete()
        .eq('telegram_user_id', query.from.id);

      const cancelMessage = language === 'uz'
        ? 'Buyurtma bekor qilindi.'
        : 'Заказ отменен.';

      await bot.editMessageText(cancelMessage, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: [] }
      });
      return;
    }

    // Handle yes/no answers
    if (query.data === 'answer_yes' || query.data === 'answer_no') {
      const answer = query.data === 'answer_yes' ? 'Yes' : 'No';
      const answers = [...(state.answers || []), {
        question_index: state.current_question_index,
        answer
      }];

      await supabase
        .from('user_service_state')
        .update({
          answers: answers,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_user_id', query.from.id);

      const confirmMessage = language === 'uz'
        ? 'Javob saqlandi! Tasdiqlash tugmasini bosing.'
        : 'Ответ сохранен! Нажмите кнопку подтверждения.';

      await bot.editMessageText(confirmMessage, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: getQuestionKeyboard('yes_no', language)
      });
      return;
    }

  } catch (error) {
    console.error('Error handling answer:', error);
    await bot.sendMessage(query.message.chat.id, 'An error occurred. Please try again.');
  }
}