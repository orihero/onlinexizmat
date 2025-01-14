export function getQuestionKeyboard(type, language) {
  const buttons = {
    uz: {
      confirm: '✅ Tasdiqlash',
      cancel: '❌ Bekor qilish',
      yes: '✅ Ha',
      no: '❌ Yo\'q'
    },
    ru: {
      confirm: '✅ Подтвердить',
      cancel: '❌ Отменить',
      yes: '✅ Да',
      no: '❌ Нет'
    }
  };

  if (type === 'yes_no') {
    return {
      inline_keyboard: [
        [
          { text: buttons[language].yes, callback_data: 'answer_yes' },
          { text: buttons[language].no, callback_data: 'answer_no' }
        ]
      ]
    };
  }

  return {
    inline_keyboard: [
      [{ 
        text: buttons[language].confirm,
        callback_data: 'confirm_answer'
      }],
      [{ 
        text: buttons[language].cancel,
        callback_data: 'cancel_answer'
      }]
    ]
  };
}