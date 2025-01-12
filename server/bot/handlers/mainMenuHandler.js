import { supabase } from '../../lib/supabase.js';
import { getCategoriesKeyboard } from '../keyboards/categoriesKeyboard.js';
import { messages } from '../utils/messages.js';

export async function handleMainMenu(bot, msg) {
  try {
    const text = msg.text;
    console.log('Received message text:', text);

    // Get user language
    const { data: user, error: userError } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', msg.from.id)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
    }

    const language = user?.language || 'uz';
    console.log('User language:', language);

    // Handle Categories button
    if (text === '📋 Kategoriyalar' || text === '📋 Категории') {
      console.log('Categories button pressed');

      // Query categories with explicit schema
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name_uz, name_ru')
        .order('created_at');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        throw categoriesError;
      }

      console.log('Fetched categories:', JSON.stringify(categories, null, 2));

      if (!categories || categories.length === 0) {
        console.log('No categories found');
        await bot.sendMessage(msg.chat.id, 'No categories available at the moment.');
        return;
      }

      const keyboard = getCategoriesKeyboard(categories, language);
      console.log('Generated keyboard:', JSON.stringify(keyboard, null, 2));

      await bot.sendMessage(msg.chat.id, messages.selectCategory[language], {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
  } catch (error) {
    console.error('Error in main menu handler:', error.message, error.stack);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}