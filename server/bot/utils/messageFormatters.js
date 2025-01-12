import { truncateText } from './textUtils.js';

const MAX_CAPTION_LENGTH = 1024;
const MAX_MESSAGE_LENGTH = 4096;

export function formatServiceMessage(service, language, options = { truncate: false }) {
  const name = service[`name_${language}`];
  const description = service[`description_${language}`];
  const price = service.base_price;

  const message = `<b>${name}</b>\n\n${description}\n\n💰 ${price} UZS`;
  
  return options.truncate 
    ? truncateText(message, MAX_CAPTION_LENGTH)
    : message;
}

export function getErrorMessage(language) {
  return language === 'uz'
    ? 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'
    : 'Произошла ошибка. Пожалуйста, попробуйте еще раз.';
}