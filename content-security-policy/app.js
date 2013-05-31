var express = require('express');
var app = express();

app.use(express.methodOverride());

// Naive nonce using just timestamp.
var nonce = new Date().valueOf();
 
var contentSecurityPolicy = function(req, res, next) {
    res.header('Content-Security-Policy', "script-src 'self' 'nonce-" + nonce + "' http://ajax.googleapis.com");
    next();
};

app.use(contentSecurityPolicy);

app.get('/', function(req, res){
  // Only inline scripts with a valid nonce should execute.
  var body = '<!doctype html><body>'
           + '<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>\n\n'
           + '<script nonce="' + nonce + '">$("body").append("<p>This should work with a valid nonce.");</script>\n\n'
           + '<script>$("body").append("<p>This should not work because nonce is missing.");</script>\n\n'
           + '<script nonce="bad">$("body").append("<p>This should not work because nonce is invalid.");</script>\n\n'
           + '<script nonce="' + nonce + '">$("body").append("<p>This should also work with a valid nonce.");</script>\n\n';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.listen(3000);
console.log('Listening on port 3000');
