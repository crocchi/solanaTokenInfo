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
    },
    setHeaders: function(req, res, proxyReq) {
        // Set the Referer or Origin header to a specific site
        proxyReq.setHeader('Referer', 'https://streamingcommunity.lu');
        proxyReq.setHeader('Origin', 'https://scrapercb01.onrender.com/');
    },
    // Remove 'X-Frame-Options' header from the response
    onHeadersReceived: function(req, res, proxyRes) {
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['X-Frame-Options'];
    }
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});