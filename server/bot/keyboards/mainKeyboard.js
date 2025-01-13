export function getMainKeyboard(language) {
  const buttons = {
    uz: {
      categories: "📋 Kategoriyalar",
      settings: "⚙️ Sozlamalar",
      balance: "💰 Balans"
    },
    ru: {
      categories: "📋 Категории",
      settings: "⚙️ Настройки",
      balance: "💰 Баланс"
    }
  };

  return {
    keyboard: [
      [{ text: buttons[language].categories }],
      [
        { text: buttons[language].settings },
        { text: buttons[language].balance }
      ]
    ],
    resize_keyboard: true
  };
}

export function getAnswerKeyboard(language) {
  const buttons = {
    uz: {
      confirm: "✅ Tasdiqlash",
      cancel: "❌ Bekor qilish"
    },
    ru: {
      confirm: "✅ Подтвердить",
      cancel: "❌ Отменить"
    }
  };

  return {
    keyboard: [
      [{ text: buttons[language].confirm }],
      [{ text: buttons[language].cancel }]
    ],
    resize_keyboard: true
  };
}