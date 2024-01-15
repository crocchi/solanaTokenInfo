const TelegramBot = require('node-telegram-bot-api');
//const { Connection, PublicKey } = require('@solana/web3.js');
//const { Token } = require('@solana/spl-token');
//53xconst { signalExit } = require('signal-exit');

// Sostituisci 'TOKEN_DEL_TUO_BOT' con il token effettivo del tuo bot
const tokenApi ="6813572864:AAGyTZVfMxwqvTkexOSiW9dAM2LKuRzNhgE";

const bot = new TelegramBot(tokenApi, { polling: true } );

// Mappa per tenere traccia dello stato di ogni utente
const userStates = new Map();

let rete, indirizzo,chatId;

bot.on('message', async (msg) => {
  chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;
  console.log(msg)

  // Verifica lo stato dell'utente
  const currentState = userStates.get(userId) || 0;

  //if (messageText === '/starter') {
   // bot.sendMessage(chatId, 'Welcome to the bot!');
 // }

  var bye = "esci";
if (messageText.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(chatId, `Ciao ${msg.chat.first_name}! Alla prox..` );
   await bot.stopPolling();
    process.exit(0);
  
};


if (messageText.includes('/token')) {
    
    //token acquisito
   
    // Estrai l'input dall'utente
    const userInput = messageText.replace('/token', '').trim();
    [rete, indirizzo] = userInput.split(/\s+/);
    if(!rete){
        bot.sendMessage(chatId, `Richiesta vuota...riprova`);
        return
    }
    
    //aggionra stato user
    userStates.set(userId, 1);

    bot.sendMessage(chatId, `Cerco il token:[${indirizzo}] sulla rete ${rete}`);
   //let data= await getTokenInfo('EoXn2uKYCx8e8vV84Rn83UuTjBerZwmgQBB9VqP8NDYM');//
   let infoToken= await getTokenInfo(indirizzo,rete);
   //console.log(infoToken)
  

   //bot.sendMessage(msg.chat.id,"<b>bold</b> \n <i>italic</i> \n <em>italic with em</em> \n <a href=\"http://www.example.com/\">inline URL</a> \n <code>inline fixed-width code</code> \n <pre>pre-formatted fixed-width code block</pre>" ,{parse_mode : "HTML"});


   bot.sendMessage(chatId, `

   ℹ️ Token: [ ${infoToken.name} ] \n 
   ⚙ Chain: [ ${rete} ] \n 
   #⃣ Simbolo: [ ${infoToken.symbol} ] \n 
   ✴️ Mcap: [ $ ${shortN(infoToken.mcap) || '--'} ] \n 
   *⃣ Fornitura Tot: [ ${shortN(infoToken.totalSupply)} ] \n
    🔒 Holders: [ ${infoToken.holders} ] \n
    💰 [ $ ${(infoToken.price).toFixed(10)} ] \n
    ⏪ 5m: [ $ ${(infoToken.price5m).toFixed(10)} ] [${infoToke.variation5m.toFixed(2)}%] \n 
    ⏪ 1h: [ $ ${(infoToken.price1h).toFixed(10)} ] [${infoToke.variation1h.toFixed(2)}%]  \n 
    ⏪ 6h: [ $ ${(infoToken.price6h).toFixed(10)} ] [${infoToke.variation6h.toFixed(2)}%]  \n 
    ⏪ 24h: [ $ ${(infoToken.price24h).toFixed(10)} ] [${infoToke.variation24h.toFixed(2)}%]`
    ,{parse_mode : "HTML"});
   
   if(infoToken.creationTime){
   bot.sendMessage(chatId, ` 🆙 Creato: [ ${infoToken.creationTime} ]`);
}

bot.sendMessage(msg.chat.id, `Puoi impostare un avviso.. `, {
    "reply_markup": {
        "keyboard": [["Imposta avviso"]]
        }
    });
  }



  if (messageText.includes('Imposta avviso')) {

    // Estrai l'input dall'utente
    switch (currentState) {

        case 1:
            //hai impostato il token..andiamo avanti
           // const nome = userInput;
            bot.sendMessage(chatId, `Stai per impostare un avviso sul token #${infoToke.symbol}...`);   
            bot.sendMessage(chatId, `Prezzo:${infoToke.price}...`);
            bot.sendMessage(chatId, `es: imposta avviso ${infoToke.price*2} `);
            // Aggiorna lo stato dell'utente
            userStates.set(userId, 2);
            break;

        case 2:
                // Terzo stato: salva l'età e completa il processo
                   // Estrai l'input dall'utente
            const userInput = messageText.replace('Imposta avviso ', '').trim();
            const allert = userInput//.split(/\s+/);
              
                bot.sendMessage(chatId, `⏱⏱ Avviso Impostato sul Token #${infoToke.symbol} - $${allert} ⏱⏱ `);
                // Resetta lo stato dell'utente
                notifica(rete,infoToke.address,allert)
                userStates.delete(userId);
                break;
        
        default:
                    // Gestisci eventuali altri stati o casi
                   // bot.sendMessage(chatId, 'Errore di stato.');
                    bot.sendMessage(chatId, 'Imposta prima il token... /token rete indirizzotoken ');
                    break;
                
    }    

   
  }


})//fine bot.on message

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, `Benvenuto ${msg.chat.first_name}, \n
    Scegli un token e poi imposta l'avviso \n
     1⃣  /token [solana,bsc,ether] [Indirizzo Token] \n
     2⃣  Imposta avviso 
     `,
     /*{ parse_mode: 'Markdown' }*/);
   //  `*Stringa Copiabile:*\n \`${copiabileString}\``
 
    /*  
bot.sendMessage(msg.chat.id, `Benvenuto ${msg.chat.first_name }`, {
    "reply_markup": {
        "keyboard": [["esci", "token"],   ["Keyboard"], ["I'm robot"]]
        }
    });
  */  
});

