import { supabase } from '../../lib/supabase.js';
import { getCategoriesKeyboard } from '../keyboards/categoriesKeyboard.js';
import { getServicesKeyboard } from '../keyboards/servicesKeyboard.js';
import { messages } from '../utils/messages.js';

export async function handleCategories(bot, query) {
  const chatId = query.message.chat.id;
  
  // Get user language
  const { data: user } = await supabase
    .from('telegram_users')
    .select('language')
    .eq('telegram_id', query.from.id)
    .single();
  
  const language = user?.language || 'uz';

  // If it's a category selection
  if (query.data === 'category_list') {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('name_' + language);

    await bot.editMessageText(messages.selectCategory[language], {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: getCategoriesKeyboard(categories, language)
    });
  }
  // If a specific category is selected
  else if (query.data.startsWith('category_')) {
    const categoryId = query.data.replace('category_', '');
    
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('category_id', categoryId)
      .order('name_' + language);

    await bot.editMessageText(messages.selectService[language], {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: getServicesKeyboard(services, language)
    });
  }
}