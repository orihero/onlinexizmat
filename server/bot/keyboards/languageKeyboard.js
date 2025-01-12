export function getLanguageKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "🇺🇿 O'zbekcha", callback_data: 'lang_uz' },
        { text: "🇷🇺 Русский", callback_data: 'lang_ru' }
      ]
    ]
  };
}