bot.onText(/\/exit/, (msg) => {

    bot.sendMessage(msg.chat.id, `Ciao ${msg.chat.first_name}!Alla prox..` );
    bot.stopPolling();
    process.exit(0);
    
});

/*
// Gestisci i messaggi di testo
bot.on('text', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    // Rispondi con il testo ricevuto
    bot.sendMessage(chatId, `Hai scritto: ${text}`);
  });
*/

  console.log('avvio bot TG');

  process.on('SIGINT', () => {
    console.log('Ricevuto segnale di interruzione. Il bot si sta chiudendo...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Ricevuto segnale di terminazione. Il bot si sta chiudendo...');
    process.exit(0);
  });

//https://open-api.dextools.io/free/v2/token/bsc/0x69b14e8d3cebfdd8196bfe530954a0c226e5008e/info
//let apiKey = MGG0nGPtz2XgiOAQh2RbRTE1xi60EBoo
    //let url='https://open-api.dextools.io/free/';
let chainIdData = [
    {name:'SOLANA',id:'solana'},
{name:'ETHEREUM',id:'ether'},
{name:'BNB_SMART_CHAIN',id:'bsc'},
{name:'POLYGON',id:'polygon'},
{name:'AVALANCHE_C_CHAIN',id:'avalanche'},
{name:'CRONOS',id:'bsc'}

]
let optionsApi = {
    method: 'GET',
    headers: {
      'X-BLOBR-KEY': 'MGG0nGPtz2XgiOAQh2RbRTE1xi60EBoo'
    },
  };
// api key seco  = byHLxfnpOIbgipJ1Hx8TG9KLQbE84OXJ
// solana chian id = 1399811149

