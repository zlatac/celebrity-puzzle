var express = require('express');
// const bodyParser = require('body-parser')
// const multer = require('multer')
// const upload = multer() // for parsing multipart/form-data
var path = require('path')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var axios = require('axios');
var querystring = require('querystring');
var fs = require('fs').promises;
var jsdom = require('jsdom');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('port', process.env.PORT || 8000);
server.listen(app.get('port'));

app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https' && process.env.NODE_ENV === 'production')
        res.redirect(['https://', req.get('Host'), req.url].join(''))
    else
        next() /* Continue to other routes if we're not redirecting */
})

app.options('*',function(req,res,next){
    // Necessary for CORS preflight checks from the browser
    res.append('Access-Control-Allow-Origin', '*')
    res.append('Access-Control-Allow-Headers', '*')
    next() /* Continue to other routes if we're not redirecting */
})

app.get('/', function (req, res) {
    //console.log(req.hostname)
    if(req.hostname.includes('celebrity')){
        res.sendFile(__dirname + '/www/index.html');
    }else if(req.hostname.includes('blessmyrequest')){
        res.sendFile(__dirname + '/www/bmr/index.html');
    }else if(req.hostname.includes('betrusted') || req.hostname.includes('report')){
        res.sendFile(__dirname + '/www/cbt/index.html');
    }else{
        // default is celebrity puzzle app
        res.sendFile(__dirname + '/www/index.html');
    }
    
});

app.get('/dj', function(req,res){
    res.sendFile(__dirname + '/www/bmr/index.html');
})

app.get('/cbt', function(req,res){
    res.sendFile(__dirname + '/www/cbt/index.html');
})

app.get('/token', function(req,res){
    res.sendFile(__dirname + '/www/token/index.html');
})

