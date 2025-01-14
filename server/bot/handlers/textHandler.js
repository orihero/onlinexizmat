import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';
import { messages } from '../utils/messages.js';

export async function handleText(bot, msg) {
  try {
    // Check if this is a reply to a message
    if (msg.reply_to_message) {
      // Save the reply as a user message
      await supabase
        .from('messages')
        .insert([{
          telegram_user_id: msg.from.id,
          content: msg.text,
          type: 'user',
          status: 'sent',
          reply_to_message_id: msg.reply_to_message.message_id
        }]);

      return;
    }

    // Get user's current state
    const { data: state } = await supabase
      .from('user_service_state')
      .select('*')
      .eq('telegram_user_id', msg.from.id)
      .single();

    if (!state) return;

    // Get current question details
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('service_id', state.service_id)
      .order('order');

    const currentQuestion = questions[state.current_question_index];
    
    // Save the answer
    const answers = [...(state.answers || []), {
      question_index: state.current_question_index,
      answer: msg.text
    }];

    await supabase
      .from('user_service_state')
      .update({ answers })
      .eq('telegram_user_id', msg.from.id);

    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', msg.from.id)
      .single();

    const language = user?.language || 'uz';

    // Send confirmation message with inline keyboard
    await bot.sendMessage(msg.chat.id, messages.answerSaved[language], {
      reply_markup: getQuestionKeyboard(currentQuestion.type, language)
    });

  } catch (error) {
    console.error('Error in text handler:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}