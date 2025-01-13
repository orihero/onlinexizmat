import { supabase } from '../../lib/supabase.js';

export async function processAdminMessages(bot) {
  try {
    // Get pending admin messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('type', 'admin')
      .eq('status', 'pending')
      .order('created_at');

    if (error) throw error;

    // Process each message
    for (const message of messages) {
      try {
        // Send message through bot with reply keyboard
        const sentMessage = await bot.sendMessage(message.telegram_user_id, message.content, {
          reply_markup: {
            force_reply: true,
            selective: true
          }
        });

        // Update message status to sent and store Telegram message ID
        await supabase
          .from('messages')
          .update({
            status: 'sent',
            telegram_message_id: sentMessage.message_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', message.id);

      } catch (error) {
        console.error('Error sending message:', error);

        // Update message status to failed
        await supabase
          .from('messages')
          .update({
            status: 'failed',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', message.id);
      }
    }
  } catch (error) {
    console.error('Error processing admin messages:', error);
  }
}