app.get('/reportlandlord', function(req,res){
    res.sendFile(__dirname + '/www/cbt/index.html');
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

var dataStore = {acquiringToken:false,pendingRequests:[],djData:[],partyRooms:{}};
var authorize = Buffer.from('69b05d3b1a0a4bb9a404d8748c5f5a54:84a00b36aff4410a8fdaee869f7fec02').toString('base64')
var alphaMap = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var milk = ''

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

function youtubePlaylist(playListId){
    return axios.request({
        method:'get',
        url:'https://www.googleapis.com/youtube/v3/playlistItems',
        headers:{
            Accept: 'application/json',
            origin: 'https://blessmyrequest.com',
            referer: 'https://blessmyrequest.com'
        },
        params: {
            part: 'snippet',
            playlistId: playListId,
            key: process.env.YOUTUBE_KEY,
            maxResults: 50
        }
    })
}

async function getPlaylists(){
    try {
        const playList = [
            {playListId:'PLz12V8TsgQRnZxHemWzJDIqiZl5lfLqJ_', genre: 'top 40'},
            {playListId:'PLz12V8TsgQRk6bcrtWiIf7KZ2it0upRIG', genre: 'afrobeats'},
            {playListId:'PLz12V8TsgQRkCigOqDmMvxM5WatnJTOcP', genre: 'hip hop'},

        ]
        // const playList = JSON.parse(process.env.PLAY_LIST)
        const listMapping = {}
        playList.forEach((item) => {listMapping[item.playListId] = item.genre})
        const playlistMap = playList.map((item) => youtubePlaylist(item.playListId))
        const responses = await axios.all(playlistMap)
        if (responses.every((item) => item.status === 200)) {
            //console.log(responses)
            const bucket = responses.map((item) => {
                const songs = item.data.items.map((i)=>{
                    let obj = {}
                    obj.image = i.snippet.thumbnails.default.url
                    obj.song = i.snippet.title.split(' - ')[1] || ''
                    obj.artist = i.snippet.title.split(' - ')[0] || ''
                    obj.id = i.snippet.resourceId.videoId
                    return obj
                })
                return {
                    genre: listMapping[item.config.params.playlistId],
                    songs
                }
            })
            //console.log(bucket, bucket[0].songs[0])
            await fs.writeFile('playlist.json', JSON.stringify(bucket))

        }else {
            throw new Error('oh oh')
        }
    } catch (error) {
        console.log(error)
    }
}

//console.log(process.env.YOUTUBE_KEY)
console.log(`Name is ${process.env.SERVER_NAME}`)
// getPlaylists()

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

function generatePartyCode(){
    let hash = '';
    for(let i=0; i < 4; i++){
        hash += alphaMap[Math.floor(Math.random()*alphaMap.length)]
    }
    
    // if code is already in use create a new code
    if (hash in dataStore.partyRooms) {
        return generatePartyCode()
    }

    return hash
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
    let template;
    //console.log(req)
    if(insta !== undefined){
        axios.get(`https://www.instagram.com/${insta}/`,{
            // withCredentials: true,
            headers: {
                // 'Content-Type' : 'application/json',
                // 'Cookie': `sessionid=${process.env.INSTASESSION}`
            }
        })
        .then(async (data)=>{
            // console.log(data)
            // await fs.writeFile('instahtmloutput.html', data.data)
            template = data.data
            // const filterJavascriptSource = template.match(/(<script type="application\/ld\+json").*script><link/g)
            // const extractObject = filterJavascriptSource[0].match(/({.*})</)
            // const parseObject = JSON.parse(extractObject[1])
            const domDocument = new jsdom.JSDOM(data.data).window.document
            const profilePic = domDocument.querySelector('meta[property="og:image"]').getAttribute('content')
            const fullName = domDocument.querySelector('title').innerHTML.split('•')[0].trim().split(' ')
            // Remove bracket with @instahandle
            fullName.pop()
            const responsePayload = {
                graphql: {
                    user: {
                        full_name: (Array.isArray(fullName) && fullName.length > 0) ? fullName.join(' ') : insta,
                        profile_pic_url: profilePic
                    }
                }
            }
            res.send(responsePayload)
            res.status(200)
        })
        .catch((error)=>{
            res.send(`${error.toString()} ${template}`)
            res.status(404)
        });
    }else{
        res.status(400)
        res.send(insta)
    }
});

app.get('/insta-feed', function(req,res){
    const feedId = req.query.id;
    let template;
    // const moo = encodeURIComponent(`https://www.instagram.com/p/${id}/?utm_source=ig_web_copy_link`)
    //console.log(req)
    if(feedId !== undefined){
        axios.get(`https://www.instagram.com/p/${feedId}/?utm_source=ig_web_copy_link`,{
            withCredentials: true,
            headers: {
                // 'Content-Type' : 'application/json',
                // 'Cookie': `sessionid=${process.env.INSTASESSION};`
            }
        })
        .then((data)=>{
            // console.log(data)
            template = data.data
            const filterJavascriptSource = template.match(/(<script type="application\/ld\+json").*script><link/g)
            const extractObject = filterJavascriptSource[0].match(/({.*})</)
            const parseObject = JSON.parse(extractObject[1])
            res.send(parseObject)
            res.status(200)
        })
        .catch((error)=>{
            res.send(`${error.toString()} ${template}`)
            res.status(404)
        });
    }else{
        res.status(400)
        res.send(feedId)
    }
});

app.post('/startParty', function(req,res){
    const partyName = req.query.name.trim();
    if(partyName !== undefined && partyName !== '' && partyName.length <= 26){
        const partyCode = generatePartyCode()
        dataStore.partyRooms[partyCode] = {name: partyName}
        res.status(200)
        res.send({
            code: partyCode.toUpperCase(),
            name: partyName
        })
    }else{
        res.status(400)
        res.send('Need a name for the party (26 characters max)')
    }
});

app.get('/startParty', function(req,res){
    const partyCode = req.query.code.trim().toLowerCase();
    if(partyCode !== undefined && partyCode !== '' && partyCode.length <= 5 && partyCode in dataStore.partyRooms){
        const partyName = dataStore.partyRooms[partyCode].name
        res.status(200)
        res.send({
            code: partyCode.toUpperCase(),
            name: partyName
        })
    }else{
        res.status(400)
        res.send(`Party "${partyCode}" does not exist`)
        io.sockets.emit('sessionOver', partyCode);
    }
});

app.get('/allPlaylist', async function(req,res){
    try {
        const data = await fs.readFile('playlist.json')
        res.status(200)
        res.send(JSON.parse(data))
    } catch (error) {
        res.status(404)
        res.send('ooops something went wrong')
    }
});

app.get('/paySecret', async function(req,res){
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 999,
            currency: 'usd',
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
        });
        // send transaction id to database
        res.json({client_secret: paymentIntent.client_secret});
    } catch (error) {
        res.status(404)
        res.send('ooops something went wrong')
    }
});

