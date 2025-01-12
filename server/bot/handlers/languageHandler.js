import { supabase } from '../../lib/supabase.js';
import { getContactKeyboard } from '../keyboards/contactKeyboard.js';
import { messages } from '../utils/messages.js';

export async function handleLanguage(bot, query) {
  try {
    const chatId = query.message.chat.id;
    const language = query.data.replace('lang_', '');
    
    // Save user language preference
    const { error: dbError } = await supabase
      .from('telegram_users')
      .upsert({
        telegram_id: query.from.id,
        language
      }, {
        onConflict: 'telegram_id'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save language preference');
    }

    const message = messages.requestContact[language];
    const keyboard = getContactKeyboard(language);
    
    // Replace the language selection message with the contact request
    await bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML'
    });

    // Send a new message with the contact keyboard
    await bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  } catch (error) {
    console.error('Error in language handler:', error);
    await bot.sendMessage(query.message.chat.id, 'An error occurred. Please try /start again.');
  }
}