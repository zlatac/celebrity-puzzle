const serviceProvider = {
    data: function(){
        return{
            modalInstance:null,
            modalData:{},
            inputProfile:'',
            loader: false,
            toastInstance: null,
            copiedToClipboard: false,
            challengeFriends: false,
            volume: true,
            noProfileUrl:'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
            isConnected: false
        }
    },
    computed:{
        url(){
            return this.$store.state.url;
        },
        isWindowBig(){
            return this.checkWindow()
        },
        deviceId(){
            if('deviceId' in localStorage){
                return localStorage.deviceId
            }else{
                return 'empty'
            }
        }

    },
    mounted: function(){
        let modal = document.querySelector('.modal');
        let tooltip = document.querySelector('.tooltipped');
        let modalOptions = {}
        if (this.$route.path.includes('game')) modalOptions.dismissible = false
        if (modal) this.modalInstance = M.Modal.init(modal,modalOptions);
        if (tooltip) M.Tooltip.init(tooltip);
                            
    },
    beforeCreate: function(){
        
    },
    methods:{
        safe : function safe (a){
            if(a === undefined || a === null || a === ''){
                return false;
            }
            return true;
        },
        checkWindow: function(){
            if(window.innerWidth > 600 && window.innerWidth > 768){
                //768px is for tablet (ipad)
                return true;
            }
            return false;
	    },
        randomize : function(array) {
			//Algorithm to shuffle an array
			var input = array;

			for (var i = input.length-1; i >=0; i--) {

				var randomIndex = Math.floor(Math.random()*(i+1)); 
				var itemAtIndex = input[randomIndex]; 

				input[randomIndex] = input[i]; 
				input[i] = itemAtIndex;
			}
			return input;
        },
        tones : function(key, octave, release, attack,type){
            tones.release = release || tones.release;
            tones.attack = attack || tones.attack;
            tones.type = type || tones.type;
            if(this.volume === true){
                tones.play(key,octave);
            }            
        },
        vibrate: function(seconds){
            if('vibrate' in navigator && this.volume === true){
                navigator.vibrate(seconds)
            }
        },
        resumeAudioContext: function(){
            //fucking chrome suspends audio context till the user acts on an event in the browser
            if(tones.context.state.includes('suspended')){
                tones.context.resume()
                .then(()=>{console.log('audio context back online')})
            }
        },
        toggleModal: function(modalData){
            this.modalData = modalData
            this.modalInstance.open();
            this.resumeAudioContext()
        },
        generateDeviceId: function(skipredirect){
            //if skipredirect is not true redirect to dash page
            axios('/myipaddress')
            .then((res)=> {
                let ip = res.data
                let unixtime = moment().unix()
                let hash = generateHash(ip,unixtime)
                localStorage.deviceId = hash
            })
            .catch((error)=> {console.warn(new Error(error))})
            .finally(()=>{
                if(skipredirect !== true){
                    this.sendToCategory()
                    console.log('wow')
                } 
            
            })
            function generateHash(ip,time){
                //hash structure is [ip address + time + (ip-random)(time-random)(ip-random)]
                let address = ip.replace('.','')
                let stringtime = String(time)
                let hash = ''
                for(let i=0; i < 3; i++){
                    if(i !== 1){
                        hash += address[Math.floor(Math.random()*address.length)]
                    }else{
                        hash += stringtime[Math.floor(Math.random()*stringtime.length)]
                    }
                }
                return `${ip}-${time}-${hash}`
            }
        },
        clearInterval:function(intervalInstance){
            if(this.safe(intervalInstance)){
                clearInterval(intervalInstance)
            }            
        },
        webSocket(){
            if('io' in window){
                //var socket = io('https://mochanow.com');
                var socket = io();
                return socket;
            }
                    
        },
        trackAction(dataObject){
            let payload = JSON.stringify(dataObject)
            axios.post(`https://styleminions.co/api/blessmyrequest?payload=${payload}`)
        },
        locationPerimeter(latitude,longitude,distance){
            //average human walks 5km/hr => therefore walking 2km in 24 minutes
            //this function returns the pointA and pointD of the perimeter around the users location
            if(distance === undefined) distance = 0.05 //default distance in km tested with google map(50 metres)
            let latitudeInMinutes = latitude*60 // 1 degree = 60 minutes
            let longitudeInMinutes = longitude*60
            let distanceInMinutes = (distance*60)/60 //using 60km/hr
            let pointA = {}
            let pointD = {}
            function minutesToDegrees(minutes){return minutes/60}
            pointA.latitude = minutesToDegrees(latitudeInMinutes + distanceInMinutes)
            pointA.longitude = minutesToDegrees(longitudeInMinutes - distanceInMinutes)
            pointD.latitude = minutesToDegrees(latitudeInMinutes - distanceInMinutes)
            pointD.longitude = minutesToDegrees(longitudeInMinutes + distanceInMinutes)
            
            return {pointA,pointD}

            function filterClubs(){
                clubsArray
                .filter((item)=>{
                    return item.long < mylocation.pointD.longitude && item.long > mylocation.pointA.longitude && item.lat < mylocation.pointA.latitude && item.lat > mylocation.pointD.latitude
                })
                .map((item)=>{item.distance = distanceFromDj(); return item})
                .sort((a,b)=>{if(a.distance < b.distance) return -1; if(a.distance > b.distance) return 1})
                //below is to sort by closest location to the user
                function distanceFromDj(lat1, lon1, lat2, lon2) {
                    //code calculation source https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
                    var p = 0.017453292519943295;    // Math.PI / 180
                    var c = Math.cos;
                    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                            c(lat1 * p) * c(lat2 * p) * 
                            (1 - c((lon2 - lon1) * p))/2;
                  
                    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
                }
            }
        }
    }
}
const landing = Vue.component('landing', {
    // dark theme: #101010
    // dark blue: #070b19
    // dark experiment:#252525
    template:'#landing',
    mixins: [serviceProvider],
    created: function(){
        setTimeout(()=>{
            this.$router.push('/request');
        },3000)
    
    }
});