/*
/[GET]/v2/token/{chain}/{address} token address
{
  "statusCode": 200,
  "data": {
    "address": "0x69b14e8d3cebfdd8196bfe530954a0c226e5008e",
    "name": "SpacePi Token",
    "symbol": "SpacePi",
    "creationTime": "2022-03-15T16:53:59.000Z",
    "creationBlock": 16085847,
    "decimals": 9,
    "socialInfo": {
      "github": "",
      "telegram": "https://t.me/SpacePi_com",
      "twitter": "https://twitter.com/SpacePi_Com",
      "website": "https://space-pi.com/",
      "bitbucket": "",
      "tiktok": "",
      "youtube": ""
    }
  }

  [GET]/v2/token/{chain}/{address}/info
  {
  "statusCode": 200,
  "data": {
    "circulatingSupply": 1992010398569455,
    "totalSupply": 1992010398569455,
    "mcap": 2350024.8991439436,
    "fdv": 2350024.8991439436,
    "holders": 2770404,
    "transactions": 3406
  }
}

/[GET]/v2/token/{chain}/{address}/pools
fetch('https://open-api.dextools.io/free/v2/token/bsc/0x69b14e8d3cebfdd8196bfe530954a0c226e5008e/pools?from=2015-01-01&order=asc&sort=creationTime&to=2024-01-01', options)
{
  "statusCode": 200,
  "data": {
    "page": 0,
    "pageSize": 20,
    "totalPages": 4,
    "results": [
      {
        "creationBlock": 16088317,
        "creationTime": "2022-03-15T18:58:49.000Z",
        "exchange": {
          "name": "Pancakeswap",
          "factory": "0xca143ce32fe78f1f7019d7d551a6402fc5350c73"
        },
        "address": "0x7f1b11a798273da438b4b132df1383d8387e73b4",
        "mainToken": {
          "name": "SpacePi Token",
          "symbol": "SpacePi",
          "address": "0x69b14e8d3cebfdd8196bfe530954a0c226e5008e"
        },
        "sideToken": {
          "name": "Wrapped BNB",
          "symbol": "WBNB",
          "address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        }
      },

[GET]/v2/token/{chain}/{address}/price
https://open-api.dextools.io/free/v2/token/bsc/0x69b14e8d3cebfdd8196bfe530954a0c226e5008e/price
{
2
  "statusCode": 200,
3
  "data": {
4
    "price": 1.0972860914735439e-9,
5
    "priceChain": 3.4608522583647604e-12,
6
    "price5m": 1.1003781437106053e-9,
7
    "priceChain5m": 3.4684175966225938e-12,
8
    "variation5m": -0.28099905970820904,
9
    "variationChain5m": -0.21812074374205626,
10
    "price1h": 1.2234560724024389e-9,
11
    "priceChain1h": 3.895440872182434e-12,
12
    "variation1h": -10.312587740166379,
13
    "variationChain1h": -11.156339630800083,
14
    "price6h": 9.118091626824775e-10,
15
    "priceChain6h": 2.8646980508652e-12,
16
    "variation6h": 20.341639060240023,
17
    "variationChain6h": 20.810368035804295,
18
    "price24h": 8.724591427549393e-10,
19
    "priceChain24h": 2.8815666262477255e-12,
20
    "variation24h": 25.769338379408225,
21
    "variationChain24h": 20.10314898987293
22
  }
23
}


{  //info
  "statusCode": 200,
  "data": {
    "circulatingSupply": 1992010398569455,
    "totalSupply": 1992010398569455,
    "mcap": 2342401.2704516314,
    "fdv": 2342401.2704516314,
    "holders": 2770364,
    "transactions": 3406
  }
} */

let infoToke;
const getTokenInfo = async (address,chainId='solana')=> {

    // INFO PREZZO

    let urlBuild= `http://open-api.dextools.io/free/v2/token/${chainId}/${address}/price`;
    let tokenInfoTmp=[];

    await fetch(urlBuild,optionsApi)
    .then(response => response.json())
    .then(response => {
        console.log('fetch :', response.data)
        tokenInfoTmp.push(response.data)
    })
    .catch(err => console.error(err));

    // INFO TOKEN nome e symbolo

    let urlBuildToken= `http://open-api.dextools.io/free/v2/token/${chainId}/${address}`;
    await fetch(urlBuildToken,optionsApi)
    .then(response => response.json())
    .then(response => {
        console.log('fetch :' ,response.data)
        tokenInfoTmp.push(response.data)
    })
    .catch(err => console.error(err));


    // INFO TOKEN volume e marketcap
await sleep(2000)
    let urlBuildVol= `http://open-api.dextools.io/free/v2/token/${chainId}/${address}/info`;
    await fetch(urlBuildVol,optionsApi)
    .then(response => response.json())
    .then(response => {
        console.log('fetch :' ,response.data)
        tokenInfoTmp.push(response.data)
    })
    .catch(err => console.error(err));

//console.log(tokenInfoTmp)

     infoToke={
            price    : tokenInfoTmp[0].price,
            price5m  : tokenInfoTmp[0].price5m || 0,
            variation5m : tokenInfoTmp[0].variation5m || 0,
            price1h  : tokenInfoTmp[0].price1h || 0,
            variation1h : tokenInfoTmp[0].variation1h || 0,
            price6h  : tokenInfoTmp[0].price6h || 0,
            variation6h : tokenInfoTmp[0].variation6h || 0,
            price24h : tokenInfoTmp[0].price24h || 0,
            variation24h : tokenInfoTmp[0].variation24h || 0,
            address  : tokenInfoTmp[1].address,
            name     : tokenInfoTmp[1].name,
            symbol   : tokenInfoTmp[1].symbol,
        creationTime : tokenInfoTmp[1].creationTime || false ,
   circulatingSupply : tokenInfoTmp[2].circulatingSupply  || false,
            totalSupply :  tokenInfoTmp[2].totalSupply || false,
            mcap : tokenInfoTmp[2].mcap || tokenInfoTmp[2].fdv ,
            holders : tokenInfoTmp[2].holders || false 
            }

   
return infoToke
}


