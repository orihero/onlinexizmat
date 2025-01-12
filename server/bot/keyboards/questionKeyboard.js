export function getQuestionKeyboard(type, language) {
  console.log('Creating question keyboard:', { type, language });
  
  let keyboard;
  
  switch (type) {
    case 'yes_no':
      keyboard = {
        inline_keyboard: [
          [
            { 
              text: language === 'uz' ? 'Ha' : 'Да',
              callback_data: 'answer_yes'
            },
            {
              text: language === 'uz' ? "Yo'q" : 'Нет',
              callback_data: 'answer_no'
            }
          ]
        ]
      };
      break;
      
    case 'file':
    case 'picture':
      keyboard = {
        inline_keyboard: [
          [{
            text: language === 'uz' ? 'Bekor qilish' : 'Отменить',
            callback_data: 'cancel_service'
          }]
        ]
      };
      break;
      
    default:
      // For text questions, remove keyboard to allow text input
      keyboard = {
        remove_keyboard: true
      };
  }

  console.log('Generated keyboard:', JSON.stringify(keyboard, null, 2));
  return keyboard;
}