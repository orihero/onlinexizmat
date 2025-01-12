import TelegramBot from 'node-telegram-bot-api';
import { handleStart } from './handlers/startHandler.js';
import { handleLanguage } from './handlers/languageHandler.js';
import { handleContact } from './handlers/contactHandler.js';
import { handleCategories } from './handlers/categoriesHandler.js';
import { handleServices } from './handlers/servicesHandler.js';
import { handleQuestions } from './handlers/questionsHandler.js';
import { handleMainMenu } from './handlers/mainMenuHandler.js';
import { handleFile } from './handlers/fileHandler.js';
import { handleText } from './handlers/textHandler.js';
import { handleAnswer } from './handlers/answerHandler.js';
import { setupCommands } from './utils/commands.js';

export function initializeBot(bot) {
  // Set up commands
  setupCommands(bot);

  // Start command handler
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));

  // Language selection handler
  bot.on('callback_query', async (query) => {
    if (query.data.startsWith('lang_')) {
      await handleLanguage(bot, query);
    }
  });

  // Contact sharing handler
  bot.on('contact', (msg) => handleContact(bot, msg));

  // Main menu handler
  bot.on('message', async (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
      await handleMainMenu(bot, msg);
    }
  });

  // Categories and services navigation
  bot.on('callback_query', async (query) => {
    if (query.data.startsWith('category_') || query.data === 'category_list') {
      await handleCategories(bot, query);
    } else if (query.data.startsWith('service_')) {
      await handleServices(bot, query);
    } else if (query.data.startsWith('start_service_')) {
      await handleQuestions(bot, query);
    } else if (query.data.startsWith('answer_')) {
      await handleAnswer(bot, query);
    }
  });

  // File and text message handlers
  bot.on('document', async (msg) => {
    await handleFile(bot, msg);
  });

  bot.on('photo', async (msg) => {
    await handleFile(bot, msg);
  });

  bot.on('text', async (msg) => {
    // Only handle text messages that aren't commands or main menu items
    if (!msg.text.startsWith('/') && 
        !['📋 Kategoriyalar', '📋 Категории', '⚙️ Sozlamalar', '⚙️ Настройки', '💰 Balans', '💰 Баланс'].includes(msg.text)) {
      await handleText(bot, msg);
    }
  });
}