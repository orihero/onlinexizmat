import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export function createBot() {
  const bot = new TelegramBot(token, { 
    polling: true,
    // Add error handling options
    request: {
      timeout: 30000, // 30 second timeout
      retry: 3 // Retry failed requests 3 times
    }
  });

  // Global error handler
  bot.on('polling_error', (error) => {
    console.error('Telegram Bot polling error:', error.message);
    // Implement exponential backoff for reconnection
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      bot.startPolling();
    }, 5000);
  });

  bot.on('error', (error) => {
    console.error('Telegram Bot error:', error.message);
  });

  return bot;
}