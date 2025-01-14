import TelegramBot from 'node-telegram-bot-api';
import { handleStart } from './handlers/startHandler.js';
import { handleLanguage } from './handlers/languageHandler.js';
import { handleContact } from './handlers/contactHandler.js';
import { handleMainMenu } from './handlers/mainMenuHandler.js';
import { handleCategories } from './handlers/categoriesHandler.js';
import { handleServices } from './handlers/servicesHandler.js';
import { handleQuestions } from './handlers/questionsHandler.js';
import { handleAnswer } from './handlers/answerHandler.js';
import { handleText } from './handlers/textHandler.js';
import { handleFile } from './handlers/fileHandler.js';
import { handleGroupEvents } from './handlers/groupHandler.js';
import { setupCommands } from './utils/commands.js';
import { processAdminMessages } from './handlers/messageHandler.js';

export function initializeBot(bot) {
  // Set up command handlers
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));

  // Handle callback queries
  bot.on('callback_query', async (query) => {
    if (query.data.startsWith('lang_')) {
      await handleLanguage(bot, query);
    } else if (query.data === 'category_list' || query.data.startsWith('category_')) {
      await handleCategories(bot, query);
    } else if (query.data.startsWith('service_')) {
      await handleServices(bot, query);
    } else if (query.data.startsWith('start_service_')) {
      await handleQuestions(bot, query);
    } else if (['confirm_answer', 'cancel_answer', 'answer_yes', 'answer_no'].includes(query.data)) {
      await handleAnswer(bot, query);
    }
  });

  // Handle contact sharing
  bot.on('contact', (msg) => handleContact(bot, msg));

  // Handle text messages
  bot.on('message', async (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
      if (['📋 Kategoriyalar', '📋 Категории'].includes(msg.text)) {
        await handleMainMenu(bot, msg);
      } else {
        await handleText(bot, msg);
      }
    }
  });

  // Handle file uploads and media for both service questions and replies
  bot.on('photo', async (msg) => {
    if (msg.reply_to_message) {
      // Handle reply with photo
      await handleFile(bot, msg, true);
    } else {
      // Handle regular file upload for service questions
      await handleFile(bot, msg);
    }
  });
  
  bot.on('document', async (msg) => {
    if (msg.reply_to_message) {
      await handleFile(bot, msg, true);
    } else {
      await handleFile(bot, msg);
    }
  });
  
  bot.on('voice', async (msg) => {
    if (msg.reply_to_message) {
      await handleFile(bot, msg, true);
    } else {
      await handleFile(bot, msg);
    }
  });
  
  bot.on('video_note', async (msg) => {
    if (msg.reply_to_message) {
      await handleFile(bot, msg, true);
    } else {
      await handleFile(bot, msg);
    }
  });
  
  bot.on('video', async (msg) => {
    if (msg.reply_to_message) {
      await handleFile(bot, msg, true);
    } else {
      await handleFile(bot, msg);
    }
  });
  
  bot.on('audio', async (msg) => {
    if (msg.reply_to_message) {
      await handleFile(bot, msg, true);
    } else {
      await handleFile(bot, msg);
    }
  });

  // Handle group events
  bot.on('new_chat_members', (msg) => handleGroupEvents(bot, msg));
  bot.on('left_chat_member', (msg) => handleGroupEvents(bot, msg));
  bot.on('new_chat_photo', (msg) => handleGroupEvents(bot, msg));

  // Set up commands
  setupCommands(bot);

  // Process admin messages periodically
  setInterval(() => {
    processAdminMessages(bot);
  }, 5000);

  console.log('Bot initialized successfully');
}