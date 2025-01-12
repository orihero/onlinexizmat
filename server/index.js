import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createBot } from './lib/telegram.js';
import { initializeBot } from './bot/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Telegram bot with improved error handling
try {
  const bot = createBot();
  initializeBot(bot);
  console.log('Telegram bot initialized successfully');
} catch (error) {
  console.error('Failed to initialize Telegram bot:', error.message);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});