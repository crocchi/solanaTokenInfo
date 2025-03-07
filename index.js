// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
// hosted domain = https://solana-token-info.onrender.com/
var port = process.env.PORT || 8080;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],

    requireHeader: (req) => {
        if(req.url.includes('streamingcommunity')){
            console.log("cors streamingcommunity");
            return [];
        }
        console.log('normale request')
        return ['origin', 'x-requested-with'];
    }

}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
