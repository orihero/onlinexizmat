export function getContactKeyboard(language) {
  const buttonText = language === 'uz' ? "☎️ Raqamni yuborish" : "☎️ Поделиться номером";
  
  return {
    keyboard: [[{
      text: buttonText,
      request_contact: true
    }]],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}