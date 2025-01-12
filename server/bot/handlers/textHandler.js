import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';

export async function handleText(bot, msg) {
  try {
    console.log('Handling text message:', msg.text);

    // Get user's current state
    console.log('Fetching user state...');
    const { data: state, error: stateError } = await supabase
      .from('user_service_state')
      .select('*')
      .eq('telegram_user_id', msg.from.id)
      .single();

    if (stateError) {
      console.error('Error fetching state:', stateError);
      throw stateError;
    }

    if (!state) {
      console.log('No active service state found for user:', msg.from.id);
      return;
    }

    console.log('Current state:', state);

    // Store answer
    const answers = state.answers || [];
    answers.push({
      question_index: state.current_question_index,
      answer: msg.text
    });

    // Get next question
    console.log('Fetching questions...');
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('service_id', state.service_id)
      .order('order');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      throw questionsError;
    }

    console.log('Questions:', questions);

    const nextIndex = state.current_question_index + 1;
    const nextQuestion = questions[nextIndex];

    console.log('Next question index:', nextIndex);
    console.log('Next question:', nextQuestion);

    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', msg.from.id)
      .single();

    const language = user?.language || 'uz';

    if (nextQuestion) {
      // Update state
      console.log('Updating user state...');
      const { error: updateError } = await supabase
        .from('user_service_state')
        .update({
          current_question_index: nextIndex,
          answers: answers,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_user_id', msg.from.id);

      if (updateError) {
        console.error('Error updating state:', updateError);
        throw updateError;
      }

      // Send next question
      await bot.sendMessage(msg.chat.id, nextQuestion[`question_${language}`], {
        reply_markup: getQuestionKeyboard(nextQuestion.type, language)
      });
    } else {
      // Create order
      console.log('Creating order...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          telegram_user_id: msg.from.id,
          service_id: state.service_id,
          answers: answers,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      console.log('Order created:', order);

      // Clear state
      console.log('Clearing user state...');
      const { error: deleteError } = await supabase
        .from('user_service_state')
        .delete()
        .eq('telegram_user_id', msg.from.id);

      if (deleteError) {
        console.error('Error clearing state:', deleteError);
        throw deleteError;
      }

      // Send completion message
      const completionMessage = language === 'uz' 
        ? 'Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.'
        : 'Ваш заказ принят! Мы свяжемся с вами в ближайшее время.';

      await bot.sendMessage(msg.chat.id, completionMessage);
    }
  } catch (error) {
    console.error('Error in text handler:', error.message);
    console.error('Error stack:', error.stack);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}