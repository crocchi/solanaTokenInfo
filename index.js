// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
// hosted domain = https://solana-token-info.onrender.com/
var port = process.env.PORT || 8080;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], 
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
    handleProxyRequest: function(req, res, url) {
        if(req.url.includes('streamingcommunity')){
            delete req.headers['x-requested-with'];
            delete req.headers['origin'];
           // req.headers['origin'] = 'streamingcommunity.lu';
           console.log("cors bypass");
        }
    }
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
