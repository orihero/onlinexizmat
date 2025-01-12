import { supabase } from '../../lib/supabase.js';
import { getServiceActionKeyboard } from '../keyboards/serviceActionKeyboard.js';
import { downloadImage } from '../utils/imageUtils.js';
import { getServicesKeyboard } from '../keyboards/servicesKeyboard.js';
import { formatServiceMessage, getErrorMessage } from '../utils/messageFormatters.js';
import { messages } from '../utils/messages.js';

async function handleServiceDetails(bot, query, chatId, language) {
  const serviceId = query.data.replace('service_', '');
  
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (serviceError) throw serviceError;

  const keyboard = getServiceActionKeyboard(service.id, language);

  if (service.photo_url) {
    console.log('Attempting to send service photo:', service.photo_url);
    const imageBuffer = await downloadImage(service.photo_url);
    
    if (imageBuffer) {
      try {
        // Send photo with truncated caption
        const caption = formatServiceMessage(service, language, { truncate: true });
        await bot.sendPhoto(chatId, imageBuffer, {
          caption,
          parse_mode: 'HTML',
          reply_markup: keyboard
        });

        // If message was truncated, send full description in a separate message
        const fullMessage = formatServiceMessage(service, language);
        if (fullMessage.length > caption.length) {
          await bot.sendMessage(chatId, fullMessage, {
            parse_mode: 'HTML',
            reply_markup: keyboard
          });
        }
        return;
      } catch (photoError) {
        console.error('Failed to send photo:', photoError.message);
      }
    }
  }

  // Fallback to text-only message
  const message = formatServiceMessage(service, language);
  await bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function handleCategoryServices(bot, query, chatId, language) {
  const categoryId = query.data.replace('category_', '');
  
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', categoryId)
    .order('name_' + language);

  if (servicesError) throw servicesError;

  if (!services?.length) {
    await bot.sendMessage(chatId, 'No services available in this category.');
    return;
  }

  const keyboard = getServicesKeyboard(services, language);
  await bot.editMessageText(messages.selectService[language], {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

export async function handleServices(bot, query) {
  try {
    const chatId = query.message.chat.id;
    
    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', query.from.id)
      .single();
    
    const language = user?.language || 'uz';

    if (query.data.startsWith('service_')) {
      await handleServiceDetails(bot, query, chatId, language);
    } else if (query.data.startsWith('category_')) {
      await handleCategoryServices(bot, query, chatId, language);
    }
  } catch (error) {
    console.error('Error in services handler:', error);
    const errorMessage = getErrorMessage(language);
    await bot.sendMessage(chatId, errorMessage);
  }
}