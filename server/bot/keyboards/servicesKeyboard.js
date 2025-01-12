export function getServicesKeyboard(services = [], language) {
  console.log('Creating services keyboard with:', {
    servicesCount: services.length,
    services: services,
    language
  });
  
  // Create keyboard buttons array
  const keyboard = [];
  
  // Add service buttons, 2 per row
  for (let i = 0; i < services.length; i += 2) {
    const row = [];
    
    // Add first button in row
    const firstService = services[i];
    console.log('Adding service to keyboard:', firstService);
    
    row.push({
      text: firstService[`name_${language}`],
      callback_data: `service_${firstService.id}`
    });
    
    // Add second button if exists
    if (i + 1 < services.length) {
      const secondService = services[i + 1];
      console.log('Adding second service to keyboard:', secondService);
      
      row.push({
        text: secondService[`name_${language}`],
        callback_data: `service_${secondService.id}`
      });
    }
    
    keyboard.push(row);
  }
  
  // Add back button as the last row
  keyboard.push([{
    text: language === 'uz' ? '⬅️ Orqaga' : '⬅️ Назад',
    callback_data: 'category_list'
  }]);

  const result = {
    inline_keyboard: keyboard
  };

  console.log('Final services keyboard structure:', JSON.stringify(result, null, 2));
  return result;
}