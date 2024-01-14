const TelegramBot = require('node-telegram-bot-api');
const { Connection, PublicKey } = require('@solana/web3.js');
const { Token } = require('@solana/spl-token');

// Sostituisci 'TOKEN_DEL_TUO_BOT' con il token effettivo del tuo bot
const token = '6813572864:AAGyTZVfMxwqvTkexOSiW9dAM2LKuRzNhgE';
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

bot.onText(/\/token/, (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  bot.sendMessage(chatId, 'TOKEN INFO...');
});

async function getTokenInfo(tokenAddress) {
  // Connessione alla rete Solana
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  try {
    // Creazione di un oggetto PublicKey dallo string dell'indirizzo del token
    const tokenPublicKey = new PublicKey(tokenAddress);

    // Ottenere informazioni sul token
    const tokenInfo = await Token.getProvider().getAccountInfo(tokenPublicKey, 'recent');

    // Stampa delle informazioni
    console.log('Token Name:', tokenInfo.name);
    console.log('Token Symbol:', tokenInfo.symbol);
    console.log('Token Mint:', tokenInfo.mint.toString());
    console.log('Token Decimals:', tokenInfo.decimals);
    console.log('Token Owner:', tokenInfo.owner.toString());
  } catch (error) {
    console.error('Errore durante l\'ottenimento delle informazioni sul token:', error);
  }
}

