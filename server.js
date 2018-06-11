var express = require('express');
var path = require('path')
var app = express();
var server = require('http').Server(app);
//var axios = require('axios');
app.set('port', process.env.PORT || 8000);
server.listen(app.get('port'));

// app.get('*',function(req,res,next){
//     if(req.headers['x-forwarded-proto']!='https' && process.env.NODE_ENV === 'production')
//         res.redirect(['https://', req.get('Host'), req.url].join(''))
//     else
//         next() /* Continue to other routes if we're not redirecting */
// })

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/www/index.html');
});

app.get('/myipaddress', function (req, res) {
    let ip = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(",")[0];
    
    res.send(ip);
});
app.use(express.static(path.resolve(__dirname, 'www')));