const trader = {
    // For namecheap nodejs setup all api paths must be prepended with the namecheap nodejs app url
    constants: {
        IN: 'in',
        OUT: 'out',
        LOCAL_SERVER: 'local',
        CLOUD_SERVER: 'cloud',
        tradingStartTime: [9,30,0],
        tradingEndTime: [16,0,0]
    },
    asyncOperation: {
        historyTimeout: undefined,
        history: [],
        confirmTimeout: undefined,
        confirm: [],
        ordersToExecute: [],
        notificationOrders: [],
        pingPongTracker: {},
    },
    methods: {
        checkOrSetupFileStorage: async (file = process.env.STOCK_VISION_STORAGE_FILE) => {
            try {
                const fileExist = await fs.lstat(file)
            } catch (error) {
                // Create file to store trader api data
                await fs.writeFile(file, JSON.stringify({}))
            }
        },
        processHistories: async () => {
            try {
                const historyAmount = trader.asyncOperation.history.length
                if (historyAmount === 0) {
                    return
                }
                const data = await fs.readFile(process.env.STOCK_VISION_STORAGE_FILE)
                const parsedData = JSON.parse(data)
                for (let i = 0; i < historyAmount; i++) {
                    const item = trader.asyncOperation.history[i]
                    const position = parsedData[item.code]?.position
                    const codeExists = item.primaryCode && item.primaryCode in parsedData && parsedData[item.primaryCode]
                    if (codeExists) {
                        if (!Array.isArray(parsedData[item.primaryCode].peakValleyHistory)) {
                            parsedData[item.primaryCode].peakValleyHistory = []
                        } 
            
                    } else {
                        parsedData[item.primaryCode] = {
                            position: 'out',
                            peakValleyHistory: []
                        }
                    }
            
                    parsedData[item.primaryCode].peakValleyHistory.push(...item.peakValleyToday)
                }
                await fs.writeFile(process.env.STOCK_VISION_STORAGE_FILE, JSON.stringify(parsedData))
                trader.asyncOperation.history.splice(0, historyAmount)
                console.log('history set')
            } catch (error) {
                // console.log('Failed to write history')
                console.log(error)
            }
        },
        processConfrimations: async () => {
            try {
                const confirmationAmount = trader.asyncOperation.confirm.length
                if (confirmationAmount === 0) {
                    return
                }
                const data = await fs.readFile(process.env.STOCK_VISION_STORAGE_FILE)
                const parsedData = JSON.parse(data)
                for (let i = 0; i < confirmationAmount; i++) {
                    const item = trader.asyncOperation.confirm[i]
                    if (!(item.code in parsedData)) {
                        parsedData[item.code] = {}
                    }
                    parsedData[item.code].position = item.position
                    parsedData[item.code].date = item.payloadDate
                    parsedData[item.code].price = item.price  
                }
                await fs.writeFile(process.env.STOCK_VISION_STORAGE_FILE, JSON.stringify(parsedData))
                trader.asyncOperation.confirm.splice(0, confirmationAmount)
                console.log('confirmation set')
            } catch (error) {
                console.log(error)
            }
        },
        notify: async (subject = '', message, brokerageName = '') => {
            try {
                let subjectPrefix = '[LS] NOTIFICATION'
                subjectPrefix = brokerageName !== '' ? `${subjectPrefix} (${brokerageName})` : subjectPrefix
                const response = await axios.post(`https://styleminions.co/api/trader/notify`, {
                    subject: `${subjectPrefix} ${subject}`,
                    message: `${message}`,
                }) 
            } catch (error) {
                console.log(error)
            }
        },
        checkWebBrowserCrashed: async (brokerageName) => {
            const brokerageNameExists = brokerageName in trader.asyncOperation.pingPongTracker
            if (!brokerageNameExists) {
                trader.asyncOperation.pingPongTracker[brokerageName] = {timeoutInstance: undefined}
            }

            const brokerageObject = trader.asyncOperation.pingPongTracker[brokerageName]
            const oneMinute = 1000 * 60
            clearTimeout(brokerageObject.timeoutInstance)
            brokerageObject.timeoutInstance = setTimeout(async () => {
                const now = new Date()
                const nowEpochDate = now.getTime()
                const startTime = now.setHours(...trader.constants.tradingStartTime)
                const endTime = now.setHours(...trader.constants.tradingEndTime)
                if (nowEpochDate >= startTime && nowEpochDate <= endTime) {
                    trader.methods.notify(undefined, 'Browser tab stopped pinging, possibly crashed. Please investigate', brokerageName)
                }
            }, oneMinute * 5)


        }

    }
}

