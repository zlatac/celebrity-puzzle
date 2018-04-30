const serviceProvider = {
    data: function(){
        return{
            modalInstance:null,
            modalData:{},
            name:'',
        }
    },
    computed:{
        instaName(){
            return this.$store.state.instaName;
        }
    },
    mounted: function(){
        let elem = document.querySelector('.modal');
        if(elem){
            this.modalInstance = M.Modal.init(elem);
        }                    
    },
    methods:{
        safe : function safe (a){
            if(a === undefined || a === null || a === ''){
                return false;
            }
            return true;
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
        gameTimePlayed : function ($scope){
            //get current time
            $scope.test.end_time = moment();
            //get difference between start and end in miliseconds
            let dif = $scope.test.end_time.diff($scope.test.start_time);
            //format the miliseconds to minutes,seconds and milliseconds
            $scope.test.timePlayed = moment(dif).format("mm:ss:SS");
            return $scope.test.timePlayed;
        },
        toggleModal: function(modalData){
            this.modalData = modalData;
            this.modalInstance.open();
        },
        insta:function(){
            this.$store.commit('insertName',this.name);
        }
    }
}
const landing = Vue.component('landing', {
    template: `<div class="landing animated fadeIn" main="height: 100%;width: 100%;position: absolute;background:var(--main)">
                    <div class="center-align fwhite" style="font-family: 'Pacifico', cursive;">
                        <div style="font-size:45px;margin-top:15%">Celebrity Puzzle</div>
                        <div style="font-size:26px;margin-top:20px">align the stars</div>
                        <!--<div class="btn btn-large red"><i class="fa fa-warning"></i> Mobile phones only</div>-->
                        <div class="animated fadeIn" style="margin-top:250px">
                            <div class="preloader-wrapper small active">
                                <div class="spinner-layer spinner-white-only">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div><div class="gap-patch">
                                    <div class="circle"></div>
                                </div><div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>`,
    mixins: [serviceProvider],
    created: function(){
        // setTimeout(function(){
        //     //might do something here at some point
        //     router.push('dash');
        // },3000)
    }
});
const container = Vue.component('container', {
    template: `
        <div>
            <div class="top-banner"></div>
            <div class="container">
                <modal v-bind:category="modalData"></modal>
                <router-link to="/leaderboard">
                    <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4">
                        <i class="fa fa-trophy" style="font-size:34px;color:white"></i>
                    </div>
                </router-link>
                <!--<div class="row">
                    <div class="col s12">
                        <div class="card" v-if="show !== true">
                            <div class="card-content">
                                    <p>{{message}}</p>
                            </div>
                        </div>
                    </div>
                </div>-->
                <div class="row"></div>
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
                <input type="text" @keyup="insta" v-model="name">
            </div>
        </div>
    `,
    mixins: [serviceProvider],
    data: function(){ 
        return {
            message: 'Hello Vue!',
            show: false,
            contain: true,
            url: null,
            category:[
                {name:'FASHION',color:'#e68213'},
                {name:'MUSIC',color:'#136ee6'},
                {name:'MOVIES',color:'#b9499f'},
                {name:'SPORTS',color:'#e61313'},
            ]
        }
    },
    created: function(){
        this.message = 'damn girl',
        this.wow();
        self = this;
        // fetch('https://www.instagram.com/bohnchild/').then(function(res){
        //      return  res.text();    
        // })
        // .then(function(data){
        //     let sift = data.match(/og:image.+(http.+)"/i)[1];
        //     //json object with everything regex /window._sharedData = ({.+);/
        //      console.log(sift);
        //      self.url = sift
        // });
        
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
            <div style="background-color:white; width:100%;" >
                <div class="progress animated fadeInDown" style="margin-top:0px;background-color:#dadcda;margin-bottom: 0px;" 
                >
                    <div class="determinate" v-prog="prog" style="background:var(--main);"></div>
                    <div style="position: absolute;left: 50%;top: 5%;color:  white;">{{prog | number}}%</div>
                </div>
                <!-- <div class="btn list-me" v-on:click="setUp(375,501)">Run</div> -->
            </div>
            <div id="svg" style="background-color:white; width:100%; height:80%;" >
                <div class="btn list-me animated bounceIn" v-bind:class="{'hide': prog !== 100}">
                        Completed!!  <i class="fa fa-clock-o"></i> 
                        {{test.time_result[0]}}<span>m</span>:{{test.time_result[1]}}<span>s</span>
                </div>
                <!-- <div class="btn list-me animated bounceIn" v-bind:class="{'hide': prog == 100}">
                        Puzzlegram
                </div> -->
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
            test: {end_time:null, start_time:null,time_result:'0:0'},
            picColumn : 2,
            picRow : 2,
            puzzLevel: 1
        }
    },
    mounted: function(){
        this.svgSpace = document.getElementById('svg')
        this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
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
                this.picColumn = 6;
                this.picRow = 6;
                this.puzzLevel += 1;
                this.setUp(this.svgSpace.clientWidth,this.svgSpace.clientHeight);
            }else{
                // game is finished and time to move on
                this.test.hideModal = false;
            }
        },
        isLevelCompleted : function(){
            let self = this;
            if(this.correct.length === this.picBoxes){
                //$scope.draw.text('you win').move(50,50);
                this.output = 'Completed'
                this.test.time_result = this.gameTimePlayed(this).split(':');
                this.tones('f',5,500);
                //$scope.mocha.vibrate(2000);
                setTimeout(()=>{
                    self.levelUp();
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
        drawCanvas : function(fWidth, fHeight){
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
                im.src = 'https://scontent-yyz1-1.cdninstagram.com/vp/a0f1f9b8a2924eb3869b5d71b3bb4fb9/5B184CB1/t51.2885-15/e35/26863250_2004244896455821_3703496126918295552_n.jpg';
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
            this.picBoxes = this.picColumn * this.picRow;
            this.footnote_hide = false;
            this.footnote = true;
            this.footnote_msg = this.puzzLevel < 2 ? 'Round ' + this.puzzLevel : 'Final Round';
            this.drawCanvas(w,h)
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
                M.toast({html:`<div class="center-align full-width">${this.footnote_msg}</div>`,displayLength:2000000});
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
            leadList:[2,3,4,5,6,7,8,9,11,12,13,14,15,17],
            movingHearts:[],
            url: 'https://scontent-yyz1-1.cdninstagram.com/vp/6be0630296a2eddc74eac879437eff98/5B7E2DF1/t51.2885-19/s150x150/28753195_156320601741376_5135544669874159616_n.jpg'
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
            let self  = this;
            setTimeout(function(){
                let index = self.movingHearts.findIndex(i => i.id === b);
                self.movingHearts.splice(index,1);
            },c * 1200)
        }
    },
    mounted:function(){
        let self = this
        setInterval(function(){
            self.makeHeart();
        },900)
    }
})

Vue.component('modal',{
    props:['category'],
    template:`
        <!-- Modal Structure -->
        <div id="modal1" class="modal modal-fixed-footer">
        <div class="modal-content">
            <h4>Modal Header{{category.name}}</h4>
            <p>A bunch of text</p>
        </div>
        <div class="modal-footer">
            <span class="modal-action modal-close waves-effect waves-green btn-flat ">Agree</span>
        </div>
        </div>
    `,
    mixins: [serviceProvider]
})

Vue.directive('buzz', {
    bind: function(el){
        console.log(el);
        el.onclick = function(){
            app.$children[0];
        }
    }
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
    },
    mutations:{
        insertName(state, data){
            state.instaName = data;
        }
    }
})

const routes = [
  { path: '/leaderboard', component: leaderboard },
  { path: '/dash', component: container },
  { path: '/game', component: game },
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