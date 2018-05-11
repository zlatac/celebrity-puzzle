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
            testProfile: [
                {name:'kim k', url:"https://scontent-yyz1-1.cdninstagram.com/vp/a1578586761b73b52936c4a9ca4780df/5B94EF59/t51.2885-19/s150x150/19228783_1421845407904949_3402248722799656960_a.jpg"},
                {name:'sofia', url:'https://scontent-yyz1-1.cdninstagram.com/vp/58dce42512d59709c76790d416c635f9/5B7957B9/t51.2885-19/s150x150/22159185_179929515914042_379745688163975168_n.jpg'},
                {name:'shaq', url:'https://scontent-yyz1-1.cdninstagram.com/vp/545396c0bea9704c9e90093767a642da/5B91DEB6/t51.2885-19/s150x150/10818077_1772497556311865_1111187484_a.jpg'},
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
        },
        previousGameDay(){
            return moment().subtract(1, 'days').startOf('day').toISOString();
        },
        savedProfile(){
            if(this.safe(localStorage.instahandle)){
                return localStorage.instahandle
            }
            return ''
        },
        isWindowBig(){
            return this.checkWindow()
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
        if(this.$route.path.includes('game') && this.$store.state.celebList === null){
            return router.push('/');
        }
        if(this.$store.state.celebList === null){
            fetch(`/scripts/celebs.json`).then((res)=>{
                //get celebrity list
                return  res.json()   
            })
            .then((data)=>{
                this.$store.commit('celebList',data);
                           
            });
        }
        
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
            tones.play(key,octave);
        },
        vibrate: function(seconds){
            if('vibrate' in navigator){
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
        toggleModal: function(modalData){
            this.modalData = modalData
            this.modalInstance.open();
            this.resumeAudioContext()
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
            fetch(`https://www.instagram.com/${profile}/`)
            .then((res)=>{
                if(res.status === 200){
                    return  res.text();
                }else{
                    this.modalPage.fail = true
                    return 'failed'
                }      
            })
            .then((data)=>{
                if(data !== 'failed'){
                    let sift = data.match(/og:image.+(http.+)"/i)[1];
                    this.$store.commit('url',sift);
                    this.modalPage.fail = false
                    this.modalPage.loader = false
                    this.modalPage.imageacquired = true
                }
            });
            //this.url = profile;
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
            setTimeout(function(){
                //might do something here at some point
                router.push('dash');
            },3000)
        }
    
    }
});
const container = Vue.component('container', {
    template: `
        <div>
            <div class="top-banner"></div>
            <div class="container">
                <modal v-bind:modal-data="modalData" v-bind:modalPage="modalPage"></modal>
                <router-link to="/leaderboard">
                    <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4">
                        <i class="fa fa-trophy" style="font-size:34px;color:white"></i>
                    </div>
                </router-link>
                <div class="row animated fadeInDown tooltipped" data-position="bottom" data-tooltip="Yesterday's Champions">
                    <div class="col s12">
                        <div class="row" style="margin:0.5rem 0 0.1rem 0;">
                            <champion class="col s4" v-for="(x, index) in testProfile" :url="x.url" :index="index"></champion>
                        </div>
                    </div>
                </div>
                <div class="row animated bounceInLeft" v-for="x in category">
                    <div class="col s12">
                        <div class="card card-side z-depth-2" v-bind:style="{borderLeftColor: x.color}">
                            <div class="card-content">
                                <div class="btn btn-full btn-large btn-black waves-light waves-effect" 
                                     v-on:click="toggleModal(x)">
                                    {{x.name}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    mixins: [serviceProvider],
    data: function(){ 
        return {
            message: 'Hello Vue!',
            show: false,
            contain: true,
            modalPage:{page:'dash'},
            category:[
                {name:'fashion',color:'#e68213'},
                {name:'music',color:'#136ee6'},
                {name:'movie',color:'#b9499f'},
                {name:'sport',color:'#e61313'},
            ]
        }
    },
    created: function(){
        if(this.isWindowBig === true) return router.push('/')
        
    },
    methods: {
        wow: function(){
                var self = this;
                setTimeout(function(){
                self.message = 'Oh MY GOD';
                self.show = true;
            },5000)
        }
    }
});

const game = Vue.component('game',{
    template:`
        <div class="background center-align">
            <modal v-bind:modalData="modalData" v-bind:test="test" v-on:replay="retry" v-on:submitGame="submitGame" v-bind:modalPage="modalPage"></modal>
            <div style="background-color:white; width:100%;" >
                <div class="progress animated fadeInDown" style="margin-top:0px;background-color:#dadcda;margin-bottom: 0px;">
                    <div class="determinate" v-prog="prog" style="background:var(--main);"></div>
                    <div style="position: absolute;left: 50%;top: 5%;color:  white;">{{prog | number}}%</div>
                </div>
                <div class="chip animated" style="position:absolute;bottom:2%;right: 0;">
                    <img :src="profile.url" alt="Contact Person">
                    {{profile.fullname}}
                </div>
                <spinner class="animated fadeIn" :colorClass="'default'" v-show="loader"></spinner>
            </div>
            <div id="svg" style="background-color:white; width:100%; height:80%;" >
                <div class="btn list-me animated bounceIn" v-bind:class="{'hide': prog !== 100}">
                        Completed!!  <i class="fa fa-clock-o"></i> 
                        {{test.time_result[0]}}<span>m</span>:{{test.time_result[1]}}<span>s</span>
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
            test: {end_time:null, start_time:null,time_result:'0:0',timePlayed:null,bestTime:null},
            picColumn : 2,
            picRow : 2,
            puzzLevel: 1,
            currentUrl: '',
            profile: {},
            modalPage:{page:'game',insta:false,loader:false,fail:false,imageacquired:false}
        }
    },
    mounted: function(){
        if(this.isWindowBig === true) return router.push('/')

        if(this.$store.state.celebList !== null){
            this.svgSpace = document.getElementById('svg')
            this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
        }
    },
    methods: {
        isStarted : function(){
            if(this.test.start_time === null){
                this.test.start_time = moment();
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
                this.picColumn =5;
                this.picRow = 5;
                this.puzzLevel += 1;
                this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
            }else{
                // game is finished and time to move on
                this.test.hideModal = false;
                this.updateBestTime()
                this.toggleModal()
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
            this.test =  {end_time:null, start_time:null,time_result:'0:0',timePlayed:null,bestTime:null},
            this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
        },
        submitGame: function(inputProfile){
            if(this.safe(inputProfile)){
                let timestamp =  moment().toISOString()
                let playtime = this.test.timePlayed
                let name = inputProfile.replace('@','').toLowerCase()
                let picurl = this.url
                let postData = {timestamp,playtime,name,picurl}
                localStorage.instahandle = name
                console.log(postData)
                axios.post(`https://styleminions.co/api/puzzlesubmit?timestamp=${timestamp}&playtime=${playtime}&name=${name}&picurl=${picurl}`)
                .then((response)=>{
                    this.modalInstance.close()
                    router.push('/leaderboard')
                })
            }else{
                console.warn('what are you doing fam?')
            }
        },
        isLevelCompleted : function(){
            if(this.correct.length === this.picBoxes){
                //$scope.draw.text('you win').move(50,50);
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
            let categoryList = this.$store.state.celebList.filter(item => item.category === category)
            let randomIndex = Math.floor(Math.random()*(categoryList.length));
            let handle = categoryList[randomIndex].handle
            return new Promise((resolve,reject)=>{
                fetch(`https://www.instagram.com/${handle}/`)
                .then((res)=>{
                    if(res.status === 200){
                        return  res.text();
                    }else{
                        this.getImage();
                    }       
                })
                .then((data)=>{
                    let sift = JSON.parse(data.match(/window._sharedData = ({.+);/i)[1]);
                    let user = sift.entry_data.ProfilePage["0"].graphql.user
                    let instaList = sift.entry_data.ProfilePage["0"].graphql.user.edge_owner_to_timeline_media.edges
                    let imageList = instaList.filter(item => item.node.is_video === false)
                    if(imageList.length < 1){
                        this.getImage()
                    }else{
                        let index = Math.floor(Math.random()*(imageList.length));
                        this.profile = {fullname:user.full_name, url:user.profile_pic_url}
                        resolve(imageList[index].node.display_url);
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
                    elem.click(()=>{
                        this.isStarted();
                        this.tones('e',5,10,null,'sine');
                        this.vibrate(100)
                        elem.animate(100).width(this.dw - this.dw*0.3);
                        if(this.waste.length < 2){
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
                            SVG.get(this.waste[0].node.id).animate(500).move(b.x,b.y).animate(100).width(this.dw);
                            SVG.get(this.waste[1].node.id).animate(500).move(a.x,a.y).animate(100).width(this.dw);
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
                        //console.log(elem);
                    });
                    
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
                M.toast({html:`<div class="center-align full-width">${this.footnote_msg}</div>`,displayLength:3000});
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
            leaderboardList:[]
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
            this.loader = true
            let today = this.currentGameDay
            axios.get(`https://styleminions.co/api/puzzlechamps?today=${today}`)
            .then((res)=>{
                console.log(res)
                this.leaderboardList = res.data;
                this.loader = false
            })
        }
    },
    created:function(){
        if(this.isWindowBig === true) return router.push('/')
        this.getLeaderboard()
    },
    mounted:function(){
        setInterval(()=>{
            this.makeHeart();
        },900)
    }
})

Vue.component('modal',{
    props:['modalData','test','url','modalPage'],
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
            <img :src="url" alt="" class="circle responsive-img img-lead">
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

const store = new Vuex.Store({
    //state management in VUE
    state:{
        instaName:'',
        celebList:null,
        url: 'https://scontent-yyz1-1.cdninstagram.com/vp/6be0630296a2eddc74eac879437eff98/5B7E2DF1/t51.2885-19/s150x150/28753195_156320601741376_5135544669874159616_n.jpg'
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
        }
    }
})

const routes = [
  { path: '/leaderboard', component: leaderboard },
  { path: '/dash', component: container },
  { path: '/game/:category', component: game },
  { path: '/', component: landing },
  { path: '', redirect: '/' },
];
const router = new VueRouter({
  routes // short for `routes: routes`
});

var app = new Vue({
    router:router,
    store:store
}).$mount('#myapp');