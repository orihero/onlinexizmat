import { supabase } from '../../lib/supabase.js';
import { getMainKeyboard } from '../keyboards/mainKeyboard.js';

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

    // Rest of the existing code...
    // (Keep all the existing state handling code)
  } catch (error) {
    console.error('Error in text handler:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}