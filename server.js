var express = require('express');
var path = require('path')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var axios = require('axios');
var querystring = require('querystring');
app.set('port', process.env.PORT || 8000);
server.listen(app.get('port'));

app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https' && process.env.NODE_ENV === 'production')
        res.redirect(['https://', req.get('Host'), req.url].join(''))
    else
        next() /* Continue to other routes if we're not redirecting */
})

app.get('/', function (req, res) {
    //console.log(req.hostname)
    if(req.hostname.includes('celebrity')){
        res.sendFile(__dirname + '/www/index.html');
    }else if(req.hostname.includes('blessmyrequest')){
        res.sendFile(__dirname + '/www/bmr/index.html');
    }else{
        // default is celebrity puzzle app
        res.sendFile(__dirname + '/www/index.html');
    }
    
});

app.get('/dj', function(req,res){
    res.sendFile(__dirname + '/www/bmr/index.html');
})

app.get('/myipaddress', function (req, res) {
    let ip = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(",")[0];
    
    res.send(ip);
});

app.get('/engine', function(req,res){
    res.status(200)
    res.sendFile(__dirname + '/www/bmr/engine/dist/bundle.js');
})

app.use(express.static(path.resolve(__dirname, 'www')));

var dataStore = {acquiringToken:false,pendingRequests:[],djData:[]};
var authorize = Buffer.from('69b05d3b1a0a4bb9a404d8748c5f5a54:84a00b36aff4410a8fdaee869f7fec02').toString('base64')
function spotifyToken(client){
    if(dataStore.acquiringToken === false){
        dataStore.acquiringToken = true
        axios.request({
            method:'post',
            url:'https://accounts.spotify.com/api/token',
            headers:{
                Authorization: `Basic ${authorize}`
            },
            data:querystring.stringify({grant_type:'client_credentials'})
        })
        .then((res)=>{
            //console.log(res)
            dataStore.access_token = res.data.access_token
            dataStore.getToken = true
            //emit to everyone both DJ and club audience
            io.sockets.emit('newToken', res.data.access_token);
            dataStore.acquiringToken = false
            //console.log('new token emitted bruh')
        })
        .catch((err)=>{
            console.log('OMG',err)
        })
    }
    
}

function clearDataLater(){
    dataStore.timeout = function(){
        //this empties the question data saved after 20 minutes
        const hours = 5;
        const minutesInHour = 60
        const secondsInMinute = 60000;
        let seconds = hours*minutesInHour*secondsInMinute; //5 hours
        if(!('timeout' in dataStore)){
            return setTimeout(function(){
                dataStore.pendingRequests = dataStore.djData =  [];
                //console.log('its deleted',dataStore)
            },seconds);
        }else{
            clearTimeout(dataStore.timeout);
            return setTimeout(function(){
                dataStore.pendingRequests = dataStore.djData =  [];
                //console.log('its deleted',dataStore)
            },seconds);
        }
        
    }();
    //console.log('wowowowowowo')
}



io.on('connection', function(client) {  
    console.log('Client connected...');
    if('getToken' in dataStore && dataStore.getToken === true){
        io.sockets.connected[client.id].emit('newToken',dataStore.access_token);
    }else{
        //console.log('please go get an access token')
        spotifyToken(client)
    }

    client.on('join', function(data) {
        //console.log(client.id);
        // client.emit('messages', 'Hello from server');
        if(data.appName in dataStore){
            //this is key for emitting to a specific client using the client id
            io.sockets.connected[client.id].emit('question',dataStore[data.appName]);
            //console.log(dataStore[data.appName]);
        }
    });

    client.on('messages', function(data) {
        //client.emit('broad', data);
        //client.broadcast.emit('broad',data);
        //console.log(data, client.id);
        client.join(data.room,()=>{
            console.log(client.rooms)
            io.to(data.room).emit('room','you are in the room now');
        })
    });
    
    client.on('audience', function(data) {
        //console.log(data);
        if('task' in data && data.task === 'request'){
            dataStore.pendingRequests.push(data)
            clearDataLater();
        }
        client.broadcast.emit('answer', data);
        //console.log(dataStore)
    });
    client.on('updateRequests', function(data) {
        //when the dj gets disconnected send stored requests
        const pendingFiltered = dataStore.pendingRequests.filter((item)=> item.appName === data.appName)
        const djExists = dataStore.djData.find( i => i.appName === data.appName)
        let payload = {
            appName:data.appName,
            task:'pendingRequests', 
            pendingRequests:pendingFiltered,
            djData: (djExists !== undefined) ? djExists : {},
        }
        io.sockets.connected[client.id].emit('answer', payload);
        //console.log('i have sent the updated requests you missed',client.id)
        //console.log('filtered list',pendingFiltered)
    });
    client.on('analytics', function(data) {
        //console.log(data);
        client.broadcast.emit('sendMetrics', data);
    });
    client.on('newTokenPlease', function(data) {
        spotifyToken(client)
    });
    client.on('setDj', function(data) {
        //console.log(JSON.stringify(data))
        const appNameExits = dataStore.djData.find( i => i.appName === data.appName)
        if (appNameExits !== undefined && 'appName' in appNameExits) {
            appNameExits.handle = data.handle
            appNameExits.name = data.name
            client.broadcast.emit('djData', {djData:appNameExits});
        } else {
            dataStore.djData.push(data)
            client.broadcast.emit('djData', {djData:data});
        }
        clearDataLater()
    });
    client.on('getDj', function(data) {
        //console.log('they need the DJ bruh')
        //when the club user gets disconnected send djData
        const djExists = dataStore.djData.find( i => i.appName === data.appName)
        if (djExists !== undefined) {
            let payload = {
                djData: djExists,
            }
            io.sockets.connected[client.id].emit('djData', payload)
        }else {
            io.sockets.connected[client.id].emit('noDj')
        }
    });
});

app.get('/profile', function(req,res){
    const insta = req.query.insta;
    //console.log(req)
    if(insta !== undefined){
        axios.get(`https://www.instagram.com/${insta}/`)
        .then((data)=>{
            res.send(data.data)
            res.status(200)
        })
        .catch((error)=>{
            res.send(error.data)
            res.status(404)
        });
    }else{
        res.status(400)
        res.send(insta)
    }
});