app.post('/trader/notify', async function(req,res){
    res.append('Access-Control-Allow-Origin', '*')
    if (process.env.SERVER_NAME === trader.constants.LOCAL_SERVER) {
        try {
            const prepareOrder = {
                primaryCode: req.query.primaryCode,
                code: req.query.code,
                position: req.query.action === trader.constants.IN ? true : false,
                confirmationLink: req.query.confirmationLink,
                // observationPrice: req.query.currentPrice,
                seenByBrokerage: [],
            }
            const axiosResponse = await axios.get(`https://www-api.cboe.com/ca/equities/securities/${prepareOrder.primaryCode.toUpperCase()}/quote/`, {})
            if (!('name' in axiosResponse.data.data) || axiosResponse.data.data.name !== prepareOrder.primaryCode.toUpperCase()) {
                throw new Error('cannot retrieve price')
            }
            trader.asyncOperation.ordersToExecute.push({...prepareOrder,...axiosResponse.data.data})
            res.sendStatus(200)
        } catch (error) {
            res.status(404)
            res.send(`${error.toString()}`)
            trader.methods.notify(undefined, error.toString(), req.query.primaryCode)
        }
    }

    if (process.env.SERVER_NAME === trader.constants.CLOUD_SERVER) {
        try {
            const response = await axios.post(`https://styleminions.co/api/trader/notify`, {
                subject: req.query.subject,
                message: req.query.message,
            })
            res.sendStatus(202)  
        } catch (error) {
            res.status(404)
            res.send(`${error.toString()}`)    
        }
    }

});

app.get('/trader/confirm', async function(req,res){
     res.append('Access-Control-Allow-Origin', '*')
    try {
        let payloadDate = new Date().toISOString()
        const code = req.query.code.toUpperCase()
        const position = req.query.position
        const positionDate = req.query.date
        const price = Number(req.query.price)
        if (![trader.constants.IN,trader.constants.OUT].includes(position)) {
            throw new Error('position not valid')
        }
        if (isNaN(price)) {
            throw new Error('price not valid number')
        }
        const data = await fs.readFile(process.env.STOCK_VISION_STORAGE_FILE)
        const parsedData = JSON.parse(data)
        if (!(code in parsedData)) {
            parsedData[code] = {position: undefined, price: undefined}
        }
        if (parsedData[code].position === position && parsedData[code].price === price) {
            throw new Error('already confirmed')
        }
        if (positionDate !== undefined) {
            payloadDate = positionDate
        }
        trader.asyncOperation.confirm.push({code, price, position, payloadDate})
        clearTimeout(trader.asyncOperation.confirmTimeout)
        trader.asyncOperation.confirmTimeout = setTimeout(trader.methods.processConfrimations, 500)
        
        res.status(200)
        res.send('confirmed')
    } catch (error) {
        res.status(404)
        res.send(`${error.toString()}`)
    }
});

app.get('/trader/status', async function(req,res){
    res.append('Access-Control-Allow-Origin', '*')
    await trader.methods.checkOrSetupFileStorage()
    try {
        const data = await fs.readFile(process.env.STOCK_VISION_STORAGE_FILE)
        const parsedData = JSON.parse(data)
        const code = req.query.code.toUpperCase()
        const codeExists = code && code in parsedData && parsedData[code]
        res.status(202)
        if (codeExists) {
            const position = parsedData[code].position
            if (position === 'in') {
                res.status(201)
            }
            if (position === 'out') {
                res.status(200)
            }

        }
        res.send(parsedData)
    } catch (error) {
        res.status(404)
        res.send(`${error.toString()}`)
    }
});

