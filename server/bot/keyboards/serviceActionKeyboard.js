export function getServiceActionKeyboard(serviceId, language) {
  const buttons = {
    uz: {
      back: '⬅️ Orqaga',
      use: '✅ Xizmatdan foydalanish'
    },
    ru: {
      back: '⬅️ Назад',
      use: '✅ Использовать услугу'
    }
  };

  return {
    inline_keyboard: [
      [
        { text: buttons[language].back, callback_data: 'category_list' },
        { text: buttons[language].use, callback_data: `start_service_${serviceId}` }
      ]
    ]
  };
}