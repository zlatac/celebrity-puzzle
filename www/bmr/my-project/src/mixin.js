export default {
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
            isConnected: false,
            adsenseServed:false,
            logo:"https://drive.google.com/uc?id=1ctizeSjjAuaEKuOWPgIjau7A5LNcMA7Q"
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
    created: function(){
        this.validateClubListState()
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
        modalAdsense:function(){
            if(this.adsenseServed === false){
                //No need to call for the same ad unit 
                this.adsenseServed = true
                setTimeout(()=>{
                    (adsbygoogle = window.adsbygoogle || []).push({});
                },100)
            }else{
                console.log('Ad served already')
            }
            
        },
        validateId(){
            let club = this.$store.state.clubs.findIndex((item) => String(item.id) === this.appName)
            if(club === -1){
                this.$router.push('/home')
            }
        },
        validateClubListState(){
            let landingRoute = this.$route.name === '/'
            if(this.$store.state.clubs.length === 0 && !landingRoute){
                this.$router.push('/')
            }
        },
        getClubData(){
            return this.$store.state.clubs.find((item) => String(item.id) === this.appName)
        },
        inputHighlight(){
            let input = document.querySelector('#search')
            input.focus()
            input.setSelectionRange(0, 9999)
        },
        webSocket(){
            if('io' in window){
                //var socket = io('https://mochanow.com');
                var socket = io('http://localhost:8000');
                return socket;
            }
                    
        },
        trackAction(dataObject){
            dataObject.clubId = this.appName
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