const spotify = Vue.component('spotify',{
    template:'#spotify',
    mixins: [serviceProvider],
    data: function(){
        return{
            searchInput: '',
            searchResult: [],
            metrics:{requestNumber:0},
            appName: 'blessmyrequest',
            accessNumber:0,
            pendingSearch: [],
            requestedSongs:[],
            noResult:false
        }
    },
    computed:{
        socket(){
            return this.webSocket()
        }
    },
    methods: {
        searchTrack(){
            if(this.safe(this.searchInput)){
                this.loader = true
                // let token = 'BQCmVbA7pD8mZI9pCpUt5HcsO1Fb9nCRqlhcTAu52TpwCS4uxIi4BffjrENegBzfMjhMXHr_esCHR_R0O5M'
                let token = this.$store.state.accessToken
                let query = encodeURIComponent(this.searchInput)
                let type = 'track'
                console.log(this.searchInput)

                fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&access_token=${token}`)
                .then((res)=>{
                    if(res.status === 200){
                        return res.json()
                    }else{
                        return 'fail'
                    }                    
                        
                })
                .catch((err)=>{
                    console.log(new Error(err))
                })
                .then((res)=>{
                    if(res !== 'fail'){
                        this.searchResult = res.tracks.items.map((item)=>{
                            let obj = {}
                            obj.image = item.album.images[1].url
                            obj.song = item.name
                            obj.artist = item.artists.map((item)=> item.name).join(', ')
                            obj.id = item.id
                            return obj
                        })
                        this.noResult = (this.searchResult.length === 0) ? true : false
                        this.pendingSearch = []
                        this.loader = false;
                        this.scrollToResultTop()
                        //this.searchInput = ''
                    }else if(res === 'fail'){
                        this.pendingSearch.push(this.searchInput)
                        this.socket.emit('newTokenPlease')
                    }                    
                })
                .finally((res)=>{
                    let payload = {trackTask:'search',search:this.searchInput, timestamp:moment().toISOString(),domain:location.host}
                    this.trackAction(payload)
                })
            }
        },
        scrollToResultTop(){
            let elem = document.querySelector('.firstresult')
            if(this.safe(elem)){
                elem.scrollIntoView(false) //false aligns the bottom of the element to the bottom of available space and vice versa
            }
        },
        sendRequest(payload){
            if(this.safe(payload) && this.isConnected === true){
                payload.timestamp = moment().toISOString()
                console.log(payload)
                this.socket.emit('audience',{appName:this.appName,id:this.socket.id,task:'request',song:payload})
                this.requestedSongs.push(payload.id)
                payload.trackTask = 'request'
                payload.domain = location.host
                this.trackAction(payload)
            }
        },
        goToDjView(){
            this.accessNumber++
            if(this.accessNumber === 4){
                this.$router.push('/dj')
            }
        },
        alreadyRequested(payload){
            if(this.requestedSongs.findIndex(item => item === payload) !== -1){
                return true
            }
            return false
        }
    },
    created: function(){
        this.socket.on('connect', (data)=>{
            this.isConnected = true
            this.socket.emit('audience',{appName:this.appName,id:this.socket.id,task:'population'});
            console.log(data, 'connected my nigga');
        });
        this.socket.on('disconnect', (data)=>{
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            this.isConnected = false
        });
        this.socket.on('reconnect', (data)=>{
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            this.isConnected = true
        });
        //this.socket.emit('join','we in this bitch son');
        this.socket.on('sendMetrics',(data)=>{
            //console.log(data,'metric data');
            if(data.appName === this.appName && 'task' in data && data.task === 'request'){
                this.metrics = data;
                //this.showMetrics = true;
            }
        });
        this.socket.on('newToken',(data)=>{
            this.$store.commit('accessToken',data)
            if(this.pendingSearch.length > 0){
                this.searchTrack()
            }
        });
        this.socket.on('room',(data)=>{
            console.log(data)
        });
        
    },
    destroyed: function(){
        //console.log('damn son am out')
        this.socket.close()
    }
})

const djSpotify = Vue.component('djSpotify', {
    template:'#djspotify',
    mixins: [serviceProvider],
    data: function(){
        return{
            requestBasket:[],
            population: [],
            pendingTrackDetails:[],
            isConnected: false,
            appName: 'blessmyrequest',
            musicNotes:['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B']
        }
    },
    computed:{
        controlSocket(){
            return this.webSocket()
        },
        requestList(){
            if(this.requestBasket.length > 0){
                return this.requestBasket
                .filter((item)=> item.hide !== true)
                .sort((a,b)=>{
                    //requestCount takes primary precident in sort followed by timestamp
                    //1 (makes b a lower index than a) -1(makes b a higher index than a)
                    if(b.requestCount > a.requestCount){
                        return 1
                    } 
                    if(b.requestCount < a.requestCount){
                        return -1
                    } 
                    if(b.requestCount === a.requestCount && b.timestamp > a.timestamp){
                        return 1
                    }
                    if(b.requestCount === a.requestCount && b.timestamp < a.timestamp){
                        return -1
                    }
                })
            }else{
                return this.requestBasket
            }
            
        }
    },
    methods: {
        hideRequest(payload){
            if(this.safe(payload)){
                let checkIdExist = this.requestBasket.findIndex((item) => item.id === payload.id)
                if(checkIdExist !== -1){
                    this.requestBasket[checkIdExist].hide = true
                }
            }
        },
        getTrackBpm(trackObject){
            let id = trackObject.id
            let token = this.$store.state.accessToken
            fetch(`https://api.spotify.com/v1/audio-features/${id}?access_token=${token}`)
            .then((res)=>{
                if(res.status === 200){
                    return res.json()
                }else{
                    return 'fail'
                }                          
            })
            .catch((err)=>{
                console.log(new Error(err))
            })
            .then((res)=>{
                if(res !== 'fail'){
                    let musicKey = this.musicNotes[res.key]
                    let bpm = Math.floor(Number(res.tempo))
                    let output = `${musicKey} - ${bpm} bpm`
                    let indexInBasket = this.requestBasket.findIndex((item)=> item.id === id)
                    this.requestBasket[indexInBasket].bpm = output
                }else if(res === 'fail'){
                    this.pendingTrackDetails.push(trackObject)
                    this.controlSocket.emit('newTokenPlease')
                }                    
            })
        }
    },
    created:function(){
        this.controlSocket.on('connect', (data)=>{
            this.isConnected = true
            console.log('connected my nigga');
        });
        this.controlSocket.on('disconnect', (data)=>{
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            this.isConnected = false
        });
        this.controlSocket.on('answer',(data)=>{
            if(data.appName === this.appName){
                if('task' in data && data.task === 'population'){
                    console.log('population gwoth complete', data)
                    this.population.push(data)
                }
                if('task' in data && data.task === 'request'){
                    console.log('request added bruh', data)
                    let checkIdExist = this.requestBasket.findIndex((item) => item.id === data.song.id)
                    console.log(checkIdExist)
                    if(checkIdExist === -1){
                        data.song.requestCount = 1
                        data.song.hide = false
                        data.song.bpm = ''
                        this.requestBasket.push(data.song)
                        this.getTrackBpm(data.song)
                    }else{
                        this.requestBasket[checkIdExist].requestCount += 1
                    }
                    this.controlSocket.emit('analytics',{appName:this.appName,requestNumber:this.requestList.length,task:'request'});
                    
                }
                if('task' in data && data.task === 'pendingRequests'){
                    //pending requests from server will include requests already received before disconnection
                    //take only the requests we dont have in the requestBasket to avoid double counting of requests
                    const addUp = (accumulator, currentValue) => accumulator + currentValue
                    let totalRequestsReceived = 0 //default
                    if(this.requestBasket.length > 0){
                        totalRequestsReceived = this.requestBasket.map(item => item.requestCount).reduce(addUp)
                    }
                    
                    let onlyNewPendingRequests = data.pendingRequests.slice(totalRequestsReceived)
                    onlyNewPendingRequests.forEach((request)=>{
                        let checkIdExist = this.requestBasket.findIndex((item) => item.id === request.song.id)
                        console.log(checkIdExist)
                        if(checkIdExist === -1){
                            request.song.requestCount = 1
                            request.song.hide = false
                            request.song.bpm = ''
                            this.requestBasket.push(request.song)
                            this.getTrackBpm(request.song)
                        }else{
                            this.requestBasket[checkIdExist].requestCount += 1
                        }
                    })
                }
            }
            
        })
        this.controlSocket.on('newToken',(data)=>{
            this.$store.commit('accessToken',data)
            if(this.pendingTrackDetails.length > 0){
                let tracks = this.pendingTrackDetails
                this.pendingTrackDetails = []
                tracks.forEach((item)=>{
                    this.getTrackBpm(item)
                })                
            }
        });
        this.controlSocket.on('reconnect', (data)=>{
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            this.isConnected = true
            this.controlSocket.emit('updateRequests')
        });
        
    },
    destroyed: function(){
        //console.log('damn son am out')
        this.controlSocket.close()
    }
})

Vue.component('modal',{
    props:['modalData','test','url','modalPage','urlChallenge','challenger'],
    template:'#comp-modal',
    mixins: [serviceProvider],
    data: function(){
        return{
            whyme:'heloo'
        }
    }
})

Vue.component('champion',{
    props:['index','url'],
    template:`
        <div style="position: relative;">
            <img :src="url" alt="" class="circle responsive-img img-lead" v-imgfallback>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3 animated tada infinite" v-if="index === 0"><i class="fa fa-trophy gold"></i></span>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 1"><i class="fa fa-trophy silver"></i></span>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 2"><i class="fa fa-trophy bronze"></i></span>
            <span class="btn btn-small btn-floating lead-fab z-depth-3" v-if="index > 2">{{index + 1}}</span>
        </div>
    `
});
Vue.component('spinner',{
    props:['colorClass'],
    template:`
        <div class="preloader-wrapper small active">
            <div class="spinner-layer" :class="{'spinner-white-only': colorClass === 'white', 'spinner-celeb': colorClass === 'default'}">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
            </div>
        </div>
    `
});
Vue.directive('prog', {
    update: function(el,binding){
        el.style.width = binding.value + '%';
    }
});
Vue.directive('imgfallback', {
    bind: function(el,binding,vnode){
        let fallback = 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png'
        //let fallback = vnode.context.$parent.noProfileUrl
        el.onerror = function(){
            if(el.src !== fallback){
                el.src = fallback
                //console.log(vnode)
            }
        }
    }
});

Vue.filter('number', function (value) {
  value = Number(value)
  return Math.round(value)
});
Vue.filter('truncate', function (value) {
    if(value && value.length > 20){
        return value.slice(0,20)
    }
    return value
});

const store = new Vuex.Store({
    //state management in VUE
    state:{
        url: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
        accessToken:null
    },
    mutations:{
        url(state, data){
            state.url = data;
        },
        accessToken(state,data){
            state.accessToken = data;
        }
    }
})

const routes = [
  { path: '/request', component: spotify },
  { path: '/dj', component: djSpotify },
  { path: '/', component: landing },
  { path: '*', redirect: '/' }, // wild card situations since the shared url could be modified by users
];
const router = new VueRouter({
  routes // short for `routes: routes`
});

var app = new Vue({
    router:router,
    store:store
}).$mount('#myapp');