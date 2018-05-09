'use strict';

var serviceProvider = {
    data: function data() {
        return {
            modalInstance: null,
            modalData: {},
            leadList: [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17],
            name: '',
            profileTimeout: null,
            inputProfile: '',
            testProfile: [{ name: 'kim k', url: "https://scontent-yyz1-1.cdninstagram.com/vp/a1578586761b73b52936c4a9ca4780df/5B94EF59/t51.2885-19/s150x150/19228783_1421845407904949_3402248722799656960_a.jpg" }, { name: 'sofia', url: 'https://scontent-yyz1-1.cdninstagram.com/vp/58dce42512d59709c76790d416c635f9/5B7957B9/t51.2885-19/s150x150/22159185_179929515914042_379745688163975168_n.jpg' }, { name: 'shaq', url: 'https://scontent-yyz1-1.cdninstagram.com/vp/545396c0bea9704c9e90093767a642da/5B91DEB6/t51.2885-19/s150x150/10818077_1772497556311865_1111187484_a.jpg' }]
        };
    },
    computed: {
        instaName: function instaName() {
            return this.$store.state.instaName;
        },
        url: function url() {
            return this.$store.state.url;
        },
        previousChampion: function previousChampion() {
            return this.leadList.slice(0, 3);
        },
        currentGameDay: function currentGameDay() {
            return moment().startOf('day').toISOString();
        },
        previousGameDay: function previousGameDay() {
            return moment().subtract(1, 'days').startOf('day').toISOString();
        },
        savedProfile: function savedProfile() {
            if (this.safe(localStorage.instahandle)) {
                return localStorage.instahandle;
            }
            return '';
        }
    },
    mounted: function mounted() {
        var modal = document.querySelector('.modal');
        var tooltip = document.querySelector('.tooltipped');
        var modalOptions = {};
        if (this.$route.path.includes('game')) modalOptions.dismissible = false;
        if (modal) this.modalInstance = M.Modal.init(modal, modalOptions);
        if (tooltip) M.Tooltip.init(tooltip);
    },
    beforeCreate: function beforeCreate() {
        var _this = this;

        if (this.$route.path.includes('game') && this.$store.state.celebList === null) {
            return router.push('/');
        }
        if (this.$store.state.celebList === null) {
            fetch('/scripts/celebs.json').then(function (res) {
                //get celebrity list
                return res.json();
            }).then(function (data) {
                _this.$store.commit('celebList', data);
            });
        }
    },
    methods: {
        safe: function safe(a) {
            if (a === undefined || a === null || a === '') {
                return false;
            }
            return true;
        },
        randomize: function randomize(array) {
            //Algorithm to shuffle an array
            var input = array;

            for (var i = input.length - 1; i >= 0; i--) {

                var randomIndex = Math.floor(Math.random() * (i + 1));
                var itemAtIndex = input[randomIndex];

                input[randomIndex] = input[i];
                input[i] = itemAtIndex;
            }
            return input;
        },
        tones: function (_tones) {
            function tones(_x, _x2, _x3, _x4, _x5) {
                return _tones.apply(this, arguments);
            }

            tones.toString = function () {
                return _tones.toString();
            };

            return tones;
        }(function (key, octave, release, attack, type) {
            tones.release = release || tones.release;
            tones.attack = attack || tones.attack;
            tones.type = type || tones.type;
            tones.play(key, octave);
        }),
        vibrate: function vibrate(seconds) {
            if ('vibrate' in navigator) {
                navigator.vibrate(seconds);
            }
        },
        gameTimePlayed: function gameTimePlayed($scope) {
            //get current time
            $scope.test.end_time = moment();
            //get difference between start and end in miliseconds
            var dif = $scope.test.end_time.diff($scope.test.start_time);
            //format the miliseconds to minutes,seconds and milliseconds
            $scope.test.timePlayed = moment(dif).format("mm:ss:SS");
            return $scope.test.timePlayed;
        },
        toggleModal: function toggleModal(modalData) {
            this.modalData = modalData;
            this.modalInstance.open();
        },
        insta: function insta() {
            this.$store.commit('insertName', this.name);
        },
        showSubmit: function showSubmit() {
            this.modalPage.insta = true;
            this.profileExist();
        },
        profileExist: function profileExist() {
            if (this.savedProfile !== '') {
                this.inputProfile = this.savedProfile;
                this.getProfile();
            }
        },
        getProfile: function getProfile() {
            var _this2 = this;

            this.modalPage.imageacquired = false; // remove submit button while typing
            if (this.profileTimeout !== null) {
                clearTimeout(this.profileTimeout);
            }
            this.profileTimeout = setTimeout(function () {
                //console.log(this.inputProfile)
                var profile = _this2.inputProfile.replace('@', '').toLowerCase();
                _this2.fetchInstaProfile(profile);
            }, 1200);
        },
        fetchInstaProfile: function fetchInstaProfile(profile) {
            var _this3 = this;

            this.modalPage.loader = true;
            if (profile === '') return this.modalPage.fail = true;
            fetch('https://www.instagram.com/' + profile + '/').then(function (res) {
                if (res.status === 200) {
                    return res.text();
                } else {
                    _this3.modalPage.fail = true;
                    return 'failed';
                }
            }).then(function (data) {
                if (data !== 'failed') {
                    var sift = data.match(/og:image.+(http.+)"/i)[1];
                    _this3.$store.commit('url', sift);
                    _this3.modalPage.fail = false;
                    _this3.modalPage.loader = false;
                    _this3.modalPage.imageacquired = true;
                }
            });
            //this.url = profile;
        }
    }
};
var landing = Vue.component('landing', {
    template: '<div class="landing animated fadeIn" main="height: 100%;width: 100%;position: absolute;background:var(--main)">\n                    <div class="center-align fwhite" style="font-family: \'Pacifico\', cursive;">\n                        <div style="font-size:45px;margin-top:15%">Celebrity Puzzle</div>\n                        <div style="font-size:26px;margin-top:20px">align the stars</div>\n                        <!--<div class="btn btn-large red"><i class="fa fa-warning"></i> Mobile phones only</div>-->\n                        <spinner class="animated fadeIn" style="margin-top:250px" :colorClass="\'white\'"></spinner>\n                    </div>\n               </div>',
    mixins: [serviceProvider],
    created: function created() {
        setTimeout(function () {
            //might do something here at some point
            router.push('dash');
        }, 3000);
    }
});
var container = Vue.component('container', {
    template: '\n        <div>\n            <div class="top-banner"></div>\n            <div class="container">\n                <modal v-bind:modal-data="modalData" v-bind:modalPage="modalPage"></modal>\n                <router-link to="/leaderboard">\n                    <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4">\n                        <i class="fa fa-trophy" style="font-size:34px;color:white"></i>\n                    </div>\n                </router-link>\n                <div class="row animated fadeInDown tooltipped" data-position="bottom" data-tooltip="Yesterday\'s Champions">\n                    <div class="col s12">\n                        <div class="row" style="margin:0.5rem 0 0.1rem 0;">\n                            <champion class="col s4" v-for="(x, index) in testProfile" :url="x.url" :index="index"></champion>\n                        </div>\n                    </div>\n                </div>\n                <div class="row animated bounceInLeft" v-for="x in category">\n                    <div class="col s12">\n                        <div class="card card-side z-depth-2" v-bind:style="{borderLeftColor: x.color}">\n                            <div class="card-content">\n                                <div class="btn btn-full btn-large btn-black waves-light waves-effect" \n                                     v-on:click="toggleModal(x)">\n                                    {{x.name}}\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ',
    mixins: [serviceProvider],
    data: function data() {
        return {
            message: 'Hello Vue!',
            show: false,
            contain: true,
            modalPage: { page: 'dash' },
            category: [{ name: 'fashion', color: '#e68213' }, { name: 'music', color: '#136ee6' }, { name: 'movie', color: '#b9499f' }, { name: 'sport', color: '#e61313' }]
        };
    },
    created: function created() {
        this.message = 'damn girlz', this.wow();
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
        wow: function wow() {
            var self = this;
            setTimeout(function () {
                self.message = 'Oh MY GOD';
                self.show = true;
            }, 5000);
        }
    }
});

var game = Vue.component('game', {
    template: '\n        <div class="background center-align">\n            <modal v-bind:modalData="modalData" v-bind:test="test" v-on:replay="retry" v-on:submitGame="submitGame" v-bind:modalPage="modalPage"></modal>\n            <div style="background-color:white; width:100%;" >\n                <div class="progress animated fadeInDown" style="margin-top:0px;background-color:#dadcda;margin-bottom: 0px;">\n                    <div class="determinate" v-prog="prog" style="background:var(--main);"></div>\n                    <div style="position: absolute;left: 50%;top: 5%;color:  white;">{{prog | number}}%</div>\n                </div>\n                <div class="chip animated" style="position:absolute;bottom:2%;right: 0;">\n                    <img :src="profile.url" alt="Contact Person">\n                    {{profile.fullname}}\n                </div>\n            </div>\n            <div id="svg" style="background-color:white; width:100%; height:80%;" >\n                <div class="btn list-me animated bounceIn" v-bind:class="{\'hide\': prog !== 100}">\n                        Completed!!  <i class="fa fa-clock-o"></i> \n                        {{test.time_result[0]}}<span>m</span>:{{test.time_result[1]}}<span>s</span>\n                </div>\n            </div>\n            \n            <canvas id="canvas"></canvas>\n        \n        </div>\n    ',
    mixins: [serviceProvider],
    data: function data() {
        return {
            waste: [],
            correct: [],
            dw: null,
            dh: null,
            draw: null,
            sw: null,
            sh: null,
            shuffle: [],
            basket: [],
            output: '',
            prog: 0,
            test: { end_time: null, start_time: null, time_result: '0:0', timePlayed: null, bestTime: null },
            picColumn: 2,
            picRow: 2,
            puzzLevel: 1,
            currentUrl: '',
            profile: {},
            modalPage: { page: 'game', insta: false, loader: false, fail: false, imageacquired: false }
        };
    },
    mounted: function mounted() {
        if (this.$store.state.celebList !== null) {
            this.svgSpace = document.getElementById('svg');
            this.setUp(this.svgSpace.clientWidth, this.svgSpace.clientHeight);
        }
    },
    methods: {
        isStarted: function isStarted() {
            if (this.test.start_time === null) {
                this.test.start_time = moment();
            }
        },
        progressFunc: function progressFunc() {
            this.prog = this.correct.length / this.picBoxes * 100;
        },
        updateBestTime: function updateBestTime() {
            var currentTime = this.test.timePlayed;
            if ('bestTime' in localStorage) {
                var bestTime = localStorage.bestTime;
                if (currentTime < bestTime) {
                    this.test.bestTime = currentTime;
                    localStorage.bestTime = currentTime;
                } else {
                    this.test.bestTime = bestTime;
                }
            } else {
                this.test.bestTime = currentTime;
                localStorage.bestTime = currentTime;
            }
        },
        levelUp: function levelUp() {
            if (this.puzzLevel < 2) {
                this.draw.clear();
                this.waste = [];
                this.correct = [];
                this.dw, this.dh, this.draw;
                this.sw, this.sh;
                this.shuffle = [];
                this.basket = [];
                this.prog = 0;
                this.picColumn = 3;
                this.picRow = 3;
                this.puzzLevel += 1;
                this.setUp(this.svgSpace.clientWidth, this.svgSpace.clientHeight);
            } else {
                // game is finished and time to move on
                this.test.hideModal = false;
                this.updateBestTime();
                this.toggleModal();
            }
        },
        retry: function retry() {
            // this lets them replay the same category
            this.draw.clear();
            this.waste = [];
            this.correct = [];
            this.dw, this.dh, this.draw;
            this.sw, this.sh;
            this.shuffle = [];
            this.basket = [];
            this.prog = 0;
            this.picColumn = 2;
            this.picRow = 2;
            this.puzzLevel = 1;
            this.currentUrl = '', this.test = { end_time: null, start_time: null, time_result: '0:0', timePlayed: null, bestTime: null }, this.setUp(this.svgSpace.clientWidth, this.svgSpace.clientHeight);
        },
        submitGame: function submitGame(inputProfile) {
            var _this4 = this;

            if (this.safe(inputProfile)) {
                var timestamp = moment().toISOString();
                var playtime = this.test.timePlayed;
                var name = inputProfile.replace('@', '').toLowerCase();
                var picurl = this.url;
                var postData = { timestamp: timestamp, playtime: playtime, name: name, picurl: picurl };
                localStorage.instahandle = name;
                console.log(postData);
                axios.post('https://styleminions.co/api/puzzlesubmit?timestamp=' + timestamp + '&playtime=' + playtime + '&name=' + name + '&picurl=' + picurl).then(function (response) {
                    _this4.modalInstance.close();
                    router.push('/leaderboard');
                });
            } else {
                console.warn('what are you doing fam?');
            }
        },
        isLevelCompleted: function isLevelCompleted() {
            var _this5 = this;

            if (this.correct.length === this.picBoxes) {
                //$scope.draw.text('you win').move(50,50);
                this.output = 'Completed';
                this.test.time_result = this.gameTimePlayed(this).split(':');
                this.tones('f', 5, 500);
                this.vibrate(2000);
                setTimeout(function () {
                    _this5.levelUp();
                }, 2000);
                //console.log('THE END FAM')
            }
        },
        checker: function checker(d, e) {
            if (e.x === d.truth.x && e.y === d.truth.y) {
                //Player is right
                if (!this.correct.includes(d.truth.x + ':' + d.truth.y)) {
                    this.correct.push(d.truth.x + ':' + d.truth.y);
                    //console.log('right boy')
                }
            } else {
                //player is wrong
                if (this.correct.includes(d.truth.x + ':' + d.truth.y)) {
                    var pos = this.correct.indexOf(d.truth.x + ':' + d.truth.y);
                    this.correct.splice(pos, 1);
                }
                //console.log('wrong boy')
            }

            this.isLevelCompleted();
        },
        getImage: function getImage() {
            var _this6 = this;

            if (this.currentUrl !== '') {
                return new Promise(function (resolve, reject) {
                    resolve(_this6.currentUrl);
                });
            }
            var category = this.$route.params.category;
            var categoryList = this.$store.state.celebList.filter(function (item) {
                return item.category === category;
            });
            var randomIndex = Math.floor(Math.random() * categoryList.length);
            var handle = categoryList[randomIndex].handle;
            return new Promise(function (resolve, reject) {
                fetch('https://www.instagram.com/' + handle + '/').then(function (res) {
                    if (res.status === 200) {
                        return res.text();
                    } else {
                        _this6.getImage();
                    }
                }).then(function (data) {
                    var sift = JSON.parse(data.match(/window._sharedData = ({.+);/i)[1]);
                    var user = sift.entry_data.ProfilePage["0"].graphql.user;
                    var instaList = sift.entry_data.ProfilePage["0"].graphql.user.edge_owner_to_timeline_media.edges;
                    var imageList = instaList.filter(function (item) {
                        return item.node.is_video === false;
                    });
                    if (imageList.length < 1) {
                        _this6.getImage();
                    } else {
                        var index = Math.floor(Math.random() * imageList.length);
                        _this6.profile = { fullname: user.full_name, url: user.profile_pic_url };
                        resolve(imageList[index].node.display_url);
                    }
                });
            });
        },
        drawCanvas: function drawCanvas(fWidth, fHeight, imgUrl) {
            var self = this;
            return new Promise(function (resolve, reject) {
                var canvas = document.getElementById('canvas');

                var ctx = canvas.getContext('2d');
                //console.log(ctx)

                var im = new Image();
                im.crossOrigin = 'Anonymous';
                //perfect on mobile for any image dimensions (square, 3:4 ratio and 4:3 ratio)
                //good on desktop for only square and 4:3 ratio image dimensions
                //im.src = 'https://scontent-yyz1-1.cdninstagram.com/vp/2c9e475a6c684b4eb20fb9c06a9c8c36/5B01A374/t51.2885-15/e35/24274488_1204373613026222_6359081673119760384_n.jpg';
                im.src = imgUrl;
                //im.src = 'https://scontent-yyz1-1.cdninstagram.com/vp/192110115a0379f7200f2aabeac9a7e5/5B094E85/t51.2885-15/e35/11849357_536498379834099_188237789_n.jpg';
                //sw and sh are the withis.dh and height of the image piece to be cut from the raw image
                im.onload = function () {

                    if (im.height > im.width && window.innerWidth > 768) {
                        //this turns the image into a square (1:1) dimension only on desktop
                        //to then be used as an image for the puzzle
                        var width = im.width;
                        var height = im.height;
                        canvas.setAttribute('width', width);
                        canvas.setAttribute('height', width);
                        ctx.imageSmoothingQuality = "high";
                        ctx.drawImage(im, 0, 0, width, width, 0, 0, width, width);
                        im.src = canvas.toDataURL('image/png', 1); //this triggers the image onload() method
                    } else {
                        //this continues the task normally either after square transformation or when the if block requirement isn't met
                        var space = 2;
                        var sw = Math.round((im.width - space * self.picColumn) / self.picColumn);
                        var sh = Math.round((im.height - space * self.picRow) / self.picRow);

                        //self.dw and self.dh are the height and width to be drawn on the canvas based on the aspect ratio of the raw image
                        self.dw = Math.round((fWidth - space * self.picColumn) / self.picColumn);
                        self.dh = Math.round((fHeight - space * self.picRow) / self.picRow);

                        canvas.setAttribute('width', sw);
                        canvas.setAttribute('height', sh);
                        self.sw = sw;
                        self.sh = sh;
                        ctx.imageSmoothingQuality = "high";

                        //ctx.self.drawImage(im,0,0,sw,sh,0,0,self.dw,self.dh)
                        //by default i want 30 pieces of any image i.e 5 columns and 6 rows for mobile devices.
                        for (var i = 0; i < self.picColumn; i++) {
                            for (var j = 0; j < self.picRow; j++) {
                                //ctx.self.drawImage(im,i*(sw + 1),j*(sh + 1),sw,sh,i*(self.dw + 5),j*(self.dh + 5),self.dw,self.dh);
                                ctx.drawImage(im, i * (sw + 1), j * (sh + 1), sw, sh, 0, 0, sw, sh);
                                var drawdata = {};
                                drawdata.img = canvas.toDataURL('image/png', 1);
                                drawdata.x = i * (self.dw + space);
                                drawdata.y = j * (Math.round(self.sh * self.dw / self.sw) + space);
                                self.basket.push(drawdata);
                                //ctx.clearRect(0,0,sw,sh);
                            }
                        }

                        //console.log(self.basket);
                        self.shuffle = self.basket.map(function (item) {
                            return { x: item.x, y: item.y };
                        });
                        self.shuffle = self.randomize(self.shuffle);
                        resolve(self.shuffle);
                    }
                };
            });
        },
        setUp: function setUp(w, h) {
            var _this7 = this;

            this.picBoxes = this.picColumn * this.picRow;
            this.footnote_hide = false;
            this.footnote = true;
            this.footnote_msg = this.puzzLevel < 2 ? 'Round ' + this.puzzLevel : 'Final Round';
            this.getImage().then(function (data) {
                _this7.currentUrl = data;
                return _this7.drawCanvas(w, h, data);
            }).then(function (data) {
                //console.log('yeaaaaaaaaaah', this.basket);
                if (!_this7.safe(_this7.draw)) {
                    _this7.svg = document.getElementById('svg');
                    _this7.draw = SVG(_this7.svg).size(w, h);
                }

                //console.log(this.basket);
                var z = 0;
                _this7.basket.forEach(function (item) {
                    //let elem = this.draw.image(item.img,this.dw,this.dh);
                    var elem = _this7.draw.image(item.img, _this7.dw, Math.round(_this7.sh * _this7.dw / _this7.sw));
                    elem.x(_this7.shuffle[z].x);
                    elem.y(_this7.shuffle[z].y);
                    elem.truth = { x: item.x, y: item.y };
                    elem.attr('v-buzz', '');
                    elem.click(function () {
                        _this7.isStarted();
                        _this7.tones('e', 5, 10, null, 'sine');
                        _this7.vibrate(100);
                        elem.animate(100).width(_this7.dw - _this7.dw * 0.3);
                        if (_this7.waste.length < 2) {
                            _this7.waste.push(elem);
                        }
                        if (_this7.waste.length === 2 && _this7.waste[0].node.id !== _this7.waste[1].node.id) {
                            var a = { x: _this7.waste[0].node.x.baseVal.value,
                                y: _this7.waste[0].node.y.baseVal.value,
                                truth: _this7.waste[0].truth
                            };
                            var b = { x: _this7.waste[1].node.x.baseVal.value,
                                y: _this7.waste[1].node.y.baseVal.value,
                                truth: _this7.waste[1].truth
                            };
                            SVG.get(_this7.waste[0].node.id).animate(500).move(b.x, b.y).animate(100).width(_this7.dw);
                            SVG.get(_this7.waste[1].node.id).animate(500).move(a.x, a.y).animate(100).width(_this7.dw);
                            _this7.checker(a, b);
                            _this7.checker(b, a);
                            _this7.progressFunc();
                            _this7.waste = [];

                            //console.log(a,b)
                        } else if (_this7.waste.length === 2 && _this7.waste[0].node.id == _this7.waste[1].node.id) {
                            //this is the situation where the same box is touched
                            elem.animate(100).width(_this7.dw);
                            _this7.waste = [];
                        }
                        //console.log(elem);
                    });

                    elem.loaded(function () {
                        //on initialization check if element is in the right position
                        var pos = { x: elem.node.x.baseVal.value,
                            y: elem.node.y.baseVal.value
                        };
                        if (pos.x === elem.truth.x && pos.y === elem.truth.y) {
                            _this7.correct.push(elem.truth.x + ':' + elem.truth.y);
                        }
                        _this7.progressFunc();
                        _this7.isLevelCompleted(); //sometimes the randomized data can be exactly solved on the first round
                    });

                    z++;
                    //elem.mouseout(()=>{elem.animate(100).width(50);});
                });
                M.toast({ html: '<div class="center-align full-width">' + _this7.footnote_msg + '</div>', displayLength: 3000 });
                //$compile(this.draw.node)(this); //this is important for the new elements added to the DOM to be compiled by angular
            });
        }
    }
});

var leaderboard = Vue.component('leaderboard', {
    template: '#leaderboard',
    mixins: [serviceProvider],
    data: function data() {
        return {
            movingHearts: [],
            leaderboardList: []
        };
    },
    methods: {
        makeHeart: function makeHeart() {
            var _this8 = this;

            var b = Math.floor(Math.random() * 100 + 1);
            var d = ["flowOne", "flowTwo", "flowThree"];
            var a = ["colOne", "colTwo", "colThree", "colFour", "colFive", "colSix"];
            var c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
            var bucket = {};
            bucket.id = b;
            bucket.color = a[Math.floor(Math.random() * 6)];
            bucket.font = Math.floor(Math.random() * (50 - 22) + 22);
            bucket.flow = d[Math.floor(Math.random() * 3)];
            bucket.seconds = c;
            this.movingHearts.push(bucket);
            setTimeout(function () {
                var index = _this8.movingHearts.findIndex(function (i) {
                    return i.id === b;
                });
                _this8.movingHearts.splice(index, 1);
            }, c * 1200);
        },
        getLeaderboard: function getLeaderboard() {
            var _this9 = this;

            var today = this.currentGameDay;
            axios.get('https://styleminions.co/api/puzzlechamps?today=' + today).then(function (res) {
                console.log(res);
                _this9.leaderboardList = res.data;
            });
        }
    },
    created: function created() {
        this.getLeaderboard();
    },
    mounted: function mounted() {
        var _this10 = this;

        setInterval(function () {
            _this10.makeHeart();
        }, 900);
    }
});

Vue.component('modal', {
    props: ['modalData', 'test', 'url', 'modalPage'],
    template: '#comp-modal',
    mixins: [serviceProvider],
    data: function data() {
        return {
            whyme: 'heloo'
        };
    }
});

Vue.component('champion', {
    props: ['index', 'url'],
    template: '\n        <div style="position: relative;">\n            <img :src="url" alt="" class="circle responsive-img img-lead">\n            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3 animated tada infinite" v-if="index === 0"><i class="fa fa-trophy gold"></i></span>\n            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 1"><i class="fa fa-trophy silver"></i></span>\n            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 2"><i class="fa fa-trophy bronze"></i></span>\n            <span class="btn btn-small btn-floating lead-fab z-depth-3" v-if="index > 2">{{index + 1}}</span>\n        </div>\n    '
});
Vue.component('spinner', {
    props: ['colorClass'],
    template: '\n        <div class="preloader-wrapper small active">\n            <div class="spinner-layer" :class="{\'spinner-white-only\': colorClass === \'white\', \'spinner-celeb\': colorClass === \'default\'}">\n            <div class="circle-clipper left">\n                <div class="circle"></div>\n            </div><div class="gap-patch">\n                <div class="circle"></div>\n            </div><div class="circle-clipper right">\n                <div class="circle"></div>\n            </div>\n            </div>\n        </div>\n    '
});
Vue.directive('prog', {
    update: function update(el, binding) {
        el.style.width = binding.value + '%';
    }
});
Vue.directive('disappear', {
    inserted: function inserted(el, binding, vnode) {
        var self = this;
        // setTimeout(function(){
        //     //vnode.context.$vnode.componentInstance.leadList.splice(binding.value,1)
        //     let index = self.app.$children[0].leadList.findIndex((i)=> i === binding.value)
        //     self.app.$children[0].leadList.splice(index,1)
        //     //console.log(vnode)
        // },5000)
    }
});
Vue.filter('number', function (value) {
    value = Number(value);
    return Math.round(value);
});

var store = new Vuex.Store({
    //state management in VUE
    state: {
        instaName: '',
        celebList: null,
        url: 'https://scontent-yyz1-1.cdninstagram.com/vp/6be0630296a2eddc74eac879437eff98/5B7E2DF1/t51.2885-19/s150x150/28753195_156320601741376_5135544669874159616_n.jpg'
    },
    mutations: {
        insertName: function insertName(state, data) {
            state.instaName = data;
        },
        celebList: function celebList(state, data) {
            state.celebList = data;
        },
        url: function url(state, data) {
            state.url = data;
        }
    }
});

var routes = [{ path: '/leaderboard', component: leaderboard }, { path: '/dash', component: container }, { path: '/game/:category', component: game }, { path: '/', component: landing }, { path: '', redirect: '/' }];
var router = new VueRouter({
    routes: routes // short for `routes: routes`
});

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');