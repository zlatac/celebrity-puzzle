const serviceProvider = {
    data: function(){
        return{
            modalInstance:null,
            modalData:{},
            leadList:[2,3,4,5,6,7,8,9,11,12,13,14,15,17],
            name:'',
            profileTimeout:null,
            inputProfile:'',
            loader: false,
            toastInstance: null,
            copiedToClipboard: false,
            challengeFriends: false,
            volume: true,
            adsenseServed:false,
            noProfileUrl:'data:image/png;base64,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',
            testProfile: [
                {name:'kimkardashian', profile_url:'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/s150x150/109136688_610125179899980_1868015297406610141_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_ohc=RlASvSr5YV0AX9iQrvO&oh=62fece839704ad5016296d87a840f14e&oe=5F61EAA2'},
                {name:'sofiavergara', profile_url:'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/s150x150/98332166_245276569895880_5201690383163064320_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_ohc=fkOGZeRaYfYAX9GHNaF&oh=24d5f09f05dfa5f463245c36cba044ee&oe=5F6105AC'},
                {name:'champagnepapi', profile_url:'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/s150x150/91255903_2638479089705085_4943092648538800128_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_ohc=6F65w415ac8AX-mtxz2&oh=9100806278f74e7cd9385361c984272a&oe=5F61CFF7'},
            ],
            category:[
                {name:'art',color:'#e61313',text:'art'},
                {name:'kids',color:'#b9499f',text:'kids'},
                {name:'music',color:'#136ee6',text:'music'},
                {name:'movie',color:'#b9499f',text:'movies'},
                {name:'fashion',color:'#e68213',text:'fashion'},
                {name:'sexy',color:'#e61313',text:'sexy girls'},
                {name:'sport',color:'#136ee6',text:'sports'},
                {name:'youtube',color:'#e61313',text:'youtube', logoClass:'fab fa-youtube red-text'},
            ]
        }
    },
    computed:{
        instaName(){
            return this.$store.state.instaName;
        },
        url(){
            return this.$store.state.url;
        },
        previousChampion(){
            return this.leadList.slice(0,3)
        },
        currentGameDay(){
            return moment().startOf('day').toISOString();
            //return moment('2018/05/11','YYYY/MM/DD').toISOString();
        },
        allTimeGame(){
            return moment('2018/05/11','YYYY/MM/DD').toISOString();
        },
        currentGameWeek(){
            return moment().startOf('week').toISOString();
        },
        previousGameDay(){
            return moment().subtract(1, 'days').startOf('day').toISOString();
        },
        previousGameMonth(){
            return moment().subtract(1, 'month').startOf('month').toISOString();
        },
        currentGameMonth(){
            return moment().startOf('month').toISOString();
        },
        savedProfile(){
            if(this.safe(localStorage.instahandle)){
                return localStorage.instahandle
            }
            return ''
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
        },
        availableCategory(){
            return this.category.filter(
                item => this.$store.state.celebList.some(celeb => celeb.category === item.name)
            )
        }

    },
    mounted: function(){
        // let htmlBody = document.querySelector('body');
        // htmlBody.style.overflow = 'auto' //modal plugin makes the body scroll stuck when modal isnt closed
        let modal = document.querySelector('.modal');
        let tooltip = document.querySelector('.tooltipped');
        let modalOptions = {onOpenEnd:()=>{this.modalAdsense()}}
        if (this.$route.path.includes('game')) modalOptions.dismissible = false
        if (modal) this.modalInstance = M.Modal.init(modal,modalOptions);
        if (tooltip) M.Tooltip.init(tooltip);
                            
    },
    destroy:function(){
        this.modalInstance.destroy()
        
    },
    beforeCreate: function(){
        if(this.$route.path.includes('game') && this.$store.state.celebList.length === 0){
            return router.push('/');
        }
        if(this.$store.state.celebList.length === 0){
            let location = (window.location.port === '5500')? '/www/scripts/celebs.json' : '/scripts/celebs.json'
            fetch(location).then((res)=>{
                //get celebrity list
                return  res.json()   
            })
            .then((data)=>{
                const listCleanUp = 
                    data
                        .filter(item => !item.list.every(i => i === ''))
                        .map((j) => {
                            const cleanList = j.list.filter(listItem => listItem !== '')
                            j.list = cleanList
                            return j
                        })
                this.$store.commit('celebList',listCleanUp);
                           
            });
        }
        
    },
    methods:{
        safe : function(a){
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
        gameTimePlayed : function ($scope){
            //get current time
            $scope.test.end_time = moment();
            //get difference between start and end in miliseconds
            let dif = $scope.test.end_time.diff($scope.test.start_time);
            //format the miliseconds to minutes,seconds and milliseconds
            $scope.test.timePlayed = moment(dif).format("mm:ss:SS");
            return $scope.test.timePlayed;
        },
        resumeAudioContext: function(){
            //fucking chrome suspends audio context till the user acts on an event in the browser
            if(tones.context.state.includes('suspended')){
                tones.context.resume()
                .then(()=>{console.log('audio context back online')})
            }
        },
        toggleModal: function(modalData,isChallenge){
            //isChallenge: Boolean
            //modalData: Object
            let challenge = {name:'challenge',color:'#6da3cd',text:'challenge'}
            this.modalData = (isChallenge !== true) ? modalData : challenge
            this.modalInstance.open();
            this.resumeAudioContext()
        },
        modalAdsense:function(){
            return 'adsense-pause'
            
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
        insta:function(){
            this.$store.commit('insertName',this.name);
        },
        showSubmit: function(){
            this.modalPage.insta = true
            this.profileExist()
        },
        profileExist:function(){
            if(this.savedProfile !== ''){
                this.inputProfile = this.savedProfile
                this.getProfile()
            }
        },
        instaLink(handle){
            return `/profile?insta=${handle}`
        },
        instaGameImageLink(imageCode){
            return `/insta-feed?id=${imageCode}`
        },
        getProfile:function(){
            this.modalPage.imageacquired = false // remove submit button while typing
            if(this.profileTimeout !== null){
                clearTimeout(this.profileTimeout)
            }
            this.profileTimeout = setTimeout(()=>{
                //console.log(this.inputProfile)
                let profile = this.inputProfile.replace('@','').toLowerCase()
                this.fetchInstaProfile(profile)
            },1200)
        },
        fetchInstaProfile: function(profile){
            this.modalPage.loader = true
            if(profile === '') return this.modalPage.fail = true
            fetch(this.instaLink(profile))
            .then((res)=>{
                if(res.status === 200){
                    return  res.json();
                }else{
                    this.modalPage.fail = true
                    return 'failed'
                }      
            })
            .then((data)=>{
                if(data !== 'failed'){
                    let sift = data.graphql.user.profile_pic_url
                    this.$store.commit('url',sift);
                    this.modalPage.fail = false
                    this.modalPage.loader = false
                    this.modalPage.imageacquired = true
                }
            });
            //this.url = profile;
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
        sendToCategory: function(){
            let route = this.$route
            setTimeout(()=>{
                if(route.path.includes('challenge')){
                    //when a user shows up as a result of a social media challenge
                    this.$store.commit('socialChallenge',route.params)
                }
                if(route.path.includes('contest')){
                    //when a user shows up as a result of a social media challenge for brands
                    route.params.prize = route.params.prize.replace(/:/g,' ')
                    this.$store.commit('socialChallenge',route.params)
                    console.log(route.params)
                }
                this.$router.push('/dash');
            },3000)
        },
        clearInterval:function(intervalInstance){
            if(this.safe(intervalInstance)){
                clearInterval(intervalInstance)
            }            
        },
        copyToClipboard(){
            let input = document.querySelector('#copy-link')
            input.focus()
            input.setSelectionRange(0, 9999)
            try{
                document.execCommand("copy");
            }catch(e){
                alert(e)
            }            

        },
        webSocket(){
            if('io' in window){
                //var socket = io('https://mochanow.com');
                var socket = io();
                return socket;
            }
                    
        },
        goHome(){
            this.$router.push('/dash')
        }
    }
}
const landing = Vue.component('landing', {
    template: `<div class="landing animated fadeIn" main="height: 100%;width: 100%;position: absolute;background:var(--main)">
                    <div class="center-align fwhite" style="font-family: 'Pacifico', cursive;">
                        <div style="font-size:45px;margin-top:15%">Celebrity Puzzle</div>
                        <div style="font-size:26px;margin-top:20px">align the stars</div>
                        <div class="btn btn-large red-text white tooltipped" style="margin-top:20px" v-if="isWindowBig" data-position="top" data-tooltip="Coming soon to desktops and laptops">
                            <i class="material-icons">stay_primary_portrait</i> Mobile phones only
                        </div>
                        <spinner class="animated fadeIn" style="margin-top:250px" :colorClass="'white'" v-if="!isWindowBig"></spinner>
                    </div>
               </div>`,
    mixins: [serviceProvider],
    created: function(){
        if(this.isWindowBig !== true){
            if(!('deviceId' in localStorage)){
                return this.generateDeviceId()
            }
            this.sendToCategory()            
        }
    
    }
});
const dash = Vue.component('dash', {
    template: '#dashboard',   
    mixins: [serviceProvider],
    data: function(){ 
        return {
            message: 'Hello Vue!',
            show: false,
            contain: true,
            modalPage:{page:'dash',insta:false,loader:false,fail:false,imageacquired:false,contest:false},
            socialChallengeUrl: null
        }
    },
    computed:{
        prevWinners(){
            let x = this.$store.state.previousChamps
            if(x !== null) this.loader = true
            return x
        },
        socialChallenge(){
            return this.$store.state.socialChallenge
        }
    },
    created: function(){
        if(this.isWindowBig === true) return router.push('/')
        if(this.$store.state.previousChamps === null){
            axios(`https://styleminions.co/api/puzzleoldchamps?today=${this.currentGameDay}&yesterday=${this.previousGameDay}`)
            .then((res)=>{
                let champs = res.data
                if(champs.length === 3){
                    this.$store.commit('previousChamps',champs);
                    this.loader = true
                }else if(champs.length === 0){
                    this.$store.commit('previousChamps',this.testProfile);
                    this.loader = true
                }else{
                    let startIndex = champs.length
                    for(let i=startIndex; i < 3; i++){
                        champs.push({name:'', profile_url:this.noProfileUrl})
                    }
                    this.$store.commit('previousChamps',champs);
                    this.loader = true
                }
            })
        }
        if(this.$store.state.socialChallenge !== null && this.$store.state.socialChallenge.insta !== '0'){
            this.modalPage.contest = (this.safe(this.socialChallenge.prize)) ? true : false //checking if its a brand contest
            this.fetchInstaProfile(this.$store.state.socialChallenge.insta)
        }
        if(!('deviceId' in localStorage)){
            this.generateDeviceId(true) // genereate unique device id without redirecting
        }
        
        
    },
    methods: {
        startSocialChallenge: function(){
            let playerdetails =  this.socialChallenge
            let category = (playerdetails.category !== '0') ? playerdetails.category : 'movie'
            let gamedetails = {}
            gamedetails.profile_url = this.url
            gamedetails.realtime = playerdetails.time
            gamedetails.name = playerdetails.insta
            this.$store.commit('challenge',gamedetails)
            this.resumeAudioContext()
            //essential to close modal before moving on to next page programtically to avoid the modal plugin
            //from making the html body overflow scroll stuck
            this.modalInstance.close() 
            this.$router.push(`/game/${category}`)
        }
    }
});

const game = Vue.component('game',{
    template:`
        <div class="background center-align">
            <modal v-bind:modalData="modalData" v-bind:test="test" v-on:replay="retry" v-on:submitGame="submitGame" v-bind:modalPage="modalPage"
                   v-bind:urlChallenge="challengeUrl" v-bind:challenger="challenge"></modal>
            <div style="background-color:white; width:100%;" >
                <div class="progress animated fadeInDown" style="margin-top:0px;background-color:#dadcda;margin-bottom: 0px;">
                    <div class="determinate" v-prog="prog" style="background:var(--main);"></div>
                    <div style="position: absolute;left: 50%;top: 5%;" :class="{'white-text': prog >= 54}">{{prog | number}}%</div>
                    <img :src="challenge.profile_url" class="animated circle flash img-green responsive-img" style="width: 25px;height: 25px;position: absolute;top: 0;"
                         v-if="challenge !== null" :style="{left: challengeTimer + '%'}" :class="{'hide':challengeInterval === null}"
                         v-imgfallback>
                </div>
                <div class="valign-wrapper" style="position:absolute;bottom:2%;right: 0;">
                    <span class="" style="margin-right: 10px;" v-if="challenge !== null">
                        <img :src="challenge.profile_url" class="circle responsive-img animated infinite" style="width: 40px;height: 40px;"
                             :class="{'img-lead':challengeTimer === 0,'img-green bounceIn':challengeTimer > 0 && challengeTimer < 80,'img-orange flip':challengeTimer >= 80 && challengeTimer < 100,
                             'img-red flash': challengeTimer >= 100}" v-imgfallback>
                    </span>
                    <span class="btn btn-floating waves-effect waves-light" style="margin-right:10px;background:var(--main);" @click="volumeToggle">
                        <i class="material-icons animated bounceIn" v-show="volume" style="font-size: 34px;">volume_up</i>
                        <i class="material-icons animated bounceIn" v-show="!volume" style="font-size: 34px;">volume_off</i>
                    </span>
                    <span class="btn btn-floating waves-effect waves-light" style="margin-right:10px;background:var(--main);" @click="goHome">
                        <i class="material-icons animated bounceIn" style="font-size: 34px;">home</i>
                    </span>
                    <span class="btn btn-floating waves-effect waves-light" style="margin-right:10px;background:var(--main);" @click="retry"
                          :disabled="loader">
                        <i class="material-icons" style="font-size: 34px;">refresh</i>
                    </span>
                    <div class="chip" style="font-size:0.7em;">
                        <img :src="profile.url" alt="Contact Person" v-imgfallback>
                        {{(profile.fullname !== '') ? profile.fullname : profile.fallback.name | truncate}}
                    </div>
                </div>                
                <spinner class="animated fadeIn" :colorClass="'default'" v-show="loader"></spinner>
            </div>
            <div id="svg" style="background-color:white; width:100%; height:80%; user-select:none;">
                <div class="btn list-me animated shake" v-bind:class="{'hide': prog !== 100}">
                        Completed!!  
                        <span v-show="test.start_time !== null">
                            <i class="fa fa-clock-o"></i> 
                            {{test.time_result[0]}}<span>m</span>:{{test.time_result[1]}}<span>s</span>
                        </span>
                </div>
            </div>
            
            <canvas id="canvas"></canvas>
        
        </div>
    `,
    mixins: [serviceProvider],
    data: function(){
        return {
            waste : [],
            correct : [],
            dw: null,
            dh: null,
            draw: null,
            sw: null,
            sh: null,
            shuffle : [],
            basket :[],
            output : '',
            prog : 0,
            test: {end_time:null, start_time:null,time_result:'0:0',timePlayed:null,bestTime:null,rankLoader:false,rank:null},
            picColumn : 2,
            picRow : 2,
            puzzLevel: 1,
            currentUrl: '',
            profile: {},
            modalPage:{page:'game',insta:false,loader:false,fail:false,imageacquired:false},
            challengeSeconds:0,
            challengeInterval:null,
            fixedChallenge:false
            
        }
    },
    computed:{
        challenge(){
            return this.$store.state.challenge
        },
        totalChallengeSeconds(){
            if(this.safe(this.challenge)){
                let time = this.challenge.realtime.split(':')
                let seconds = Number(time[0])*60 + Number(time[1])
                return seconds
            }
            return null
        },
        challengeTimer(){
            if(this.safe(this.challenge)){
                return (this.challengeSeconds/this.totalChallengeSeconds)*100
            }
            return null            
        },
        challengeUrl(){
            // let category = this.$route.params.category
            let imgShortcode = ('imageShortcode' in this.profile) ? this.profile.imageShortcode : this.$route.params.category
            let splitTime = (this.test.time_result !== null) ? `${this.test.time_result[0]} minutes ${this.test.time_result[1]} seconds` : '0'
            let playtime = this.test.timePlayed
            let instahandle = ('instahandle' in localStorage) ? localStorage.instahandle : '0'
            let message = `I challenge you to beat my time of ${splitTime} today on celebrity puzzle`
            let link = `http://celebritypuzzle.com/#/challenge/${instahandle}/${playtime}/${imgShortcode}`
            let url = {}
            url.encoded = encodeURIComponent(`${message} ${link}`)
            url.raw = `${message} ${link}`
            return url
        }
    },
    mounted: function(){
        if(this.isWindowBig === true) return router.push('/')

        if(this.$store.state.celebList.length !== 0){
            this.svgSpace = document.getElementById('svg')
            this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
        }
    },
    methods: {
        isStarted : function(){
            if(this.test.start_time === null){
                this.test.start_time = moment();
                this.startChallenge()
            }
        },
        startChallenge:function(){
            let store = this.challenge
            if(this.safe(store)){
                this.challengeInterval = setInterval(()=>{
                    this.challengeSeconds += 1
                    if(this.challengeSeconds === this.totalChallengeSeconds){
                        this.clearInterval(this.challengeInterval)
                        console.log('time interval is cancelled')
                    }
                },1000)
            }
        },
        progressFunc : function(){
            this.prog = ((this.correct.length)/this.picBoxes)*100;
        },
        updateBestTime: function(){
            let currentTime = this.test.timePlayed
            if('bestTime' in localStorage){
                let bestTime = localStorage.bestTime
                if(currentTime < bestTime){
                    this.test.bestTime = currentTime
                    localStorage.bestTime = currentTime
                }else{
                    this.test.bestTime = bestTime
                }
            }else{
                this.test.bestTime = currentTime
                localStorage.bestTime = currentTime
            }
        },
        volumeToggle(){
            switch(this.volume){
                case true:
                    this.volume = false
                    break
                case false:
                    this.volume = true
                    break
            }
        },
        getRanking(){
            this.test.rankLoader = true
            let today = this.currentGameWeek
            axios.get(`https://styleminions.co/api/puzzlechamps?today=${today}`)
            .then((res)=>{
                //console.log(res)
                let leaderboard = res.data
                let rank = leaderboard.filter((item)=> item.realtime < this.test.timePlayed).length + 1
                //console.log(rank,this.test.timePlayed)
                this.test.rank = (rank < 100) ? rank : '100+'
                this.test.rankLoader = false
            })
        },
        levelUp : function(){
            if(this.puzzLevel < 2){
                this.draw.clear();
                this.waste = [];
                this.correct = [];
                this.dw,this.dh,this.draw;
                this.sw,this.sh;
                this.shuffle = [];
                this.basket =[];
                this.prog = 0;
                this.picColumn = 4;
                this.picRow = 5;
                this.puzzLevel += 1;
                this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
            }else{
                // game is finished and time to move on
                this.test.hideModal = false;
                this.getRanking()
                this.updateBestTime()
                this.toggleModal()
                this.clearInterval(this.challengeInterval)
                this.submitGame('regular')
            }
        },
        retry:function(){
            // this lets them replay the same category
            this.draw.clear();
            this.waste = [];
            this.correct = [];
            this.dw,this.dh,this.draw;
            this.sw,this.sh;
            this.shuffle = [];
            this.basket =[];
            this.prog = 0;
            this.picColumn = 2;
            this.picRow = 2;
            this.puzzLevel = 1;
            this.currentUrl= '',
            this.test =  {end_time:null, start_time:null,time_result:'0:0',timePlayed:null,bestTime:null,rankLoader:false,rank:null},
            this.challengeSeconds = 0
            if(this.challengeInterval !== null) clearInterval(this.challengeInterval)
            this.challengeInterval = null
            this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
        },
        submitGame: function(inputProfile){
            let timestamp =  moment().toISOString()
            let playtime = this.test.timePlayed
            let name = null
            let picurl = null
            let leaderboard = 0
            let deviceId = this.deviceId
            let category = this.$route.params.category
            let imgShortCode = this.profile.imageShortcode
            if(inputProfile === 'regular'){
                //this is for metric tracking the completion of a game without submitting to the leaderboard
                name = (this.safe(localStorage.instahandle)) ? localStorage.instahandle : 'noname'
                picurl = 'nourl'
            }
            if(inputProfile !== 'regular'){
                //submit to the leaderboard for sure
                name = inputProfile.replace('@','').toLowerCase()
                picurl = encodeURIComponent(this.url)
                leaderboard = 1
                localStorage.instahandle = name
            }
            let postData = {timestamp,playtime,name,picurl,leaderboard,deviceId}
            //console.log(postData)
            axios.post(`https://styleminions.co/api/puzzlesubmit?timestamp=${timestamp}&playtime=${playtime}&name=${name}&picurl=${picurl}
            &leaderboard=${leaderboard}&deviceid=${deviceId}&category=${category}&shortcode=${imgShortCode}`)
            .then((response)=>{
                if(inputProfile !== 'regular'){
                    this.modalInstance.close()
                    router.push('/leaderboard')
                }
            })
            .catch((error)=>{console.error(new Error(error))})
        },
        isLevelCompleted : function(){
            if(this.correct.length === this.picBoxes){
                if(this.test.start_time === null){
                    //sometimes the randomness solves the puzzle on the first round which negatively impacts the gaming experience
                    this.toastInstance.dismiss()
                    console.log('it solved itself lol but i got it')
                    return this.retry()
                }
                this.output = 'Completed'
                this.test.time_result = this.gameTimePlayed(this).split(':');
                this.tones('f',5,500);
                this.vibrate(2000);
                setTimeout(()=>{
                    this.levelUp();
                },2000);
                //console.log('THE END FAM')
            }
        },
        checker : function(d,e){
            if(e.x === d.truth.x && e.y === d.truth.y){
                //Player is right
                if(!this.correct.includes(d.truth.x+':'+d.truth.y)){
                    this.correct.push(d.truth.x+':'+d.truth.y);
                    //console.log('right boy')
                }
            }else{
                //player is wrong
                if(this.correct.includes(d.truth.x+':'+d.truth.y)){
                    let pos = this.correct.indexOf(d.truth.x+':'+d.truth.y)
                    this.correct.splice(pos,1);
                }
                //console.log('wrong boy')
            }
            
            this.isLevelCompleted();
        },
        getImage: function(){
            if(this.currentUrl !== ''){
                return new Promise((resolve,reject)=>{
                    resolve(this.currentUrl)
                })
            }
            let category = this.$route.params.category
            let categoryList = []
            let randomIndex = null
            let randomPictureFromCelebrityIndex = null
            let instaShortCode = '';
            let handle = ''
            if(this.category.findIndex((item)=>item.name === category) === -1) this.fixedChallenge = true
            if(!this.fixedChallenge){
                // normal gameplay to run a random game
                categoryList = this.$store.state.celebList.filter(item => item.category === category)
                randomIndex = Math.floor(Math.random()*(categoryList.length));
                randomPictureFromCelebrityIndex = Math.floor(Math.random()*(categoryList[randomIndex].list.length));

                handle = categoryList[randomIndex].handle
                instaShortCode = categoryList[randomIndex].list[randomPictureFromCelebrityIndex]
                instaShortCode = instaShortCode.match(/https:\/\/www\.instagram\.com\/p\/(.+)\//)[1]
            }else{
                //this is a challenge and should get specific image played by the challenger
                instaShortCode = category
            }
            
            return new Promise((resolve,reject)=>{
                fetch(this.instaGameImageLink(instaShortCode))
                .then((res)=>{
                    if(res.status === 200){
                        return  res.json();
                    }else{
                        //this.getImage();
                        reject('there was an error retreiving data from instagram')
                    }       
                })
                .then((data)=>{
                    if(this.safe(data)){
                        //filter for only images with 3:4 and 1:1 dimensions
                        let imageList = data.image.filter(item => item.width <= item.height)
                        if(imageList.length < 1){
                            this.retry()
                        }else{
                            let index = Math.floor(Math.random()*(imageList.length));
                            this.profile = {
                                fullname:data.author.name,
                                url:data.author.image,
                                fallback:categoryList[randomIndex],
                                imageList: imageList,
                                imageShortcode:instaShortCode
                            }
                            resolve(imageList[index].url);
                        }
                    }
                });
            })
        },
        drawCanvas : function(fWidth, fHeight, imgUrl){
            let self = this;
            return new Promise(function(resolve,reject){
                let canvas = document.getElementById('canvas');
                
                let ctx = canvas.getContext('2d');
                //console.log(ctx)
                
                let im = new Image()
                im.crossOrigin = 'Anonymous';
                //perfect on mobile for any image dimensions (square, 3:4 ratio and 4:3 ratio)
                //good on desktop for only square and 4:3 ratio image dimensions
                //im.src = 'https://scontent-yyz1-1.cdninstagram.com/vp/2c9e475a6c684b4eb20fb9c06a9c8c36/5B01A374/t51.2885-15/e35/24274488_1204373613026222_6359081673119760384_n.jpg';
                im.src = imgUrl
                //im.src = 'https://scontent-yyz1-1.cdninstagram.com/vp/192110115a0379f7200f2aabeac9a7e5/5B094E85/t51.2885-15/e35/11849357_536498379834099_188237789_n.jpg';
                //sw and sh are the withis.dh and height of the image piece to be cut from the raw image
                im.onload = ()=>{
                    
                    if(im.height > im.width && window.innerWidth > 768){
                        //this turns the image into a square (1:1) dimension only on desktop
                        //to then be used as an image for the puzzle
                        let width = im.width;
                        let height = im.height;
                        canvas.setAttribute('width',width);
                        canvas.setAttribute('height',width);
                        ctx.imageSmoothingQuality = "high";
                        ctx.drawImage(im,0,0,width,width,0,0,width,width);
                        im.src = canvas.toDataURL('image/png', 1); //this triggers the image onload() method

                    }else{
                        //this continues the task normally either after square transformation or when the if block requirement isn't met
                        var space = 2;
                        var sw = Math.round((im.width - space * self.picColumn)/self.picColumn);
                        var sh = Math.round((im.height - space* self.picRow)/self.picRow);
                        
                        //self.dw and self.dh are the height and width to be drawn on the canvas based on the aspect ratio of the raw image
                        self.dw = Math.round((fWidth - space * self.picColumn)/ self.picColumn);
                        self.dh = Math.round((fHeight - space * self.picRow)/self.picRow);

                        canvas.setAttribute('width',sw);
                        canvas.setAttribute('height',sh);
                        self.sw = sw;
                        self.sh = sh;
                        ctx.imageSmoothingQuality = "high";


                        //ctx.self.drawImage(im,0,0,sw,sh,0,0,self.dw,self.dh)
                        //by default i want 30 pieces of any image i.e 5 columns and 6 rows for mobile devices.
                        for(let i = 0; i < self.picColumn; i++){
                            for(let j = 0; j < self.picRow; j++){
                                //ctx.self.drawImage(im,i*(sw + 1),j*(sh + 1),sw,sh,i*(self.dw + 5),j*(self.dh + 5),self.dw,self.dh);
                                ctx.drawImage(im,i*(sw + 1),j*(sh + 1),sw,sh,0,0,sw,sh);
                                let drawdata = {};  
                                drawdata.img = canvas.toDataURL('image/png', 1);
                                drawdata.x = i*(self.dw + space);
                                drawdata.y = j*(Math.round((self.sh*self.dw)/self.sw) + space);
                                self.basket.push(drawdata);
                                //ctx.clearRect(0,0,sw,sh);
                            }
                        }
                        
                        //console.log(self.basket);
                        self.shuffle = self.basket.map((item)=>{return {x:item.x,y:item.y}})
                        self.shuffle = self.randomize(self.shuffle)
                        resolve(self.shuffle);

                    }               
                    
                }
            });    
            
            
        },
        setUp : function(w,h){
            this.loader = true
            this.picBoxes = this.picColumn * this.picRow;
            this.footnote_hide = false;
            this.footnote = true;
            this.footnote_msg = this.puzzLevel < 2 ? 'Round ' + this.puzzLevel : 'Final Round';
            this.getImage()
            .then((data)=>{
                this.currentUrl = data
                return this.drawCanvas(w,h,data)
            })
            .catch((error)=>{
                console.error(new Error(error))
                this.setUp(w,h) //retry once there is a 404
            })            
            .then((data)=>{
                //console.log('yeaaaaaaaaaah', this.basket);
                if(!this.safe(this.draw)){
                    this.svg = document.getElementById('svg');
                    this.draw = SVG(this.svg).size(w, h);
                }
                
                //console.log(this.basket);
                let z = 0;
                this.basket.forEach((item)=>{
                    //let elem = this.draw.image(item.img,this.dw,this.dh);
                    let elem = this.draw.image(item.img,this.dw,Math.round((this.sh*this.dw)/this.sw));
                    elem.x(this.shuffle[z].x);
                    elem.y(this.shuffle[z].y);
                    elem.truth = {x:item.x,y:item.y};
                    elem.attr('v-buzz','');
                    function onTrigger(){
                        this.isStarted();
                        this.tones('e',5,10,null,'sine');
                        this.vibrate(100)
                        if(elem.width() !== this.dw - this.dw*0.3){
                            //so we dont have multiple shrunken elements at once in the case where the user taps very quickly
                            //on different elements like a mad man :)
                            elem.animate(100).width(this.dw - this.dw*0.3);
                        }
                        if(this.waste.length < 2 && !elem.fx.active){
                            //check if the animation is active or else it could get called again while in transit
                            //which will throw it off the grid and thats a BIG PROBLEM for the user
                            this.waste.push(elem);
                        }
                        if(this.waste.length === 2 && this.waste[0].node.id !== this.waste[1].node.id ){
                            let a = {x:this.waste[0].node.x.baseVal.value,
                                        y:this.waste[0].node.y.baseVal.value,
                                        truth: this.waste[0].truth
                                    }
                            let b = {x:this.waste[1].node.x.baseVal.value,
                                        y:this.waste[1].node.y.baseVal.value,
                                        truth: this.waste[1].truth
                                    }
                            SVG.get(this.waste[0].node.id).animate(200).move(b.x,b.y).animate(100).width(this.dw);
                            SVG.get(this.waste[1].node.id).animate(200).move(a.x,a.y).animate(100).width(this.dw);
                            this.checker(a,b);
                            this.checker(b,a);
                            this.progressFunc();
                            this.waste = [];
                            
                            //console.log(a,b)
                        }else if(this.waste.length === 2 && this.waste[0].node.id == this.waste[1].node.id){
                            //this is the situation where the same box is touched
                            elem.animate(100).width(this.dw);
                            this.waste = [];
                        }
                    }
                    elem.touchstart(()=>{
                        onTrigger.call(this)
                    });
                    if(this.isWindowBig === true){
                        elem.click(()=>{
                            onTrigger.call(this)
                        });
                    }

                    elem.loaded (()=>{
                        //on initialization check if element is in the right position
                        let pos = {x:elem.node.x.baseVal.value,
                                        y:elem.node.y.baseVal.value
                                    }
                        if(pos.x === elem.truth.x && pos.y === elem.truth.y){
                            this.correct.push(elem.truth.x+':'+elem.truth.y);
                        }
                        this.progressFunc();
                        this.isLevelCompleted(); //sometimes the randomized data can be exactly solved on the first round
                    });
                    
                    z++;
                    //elem.mouseout(()=>{elem.animate(100).width(50);});
                });
                this.loader = false
                this.toastInstance = M.toast({html:`<div class="center-align full-width">${this.footnote_msg}</div>`,displayLength:2000});
                //$compile(this.draw.node)(this); //this is important for the new elements added to the DOM to be compiled by angular
            });
            
        }
    }
});

const leaderboard = Vue.component('leaderboard',{
    template: '#leaderboard',
    mixins: [serviceProvider],
    data: function(){
        return{
            movingHearts:[],
            leaderboardList:[],
            rankPeriodChip: 'thisMonth',
            viewChallengeList:{}
        }
    },
    methods:{
        makeHeart(){
            let b = Math.floor((Math.random() * 100) + 1);
            let d = ["flowOne", "flowTwo", "flowThree"];
            let a = ["colOne", "colTwo", "colThree", "colFour", "colFive", "colSix"];
            let c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
            let bucket = {};
            bucket.id = b;
            bucket.color = a[Math.floor((Math.random() * 6))];
            bucket.font = Math.floor(Math.random() * (50 - 22) + 22);
            bucket.flow = d[Math.floor((Math.random() * 3))];
            bucket.seconds = c;
            this.movingHearts.push(bucket);
            setTimeout(()=>{
                let index = this.movingHearts.findIndex(i => i.id === b);
                this.movingHearts.splice(index,1);
            },c * 1200)
        },
        getLeaderboard(){
            if(this.loader === true) {
                return
            }
            this.loader = true
            const startPeriod = this.rankPeriodChip
            let today
            switch(startPeriod){
                case 'thisWeek':
                    today = this.currentGameWeek;
                    break;
                case 'thisMonth':
                    today = this.currentGameMonth;
                    break;
                case 'lastMonth':
                    today = this.previousGameMonth;
                    break;
                case 'allTime':
                    today = this.allTimeGame;
                    break;
                default:
                    today = this.allTimeGame;
            }
            axios.get(`https://styleminions.co/api/puzzlechamps?today=${today}`)
            .then((res)=>{
                //console.log(res)
                this.leaderboardList = res.data;
                this.loader = false
            })
            .catch(() => {
                this.loader = false
            })
        },
        selectedTime(time){
            if (this.rankPeriodChip === time) {
                return
            }
            this.rankPeriodChip = time
            this.getLeaderboard()
        },
        scrollToMe(){
            let elem = document.querySelector('.myprofile')
            if(this.safe(elem)){
                //console.log('wooooooooow')
                elem.scrollIntoView(false) //false aligns the bottom of the element to the bottom of available space and vice versa
            }
        },
        challengePlayer(playerdetails){
            this.$store.commit('challenge',playerdetails)
            let category = (playerdetails.short_code !== 'empty') ? playerdetails.short_code : 'movie'
            router.push(`/game/${category}`)
        },
        challengeUrl(profileObject, clipboard){
            //custom for the leaderboard
            let category = profileObject.short_code
            let splitTime = profileObject.realtime.split(':')
            let splitTimeText = `${splitTime[0]} minutes ${splitTime[1]} seconds`
            let playtime = profileObject.realtime
            let instahandle = profileObject.name
            let message = `I challenge you to beat my time of ${splitTimeText} today on celebrity puzzle`
            let link = `http://celebritypuzzle.com/#/challenge/${instahandle}/${playtime}/${category}`
            if(clipboard === true) return `${message} ${link}`
            return encodeURIComponent(`${message} ${link}`)
        },
        toggleChallengeView(name){
            let obj = this.viewChallengeList
            if(!obj.hasOwnProperty(name)){
                //set default 
                obj[name] = null
            }
            if(obj.hasOwnProperty(name)){
                switch(obj[name]){
                    case true:
                        obj[name] = false
                        break
                    case false:
                        obj[name] = true
                        break
                    case null:
                        obj[name] = true
                        break
                }
            }
            this.$forceUpdate() //vue force update render since this object isn't reactive from initialization
        }
    },
    created:function(){
        if(this.isWindowBig === true) return router.push('/')
        this.getLeaderboard()
    },
    mounted:function(){
        // setInterval(()=>{
        //     this.makeHeart();
        // },900)
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
Vue.component('adsense-pause',{
    template:`
    <div style="margin-top:30px">
        <!-- footer ad  data-adtest="on"-->
        <ins class="adsbygoogle center-block"
            style="display:block"
            data-ad-client="ca-pub-8868040855394757"
            data-ad-slot="3445703421"
            data-ad-format="horizontal"></ins>
    </div>
    `,
    mixins: [serviceProvider],
    mounted(){
        if(this.$route.path.includes('leaderboard')){
            this.modalAdsense()
        }    
    }
})
Vue.directive('prog', {
    update: function(el,binding){
        el.style.width = binding.value + '%';
    }
});
Vue.directive('imgfallback', {
    bind: function(el,binding,vnode){
        let fallback = serviceProvider.data().noProfileUrl;
        el.onerror = function(){
            if(el.src !== fallback && fallback !== undefined){
                el.src = fallback
            }
        }
    }
});
Vue.directive('disappear', {
    inserted: function(el,binding,vnode){
        let self = this;
        // setTimeout(function(){
        //     //vnode.context.$vnode.componentInstance.leadList.splice(binding.value,1)
        //     let index = self.app.$children[0].leadList.findIndex((i)=> i === binding.value)
        //     self.app.$children[0].leadList.splice(index,1)
        //     //console.log(vnode)
        // },5000)
        
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
Vue.filter('endsIn', function (value) {
    if(value !==''){
        // expecting string date format DD-MM
        value += '-' + moment().year()
        let endDate = moment(value,'DD-MM-YYYY').fromNow()
        return endDate.slice(3,endDate.length)
    }
    return value
});

const store = new Vuex.Store({
    //state management in VUE
    state:{
        instaName: '',
        celebList: [],
        previousChamps: null,
        url: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
        challenge: null,
        socialChallenge: null,
        accessToken: null
    },
    mutations:{
        insertName(state, data){
            state.instaName = data;
        },
        celebList(state, data){
            state.celebList = data;
        },
        url(state, data){
            state.url = data;
        },
        previousChamps(state,data){
            state.previousChamps = data;
        },
        challenge(state,data){
            state.challenge = data;
        },
        socialChallenge(state,data){
            state.socialChallenge = data;
        },
        accessToken(state,data){
            state.accessToken = data;
        }
    }
})

const routes = [
  { path: '/leaderboard', component: leaderboard },
  { path: '/dash', component: dash },
  { path: '/game/:category', component: game },
  { path: '/', component: landing },
  { path: '/challenge/:insta/:time/:category', component: landing },
  { path: '/contest/:insta/:time/:category/:prize/:endDate', component: landing },
  { path: '*', redirect: '/' }, //wild card situations since the shared url could be modified by users
];
const router = new VueRouter({
  routes // short for `routes: routes`
});

var app = new Vue({
    router:router,
    store:store
}).$mount('#myapp');

//Adsense best size mobile 320 x 100
//SQL query:
//SELECT device_id, count(device_id) as play FROM `TABLE` WHERE category = 'BjlZvU4FL1F' and leaderboard = '0' group by device_id order by play desc