// wsol = So11111111111111111111111111111111111111112
  async function getTokenInfoo(tokenAddress) {
    // Connessione alla rete Solana
    const connection = new Connection('https://api.mainnet-beta.solana.com');
  
    try {
      // Creazione di un oggetto PublicKey dallo string dell'indirizzo del token
      const tokenPublicKey = new PublicKey(tokenAddress);
  
      // Ottenere informazioni sul token
     // const tokenInfo = await Token.getProvider().getAccountInfo(tokenPublicKey, 'recent');
     const tokenInfo = await connection.getTokenSupply(tokenPublicKey);
     console.log('Informazioni sul contratto del token:', tokenInfo);
     /*
      // Stampa delle informazioni
      console.log('Token Name:', tokenInfo.name);
      console.log('Token Symbol:', tokenInfo.symbol);
      console.log('Token Mint:', tokenInfo.mint.toString());
      console.log('Token Decimals:', tokenInfo.decimals);
      console.log('Token Owner:', tokenInfo.owner.toString());
      */
      return tokenInfo
    } catch (error) {
      console.error('Errore durante l\'ottenimento delle informazioni sul token:', error);
    }
  }
  
  

  // Funzione per convertire un numero in notazione scientifica a binario
function scientificToBinary(num) {
    // Estrai il coefficiente e l'esponente dalla notazione scientifica
    const [coefficient, exponent] = num.toString().toLowerCase().split('e');
  
    // Converti il coefficiente e l'esponente in numeri
    const coefficientNum = parseFloat(coefficient);
    const exponentNum = parseInt(exponent);
  
    // Calcola la parte binaria del coefficiente
    const coefficientBinary = coefficientNum.toString(2);
  
    // Calcola la posizione del punto decimale nella rappresentazione binaria
    const decimalPointPosition = coefficientBinary.indexOf('.');
  
    // Calcola la posizione del punto decimale nella rappresentazione decimale
    const decimalPointShift = exponentNum + decimalPointPosition;
  
    // Calcola il numero binario finale
    const binaryResult = (coefficientNum * 2 ** decimalPointShift).toString(2);
  
    return binaryResult;
  }
  
  // Esempio di utilizzo
  /*
  const numeroInNotazioneScientifica = 1.103e-9;
  const numeroInBinario = scientificToBinary(numeroInNotazioneScientifica);
  
  console.log(numeroInBinario);
  */
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  function shortN(numero) {
    const abbreviazioni = ["", "Mila", "Milioni", "Miliardi", "Bilione", "Trilione", "E"];
    let abbreviazioneIndex = 0;
  
    while (numero >= 1000 && abbreviazioneIndex < abbreviazioni.length - 1) {
      numero /= 1000;
      abbreviazioneIndex++;
    }
  
    return `${numero.toFixed(1)} ${abbreviazioni[abbreviazioneIndex]}`;
  }
  
let timer;
let tempo=60000 // 1min - timer loop controllo prezzo
let workTimerNotifica=150000 // tempo di attività della notifica

const notifica = (chainId,address,priceSet) =>{

   
      timer = setInterval(() => {

        // Operazioni da eseguire ogni intervallo di tempo
        console.log("Operazioni eseguite!");
        let urlBuild= `http://open-api.dextools.io/free/v2/token/${chainId}/${address}/price`;
    let tokenInfoTmp=[];
        //console.log(urlBuild)
    fetch(urlBuild,optionsApi)
    .then(response => response.json())
    .then(response => {
        console.log(response.data.price)
        console.log(priceSet)
        if(response.data.price > priceSet){
            bot.sendMessage(chatId, `
            Prezzo SUperato!!!!\n
            Prezzo Ora:${response.data.price} \n
            Prezzo Impostato: ${priceSet}
            `);
        }
        bot.sendMessage(chatId, `
        Prezzo Live:${response.data.price} \n
        Prezzo Impostato: ${priceSet}
        `);
    })
    .catch(err => console.error(err));

    
        // Puoi inserire qui le operazioni che desideri eseguire
    }, tempo);
    

    // Per fermare il timer dopo un certo periodo di tempo (ad esempio, dopo 30 secondi)
setTimeout(() => {
    clearInterval(timer); // Interrompe il timer
    console.log("Timer fermato dopo 30 secondi.");
    bot.sendMessage(chatId, `Notifica Disattivata`)

},workTimerNotifica);


  }
  
