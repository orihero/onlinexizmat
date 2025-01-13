export function getQuestionKeyboard(type, language) {
  return {
    inline_keyboard: [
      [{ 
        text: language === 'uz' ? '✅ Tasdiqlash' : '✅ Подтвердить',
        callback_data: 'confirm_answer'
      }],
      [{ 
        text: language === 'uz' ? '❌ Bekor qilish' : '❌ Отменить',
        callback_data: 'cancel_answer'
      }]
    ]
  };
}