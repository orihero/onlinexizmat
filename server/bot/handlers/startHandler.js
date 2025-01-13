import { getLanguageKeyboard } from '../keyboards/languageKeyboard.js';
import { messages } from '../utils/messages.js';
import { supabase } from '../../lib/supabase.js';

export async function handleStart(bot, msg) {
  try {
    // Clear any existing service state for the user
    await supabase
      .from('user_service_state')
      .delete()
      .eq('telegram_user_id', msg.from.id);

    // Save initial user information
    await supabase
      .from('telegram_users')
      .upsert({
        telegram_id: msg.from.id,
        username: msg.from.username,
        first_name: msg.from.first_name,
        last_name: msg.from.last_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'telegram_id'
      });

    await bot.sendMessage(msg.chat.id, messages.welcome, {
      parse_mode: 'HTML',
      reply_markup: getLanguageKeyboard()
    });
  } catch (error) {
    console.error('Error in start handler:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try /start again.');
  }
}