import { getLanguageKeyboard } from '../keyboards/languageKeyboard.js';
import { messages } from '../utils/messages.js';

export async function handleStart(bot, msg) {
  try {
    await bot.sendMessage(msg.chat.id, messages.welcome, {
      parse_mode: 'HTML',
      reply_markup: getLanguageKeyboard()
    });
  } catch (error) {
    console.error('Error in start handler:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try /start again.');
  }
}