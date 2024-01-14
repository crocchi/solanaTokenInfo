const TelegramBot = require('node-telegram-bot-api');
//const { Connection, PublicKey } = require('@solana/web3.js');
//const { Token } = require('@solana/spl-token');
//const signalExit = require('signal-exit');

// Sostituisci 'TOKEN_DEL_TUO_BOT' con il token effettivo del tuo bot
const token = '6813572864:AAGyTZVfMxwqvTkexOSiW9dAM2LKuRzNhgE';

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/starter') {
    bot.sendMessage(chatId, 'Welcome to the bot!');
  }
  
  if (messageText === 'ciao') {
    bot.sendMessage(chatId, `ciao ${msg.chat.first_name}, come posso aiutarti?`);
    console.log(msg);
  }

  if (messageText === 'token') {
    bot.sendMessage(chatId, `ciao ${msg.chat.first_name}`);
    //console.log(msg);
    getTokenInfo('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
  }
  
  if (messageText === 'exit') {
    bot.sendMessage(chatId, `ciao ${msg.chat.first_name}`);
  bot.stopPolling();
  process.exit(0);

  }
  

  
});

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, `Benvenuto ${msg.chat.first_name}!`);
    
    });

