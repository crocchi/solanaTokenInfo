const TelegramBot = require('node-telegram-bot-api');

// Sostituisci 'TOKEN_DEL_TUO_BOT' con il token effettivo del tuo bot
const token = 'TOKEN_DEL_TUO_BOT';
const bot = new TelegramBot(token, { polling: true });

// Gestisci i comandi del bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Ciao! Sono il tuo primo bot su Telegram.');
});

bot.onText(/\/sayhello/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! How are you doing?');
});
