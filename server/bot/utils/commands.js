export async function setupCommands(bot) {
  await bot.setMyCommands([
    { command: 'start', description: 'Botni ishga tushirish / Запустить бота' }
  ]);
}