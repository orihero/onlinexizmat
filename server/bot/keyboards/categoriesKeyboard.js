export function getCategoriesKeyboard(categories = [], language) {
  console.log('Creating categories keyboard with:', {
    categoriesCount: categories.length,
    categories: categories,
    language
  });
  
  // Create keyboard buttons array
  const keyboard = [];
  
  // Add category buttons, 2 per row
  for (let i = 0; i < categories.length; i += 2) {
    const row = [];
    
    // Add first button in row
    const firstCategory = categories[i];
    console.log('Adding category to keyboard:', firstCategory);
    
    row.push({
      text: firstCategory[`name_${language}`],
      callback_data: `category_${firstCategory.id}`
    });
    
    // Add second button if exists
    if (i + 1 < categories.length) {
      const secondCategory = categories[i + 1];
      console.log('Adding second category to keyboard:', secondCategory);
      
      row.push({
        text: secondCategory[`name_${language}`],
        callback_data: `category_${secondCategory.id}`
      });
    }
    
    keyboard.push(row);
  }
  
  // Add back button as the last row
  keyboard.push([{
    text: language === 'uz' ? '⬅️ Orqaga' : '⬅️ Назад',
    callback_data: 'back_to_main'
  }]);

  const result = {
    inline_keyboard: keyboard
  };

  console.log('Final keyboard structure:', JSON.stringify(result, null, 2));
  return result;
}