app.post('/trader/history', async function(req,res){
    res.append('Access-Control-Allow-Origin', '*')
    await trader.methods.checkOrSetupFileStorage()
    try {
        let code = req.body?.code || req.query.code
        let primaryCode = req.body?.primaryCode || req.query.primaryCode
        code = code.toUpperCase()
        primaryCode = primaryCode.toUpperCase()
        const peakValleyToday = req.body?.peakValleyToday || JSON.parse(req.query.peakValleyToday)
        trader.asyncOperation.history.push({code,primaryCode,peakValleyToday})
        clearTimeout(trader.asyncOperation.historyTimeout)
        trader.asyncOperation.historyTimeout = setTimeout(trader.methods.processHistories, 1500)
        res.sendStatus(202)
    } catch (error) {
        res.status(404)
        res.send(`${error.toString()}`)
    }
});

app.put('/trader/history', async function(req, res) {
    res.append('Access-Control-Allow-Origin', '*')
    /**
     * For production
     * 1. update the checkOrSetupFileStorage method
     * 2. set ENV name in production for STOCK_VISION_STORAGE_RESERVE_FILE
     * 3. add new put route
     * 4. restart node application
     */
    await trader.methods.checkOrSetupFileStorage(process.env.STOCK_VISION_STORAGE_RESERVE_FILE)
    try {
        const midnightFromNowInMilliseconds = new Date().setHours(0,0,0,0)
        const thirtyDaysFromNow = midnightFromNowInMilliseconds - 1000*60*60*24*31
        const currentData = await fs.readFile(process.env.STOCK_VISION_STORAGE_FILE)
        const reserveData = await fs.readFile(process.env.STOCK_VISION_STORAGE_RESERVE_FILE)
        const parsedCurrentData = JSON.parse(currentData)
        const parsedReserveData = JSON.parse(reserveData)
        const codeKeys = Object.keys(parsedCurrentData)
        codeKeys.forEach(code => {
            if ('peakValleyHistory' in parsedCurrentData[code]) {
                const history = parsedCurrentData[code].peakValleyHistory.map((item) => {
                    item.epochDate = Date.parse(item.date)
                    return item
                })
                const reserve = history.filter((item) => item.epochDate < thirtyDaysFromNow).map((item) => {
                    delete item.epochDate
                    return item
                })
                const current = history.filter((item) => item.epochDate > thirtyDaysFromNow).map((item) => {
                    delete item.epochDate
                    return item
                })
                if (!(code in parsedReserveData)) {
                    parsedReserveData[code] = []
                }
                parsedCurrentData[code].peakValleyHistory = current
                parsedReserveData[code].push(...reserve)
            }
        })
        await fs.writeFile(process.env.STOCK_VISION_STORAGE_RESERVE_FILE, JSON.stringify(parsedReserveData))
        await fs.writeFile(process.env.STOCK_VISION_STORAGE_FILE, JSON.stringify(parsedCurrentData))
        res.sendStatus(200)

    } catch(error) {
        res.status(404)
        res.send(`${error.toString()}`)
    }
    
})

app.get('/trader/priceCheck', async function(req,res) {
    res.append('Access-Control-Allow-Origin', '*')
    await trader.methods.checkOrSetupFileStorage()
    try {
        let primaryCode = req.body?.primaryCode || req.query.primaryCode
        const axiosResponse = await axios.get(`https://www-api.cboe.com/ca/equities/securities/${primaryCode.toUpperCase()}/quote/`, {})
        if (!('name' in axiosResponse.data.data) || axiosResponse.data.data.name !== primaryCode.toUpperCase()) {
            throw new Error('cannot retrieve price')
        }
        res.status(200)
        res.send(axiosResponse.data.data)
    } catch (error) {
        res.status(404)
        res.send(`${error.toString()}`)
    }
});

app.get('/trader/tradeCheck', async function(req,res) {
    res.append('Access-Control-Allow-Origin', '*')
    await trader.methods.checkOrSetupFileStorage()
    try {
        let brokerageName = req.body?.brokerageName || req.query.brokerageName
        const ordersToSend = trader.asyncOperation.ordersToExecute.filter((order) => !order.seenByBrokerage.includes(brokerageName))
        res.status(200)
        res.send(ordersToSend)
        trader.methods.checkWebBrowserCrashed(brokerageName)
        ordersToSend.forEach((order) => order.seenByBrokerage.push(brokerageName))
    } catch (error) {
        res.status(404)
        res.send(`${error.toString()}`)
    }
});