import { getMainKeyboard } from '../keyboards/mainKeyboard.js';
import { messages } from '../utils/messages.js';
import { supabase } from '../../lib/supabase.js';

export async function handleContact(bot, msg) {
  const contact = msg.contact;
  
  // Save user contact
  await supabase
    .from('telegram_users')
    .update({
      phone_number: contact.phone_number
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
}