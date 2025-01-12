import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';

export async function handleAnswer(bot, query) {
  try {
    const chatId = query.message.chat.id;
    const answer = query.data === 'answer_yes' ? 'Yes' : 'No';

    // Get user's current state
    const { data: state, error: stateError } = await supabase
      .from('user_service_state')
      .select('*')
      .eq('telegram_user_id', query.from.id)
      .single();

    if (stateError || !state) {
      console.error('Error fetching state:', stateError);
      await bot.sendMessage(chatId, 'Please start the service selection process first.');
      return;
    }

    // Store answer
    const answers = [...(state.answers || []), {
      question_index: state.current_question_index,
      answer
    }];

    // Get next question
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('service_id', state.service_id)
      .order('order');

    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', query.from.id)
      .single();

    const language = user?.language || 'uz';
    const nextIndex = state.current_question_index + 1;
    const nextQuestion = questions[nextIndex];

    if (nextQuestion) {
      // Update state for next question
      await supabase
        .from('user_service_state')
        .update({
          current_question_index: nextIndex,
          answers: answers,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_user_id', query.from.id);

      // Send next question
      await bot.sendMessage(chatId, nextQuestion[`question_${language}`], {
        reply_markup: getQuestionKeyboard(nextQuestion.type, language)
      });
    } else {
      // Create order
      await supabase
        .from('orders')
        .insert([{
          telegram_user_id: query.from.id,
          service_id: state.service_id,
          answers: answers,
          status: 'pending'
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

      await bot.sendMessage(chatId, completionMessage);
    }
  } catch (error) {
    console.error('Error handling answer:', error);
    await bot.sendMessage(query.message.chat.id, 'An error occurred. Please try again.');
  }
}