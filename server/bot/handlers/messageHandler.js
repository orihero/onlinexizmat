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
        if (message.file_type) {
          // Send file using stored file_id
          let sentMessage;
          
          if (message.file_type.startsWith('image/')) {
            sentMessage = await bot.sendPhoto(message.telegram_user_id, message.content);
          } else if (message.file_type.startsWith('video/')) {
            if (message.file_type.includes('video_note')) {
              sentMessage = await bot.sendVideoNote(message.telegram_user_id, message.content);
            } else {
              sentMessage = await bot.sendVideo(message.telegram_user_id, message.content);
            }
          } else if (message.file_type.startsWith('audio/')) {
            if (message.file_type === 'audio/ogg') {
              sentMessage = await bot.sendVoice(message.telegram_user_id, message.content);
            } else {
              sentMessage = await bot.sendAudio(message.telegram_user_id, message.content);
            }
          } else {
            sentMessage = await bot.sendDocument(message.telegram_user_id, message.content);
          }

          // Update message status
          await supabase
            .from('messages')
            .update({
              status: 'sent',
              telegram_message_id: sentMessage.message_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', message.id);
        } else {
          // Send regular text message
          const sentMessage = await bot.sendMessage(message.telegram_user_id, message.content, {
            reply_markup: {
              force_reply: true,
              selective: true
            }
          });

          // Update message status
          await supabase
            .from('messages')
            .update({
              status: 'sent',
              telegram_message_id: sentMessage.message_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', message.id);
        }
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