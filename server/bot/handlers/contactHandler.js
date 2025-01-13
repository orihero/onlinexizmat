import { getMainKeyboard } from '../keyboards/mainKeyboard.js';
import { messages } from '../utils/messages.js';
import { supabase } from '../../lib/supabase.js';

export async function handleContact(bot, msg) {
  const contact = msg.contact;
  const from = msg.from;
  
  try {
    // Save user contact and additional information
    await supabase
      .from('telegram_users')
      .update({
        phone_number: contact.phone_number,
        first_name: from.first_name || contact.first_name,
        last_name: from.last_name || contact.last_name,
        username: from.username,
        updated_at: new Date().toISOString()
      })
      .eq('telegram_id', msg.from.id);

    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', msg.from.id)
      .single();

    const language = user?.language || 'uz';
    
    await bot.sendMessage(msg.chat.id, messages.contactReceived[language], {
      reply_markup: getMainKeyboard(language)
    });
  } catch (error) {
    console.error('Error saving user information:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}