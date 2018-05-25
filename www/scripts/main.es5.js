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
            loader: false,
            toastInstance: null,
            noProfileUrl: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
            testProfile: [{ name: 'kimkardashian', profile_url: "https://scontent-yyz1-1.cdninstagram.com/vp/a1578586761b73b52936c4a9ca4780df/5B94EF59/t51.2885-19/s150x150/19228783_1421845407904949_3402248722799656960_a.jpg" }, { name: 'sofiavergara', profile_url: 'https://scontent-yyz1-1.cdninstagram.com/vp/58dce42512d59709c76790d416c635f9/5B7957B9/t51.2885-19/s150x150/22159185_179929515914042_379745688163975168_n.jpg' }, { name: 'shaq', profile_url: 'https://scontent-yyz1-1.cdninstagram.com/vp/545396c0bea9704c9e90093767a642da/5B91DEB6/t51.2885-19/s150x150/10818077_1772497556311865_1111187484_a.jpg' }],
            category: [{ name: 'fashion', color: '#e68213', text: 'fashion' }, { name: 'music', color: '#136ee6', text: 'music' }, { name: 'movie', color: '#b9499f', text: 'movies' }, { name: 'sport', color: '#e61313', text: 'sports' }]
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
            //return moment('2018/05/11','YYYY/MM/DD').toISOString();
        },
        previousGameDay: function previousGameDay() {
            return moment().subtract(1, 'days').startOf('day').toISOString();
        },
        currentGameMonth: function currentGameMonth() {
            return moment().startOf('month').toISOString();
        },
        savedProfile: function savedProfile() {
            if (this.safe(localStorage.instahandle)) {
                return localStorage.instahandle;
            }
            return '';
        },
        isWindowBig: function isWindowBig() {
            return this.checkWindow();
        },
        deviceId: function deviceId() {
            if ('deviceId' in localStorage) {
                return localStorage.deviceId;
            } else {
                return 'empty';
            }
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
            var location = window.location.port === '5500' ? '/www/scripts/celebs.json' : '/scripts/celebs.json';
            fetch(location).then(function (res) {
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
        checkWindow: function checkWindow() {
            if (window.innerWidth > 600 && window.innerWidth > 768) {
                //768px is for tablet (ipad)
                return true;
            }
            return false;
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
        resumeAudioContext: function resumeAudioContext() {
            //fucking chrome suspends audio context till the user acts on an event in the browser
            if (tones.context.state.includes('suspended')) {
                tones.context.resume().then(function () {
                    console.log('audio context back online');
                });
            }
        },
        toggleModal: function toggleModal(modalData) {
            this.modalData = modalData;
            this.modalInstance.open();
            this.resumeAudioContext();
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
        },
        generateDeviceId: function generateDeviceId() {
            var _this4 = this;

            axios('/myipaddress').then(function (res) {
                var ip = res.data;
                var unixtime = moment().unix();
                var hash = generateHash(ip, unixtime);
                localStorage.deviceId = hash;
            }).catch(function (error) {
                console.warn(new Error(error));
            }).finally(function () {
                _this4.sendToCategory();
            });
            function generateHash(ip, time) {
                //hash structure is [ip address + time + (ip-random)(time-random)(ip-random)]
                var address = ip.replace('.', '');
                var stringtime = String(time);
                var hash = '';
                for (var i = 0; i < 3; i++) {
                    if (i !== 1) {
                        hash += address[Math.floor(Math.random() * address.length)];
                    } else {
                        hash += stringtime[Math.floor(Math.random() * stringtime.length)];
                    }
                }
                return ip + '-' + time + '-' + hash;
            }
        },
        sendToCategory: function sendToCategory() {
            setTimeout(function () {
                router.push('dash');
            }, 3000);
        }
    }
};
var landing = Vue.component('landing', {
    template: '<div class="landing animated fadeIn" main="height: 100%;width: 100%;position: absolute;background:var(--main)">\n                    <div class="center-align fwhite" style="font-family: \'Pacifico\', cursive;">\n                        <div style="font-size:45px;margin-top:15%">Celebrity Puzzle</div>\n                        <div style="font-size:26px;margin-top:20px">align the stars</div>\n                        <div class="btn btn-large red-text white tooltipped" style="margin-top:20px" v-if="isWindowBig" data-position="top" data-tooltip="Coming soon to desktops and laptops">\n                            <i class="material-icons">stay_primary_portrait</i> Mobile phones only\n                        </div>\n                        <spinner class="animated fadeIn" style="margin-top:250px" :colorClass="\'white\'" v-if="!isWindowBig"></spinner>\n                    </div>\n               </div>',
    mixins: [serviceProvider],
    created: function created() {
        if (this.isWindowBig !== true) {
            if (!('deviceId' in localStorage)) {
                return this.generateDeviceId();
            }
            this.sendToCategory();
        }
    }
});
var container = Vue.component('container', {
    template: '\n        <div>\n            <div class="top-banner"></div>\n            <div class="container">\n                <modal v-bind:modal-data="modalData" v-bind:modalPage="modalPage"></modal>\n                <router-link to="/leaderboard">\n                    <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4">\n                        <i class="fa fa-trophy" style="font-size:34px;color:white"></i>\n                    </div>\n                </router-link>\n                <div class="row center-align" v-show="!loader" style="margin-top:20px">\n                    <div class="col s12">\n                        <spinner class="animated fadeIn" :colorClass="\'default\'"></spinner>\n                    </div>\n                </div>\n                <div class="row animated fadeInDown tooltipped" data-position="bottom" data-tooltip="Yesterday\'s Champions" v-show="loader">\n                    <div class="col s12">\n                        <div class="row" style="margin:0.5rem 0 0.1rem 0;">\n                            <champion class="col s4" v-if="prevWinners !== null" v-for="(x, index) in prevWinners" :url="x.profile_url" :index="index"></champion>\n                        </div>\n                        <div class="row" style="margin:0rem 0px 0rem;">\n                            <div class="col s4 center-align" v-if="prevWinners !== null" v-for="(x, index) in prevWinners"><span class="truncate">{{x.name}}</span></div>\n                        </div>\n                    </div>\n                </div>\n                <div class="row animated bounceInLeft" v-for="x in category" style="margin-bottom:0px;">\n                    <div class="col s12">\n                        <div class="card card-side z-depth-2" v-bind:style="{borderLeftColor: x.color}">\n                            <div class="card-content">\n                                <div class="btn btn-full btn-large btn-black waves-light waves-effect" \n                                     v-on:click="toggleModal(x)">\n                                    {{x.text}}\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ',
    mixins: [serviceProvider],
    data: function data() {
        return {
            message: 'Hello Vue!',
            show: false,
            contain: true,
            modalPage: { page: 'dash' }
        };
    },
    computed: {
        prevWinners: function prevWinners() {
            var x = this.$store.state.previousChamps;
            if (x !== null) this.loader = true;
            return x;
        }
    },
    created: function created() {
        var _this5 = this;

        if (this.isWindowBig === true) return router.push('/');
        if (this.$store.state.previousChamps === null) {
            axios('https://styleminions.co/api/puzzleoldchamps?today=' + this.currentGameDay + '&yesterday=' + this.previousGameDay).then(function (res) {
                var champs = res.data;
                if (champs.length === 3) {
                    _this5.$store.commit('previousChamps', champs);
                    _this5.loader = true;
                } else if (champs.length === 0) {
                    _this5.$store.commit('previousChamps', _this5.testProfile);
                    _this5.loader = true;
                } else {
                    var startIndex = champs.length;
                    for (var i = startIndex; i < 3; i++) {
                        champs.push({ name: '', profile_url: _this5.noProfileUrl });
                    }
                    _this5.$store.commit('previousChamps', champs);
                    _this5.loader = true;
                }
            });
        }
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
    template: '\n        <div class="background center-align">\n            <modal v-bind:modalData="modalData" v-bind:test="test" v-on:replay="retry" v-on:submitGame="submitGame" v-bind:modalPage="modalPage"\n                   v-bind:urlChallenge="challengeUrl"></modal>\n            <div style="background-color:white; width:100%;" >\n                <div class="progress animated fadeInDown" style="margin-top:0px;background-color:#dadcda;margin-bottom: 0px;">\n                    <div class="determinate" v-prog="prog" style="background:var(--main);"></div>\n                    <div style="position: absolute;left: 50%;top: 5%;" :class="{\'white-text\': prog >= 54}">{{prog | number}}%</div>\n                </div>\n                <div class="valign-wrapper" style="position:absolute;bottom:2%;right: 0;">\n                    <span class="" style="margin-right: 10px;" v-if="challenge !== null">\n                        <img :src="challenge.profile_url" v-imgfallback class="circle responsive-img animated infinite" style="width: 40px;height: 40px;"\n                        :class="{\'img-lead\':challengeTimer === 0,\'img-green bounceIn\':challengeTimer > 0 && challengeTimer < 80,\'img-orange flip\':challengeTimer >= 80 && challengeTimer < 100,\n                        \'img-red flash\': challengeTimer >= 100}">\n                    </span>\n                    <span class="btn btn-floating waves-effect waves-light" style="margin-right:10px;background:var(--main);" @click="retry"\n                          :disabled="loader">\n                        <i class="material-icons" style="font-size: 34px;">refresh</i>\n                    </span>\n                    <div class="chip">\n                        <img :src="profile.url" alt="Contact Person">\n                        {{profile.fullname | truncate}}\n                    </div>\n                </div>                \n                <spinner class="animated fadeIn" :colorClass="\'default\'" v-show="loader"></spinner>\n            </div>\n            <div id="svg" style="background-color:white; width:100%; height:80%;" >\n                <div class="btn list-me animated bounceIn" v-bind:class="{\'hide\': prog !== 100}">\n                        Completed!!  \n                        <span v-show="test.start_time !== null">\n                            <i class="fa fa-clock-o"></i> \n                            {{test.time_result[0]}}<span>m</span>:{{test.time_result[1]}}<span>s</span>\n                        </span>\n                </div>\n            </div>\n            \n            <canvas id="canvas"></canvas>\n        \n        </div>\n    ',
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
            modalPage: { page: 'game', insta: false, loader: false, fail: false, imageacquired: false },
            challengeSeconds: 0,
            challengeInterval: null
        };
    },
    computed: {
        challenge: function challenge() {
            return this.$store.state.challenge;
        },
        totalChallengeSeconds: function totalChallengeSeconds() {
            if (this.safe(this.challenge)) {
                var time = this.challenge.realtime.split(':');
                var seconds = Number(time[0]) * 60 + Number(time[1]);
                return seconds;
            }
            return null;
        },
        challengeTimer: function challengeTimer() {
            if (this.safe(this.challenge)) {
                return this.challengeSeconds / this.totalChallengeSeconds * 100;
            }
            return null;
        },
        challengeUrl: function challengeUrl() {
            var category = this.$route.params.category;
            var splitTime = this.test.time_result !== null ? this.test.time_result[0] + ' min ' + this.test.time_result[1] + ' sec' : '0';
            var playtime = this.test.timePlayed;
            var instahandle = 'instahandle' in localStorage ? localStorage.instahandle : '0';
            var message = 'I challenge you to beat my time of ' + splitTime + ' today on celebrity puzzle';
            var link = 'http://celebritypuzzle.com/#/challenge/' + instahandle + '/' + playtime + '/' + category;
            return encodeURIComponent(message + ' ' + link);
        }
    },
    mounted: function mounted() {
        if (this.isWindowBig === true) return router.push('/');

        if (this.$store.state.celebList !== null) {
            this.svgSpace = document.getElementById('svg');
            this.setUp(this.svgSpace.clientWidth, this.svgSpace.clientHeight);
        }
    },
    methods: {
        isStarted: function isStarted() {
            if (this.test.start_time === null) {
                this.test.start_time = moment();
                this.startChallenge();
            }
        },
        startChallenge: function startChallenge() {
            var _this6 = this;

            var store = this.challenge;
            if (this.safe(store)) {
                this.challengeInterval = setInterval(function () {
                    _this6.challengeSeconds += 1;
                    if (_this6.challengeSeconds === _this6.totalChallengeSeconds) {
                        clearInterval(_this6.challengeInterval);
                        console.log('time interval is cancelled');
                    }
                }, 1000);
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
                this.picColumn = 2;
                this.picRow = 2;
                this.puzzLevel += 1;
                this.setUp(this.svgSpace.clientWidth, this.svgSpace.clientHeight);
            } else {
                // game is finished and time to move on
                this.test.hideModal = false;
                this.updateBestTime();
                this.toggleModal();
                this.submitGame('regular');
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
            this.currentUrl = '', this.test = { end_time: null, start_time: null, time_result: '0:0', timePlayed: null, bestTime: null }, this.challengeSeconds = 0;
            if (this.challengeInterval !== null) clearInterval(this.challengeInterval);
            this.challengeInterval = null;
            this.setUp(this.svgSpace.clientWidth, this.svgSpace.clientHeight);
        },
        submitGame: function submitGame(inputProfile) {
            var _this7 = this;

            var timestamp = moment().toISOString();
            var playtime = this.test.timePlayed;
            var name = null;
            var picurl = null;
            var leaderboard = 0;
            var deviceId = this.deviceId;
            var category = this.$route.params.category;
            if (inputProfile === 'regular') {
                //this is for metric tracking the completion of a game without submitting to the leaderboard
                name = this.safe(localStorage.instahandle) ? localStorage.instahandle : 'noname';
                picurl = 'nourl';
            }
            if (inputProfile !== 'regular') {
                //submit to the leaderboard for sure
                name = inputProfile.replace('@', '').toLowerCase();
                picurl = this.url;
                leaderboard = 1;
                localStorage.instahandle = name;
            }
            var postData = { timestamp: timestamp, playtime: playtime, name: name, picurl: picurl, leaderboard: leaderboard, deviceId: deviceId };
            console.log(postData);
            axios.post('https://styleminions.co/api/puzzlesubmit?timestamp=' + timestamp + '&playtime=' + playtime + '&name=' + name + '&picurl=' + picurl + '\n            &leaderboard=' + leaderboard + '&deviceid=' + deviceId + '&category=' + category).then(function (response) {
                if (inputProfile !== 'regular') {
                    _this7.modalInstance.close();
                    router.push('/leaderboard');
                }
            }).catch(function (error) {
                console.error(new Error(error));
            });
        },
        isLevelCompleted: function isLevelCompleted() {
            var _this8 = this;

            if (this.correct.length === this.picBoxes) {
                if (this.test.start_time === null) {
                    //sometimes the randomness solves the puzzle on the first round which negatively impacts the gaming experience
                    this.toastInstance.dismiss();
                    console.log('it solved itself lol but i got it');
                    return this.retry();
                }
                this.output = 'Completed';
                this.test.time_result = this.gameTimePlayed(this).split(':');
                this.tones('f', 5, 500);
                this.vibrate(2000);
                setTimeout(function () {
                    _this8.levelUp();
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
            var _this9 = this;

            if (this.currentUrl !== '') {
                return new Promise(function (resolve, reject) {
                    resolve(_this9.currentUrl);
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
                        //this.getImage();
                        reject('there was an error retreiving data from instagram');
                    }
                }).then(function (data) {
                    if (_this9.safe(data)) {
                        var sift = JSON.parse(data.match(/window._sharedData = ({.+);/i)[1]);
                        var user = sift.entry_data.ProfilePage["0"].graphql.user;
                        var instaList = sift.entry_data.ProfilePage["0"].graphql.user.edge_owner_to_timeline_media.edges;
                        var imageList = instaList.filter(function (item) {
                            return item.node.is_video === false;
                        });
                        if (imageList.length < 1) {
                            _this9.getImage();
                        } else {
                            var index = Math.floor(Math.random() * imageList.length);
                            _this9.profile = { fullname: user.full_name, url: user.profile_pic_url };
                            resolve(imageList[index].node.display_url);
                        }
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
            var _this10 = this;

            this.loader = true;
            this.picBoxes = this.picColumn * this.picRow;
            this.footnote_hide = false;
            this.footnote = true;
            this.footnote_msg = this.puzzLevel < 2 ? 'Round ' + this.puzzLevel : 'Final Round';
            this.getImage().then(function (data) {
                _this10.currentUrl = data;
                return _this10.drawCanvas(w, h, data);
            }).catch(function (error) {
                console.error(new Error(error));
                _this10.setUp(w, h); //retry once there is a 404
            }).then(function (data) {
                //console.log('yeaaaaaaaaaah', this.basket);
                if (!_this10.safe(_this10.draw)) {
                    _this10.svg = document.getElementById('svg');
                    _this10.draw = SVG(_this10.svg).size(w, h);
                }

                //console.log(this.basket);
                var z = 0;
                _this10.basket.forEach(function (item) {
                    //let elem = this.draw.image(item.img,this.dw,this.dh);
                    var elem = _this10.draw.image(item.img, _this10.dw, Math.round(_this10.sh * _this10.dw / _this10.sw));
                    elem.x(_this10.shuffle[z].x);
                    elem.y(_this10.shuffle[z].y);
                    elem.truth = { x: item.x, y: item.y };
                    elem.attr('v-buzz', '');
                    function onTrigger() {
                        this.isStarted();
                        this.tones('e', 5, 10, null, 'sine');
                        this.vibrate(100);
                        if (elem.width() !== this.dw - this.dw * 0.3) {
                            //so we dont have multiple shrunken elements at once in the case where the user taps very quickly
                            //on different elements like a mad man :)
                            elem.animate(100).width(this.dw - this.dw * 0.3);
                        }
                        if (this.waste.length < 2 && !elem.fx.active) {
                            //check if the animation is active or else it could get called again while in transit
                            //which will throw it off the grid and thats a BIG PROBLEM for the user
                            this.waste.push(elem);
                        }
                        if (this.waste.length === 2 && this.waste[0].node.id !== this.waste[1].node.id) {
                            var a = { x: this.waste[0].node.x.baseVal.value,
                                y: this.waste[0].node.y.baseVal.value,
                                truth: this.waste[0].truth
                            };
                            var b = { x: this.waste[1].node.x.baseVal.value,
                                y: this.waste[1].node.y.baseVal.value,
                                truth: this.waste[1].truth
                            };
                            SVG.get(this.waste[0].node.id).animate(500).move(b.x, b.y).animate(100).width(this.dw);
                            SVG.get(this.waste[1].node.id).animate(500).move(a.x, a.y).animate(100).width(this.dw);
                            this.checker(a, b);
                            this.checker(b, a);
                            this.progressFunc();
                            this.waste = [];

                            //console.log(a,b)
                        } else if (this.waste.length === 2 && this.waste[0].node.id == this.waste[1].node.id) {
                            //this is the situation where the same box is touched
                            elem.animate(100).width(this.dw);
                            this.waste = [];
                        }
                    }
                    elem.touchstart(function () {
                        onTrigger.call(_this10);
                    });
                    if (_this10.isWindowBig === true) {
                        elem.click(function () {
                            onTrigger.call(_this10);
                        });
                    }

                    elem.loaded(function () {
                        //on initialization check if element is in the right position
                        var pos = { x: elem.node.x.baseVal.value,
                            y: elem.node.y.baseVal.value
                        };
                        if (pos.x === elem.truth.x && pos.y === elem.truth.y) {
                            _this10.correct.push(elem.truth.x + ':' + elem.truth.y);
                        }
                        _this10.progressFunc();
                        _this10.isLevelCompleted(); //sometimes the randomized data can be exactly solved on the first round
                    });

                    z++;
                    //elem.mouseout(()=>{elem.animate(100).width(50);});
                });
                _this10.loader = false;
                _this10.toastInstance = M.toast({ html: '<div class="center-align full-width">' + _this10.footnote_msg + '</div>', displayLength: 3000 });
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
            leaderboardList: [],
            todayChip: true
        };
    },
    methods: {
        makeHeart: function makeHeart() {
            var _this11 = this;

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
                var index = _this11.movingHearts.findIndex(function (i) {
                    return i.id === b;
                });
                _this11.movingHearts.splice(index, 1);
            }, c * 1200);
        },
        getLeaderboard: function getLeaderboard() {
            var _this12 = this;

            this.loader = true;
            var today = this.todayChip === true ? this.currentGameDay : this.currentGameMonth;
            axios.get('https://styleminions.co/api/puzzlechamps?today=' + today).then(function (res) {
                console.log(res);
                _this12.leaderboardList = res.data;
                _this12.loader = false;
            });
        },
        selectedTime: function selectedTime(time) {
            if (time === 'month' && this.todayChip === true) {
                this.todayChip = false;
                this.getLeaderboard();
            }
            if (time === 'today' && this.todayChip === false) {
                this.todayChip = true;
                this.getLeaderboard();
            }
        },
        scrollToMe: function scrollToMe() {
            var elem = document.querySelector('.myprofile');
            if (this.safe(elem)) {
                //console.log('wooooooooow')
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        },
        challengePlayer: function challengePlayer(playerdetails) {
            this.$store.commit('challenge', playerdetails);
            var category = playerdetails.category !== 'empty' ? playerdetails.category : 'movie';
            router.push('/game/' + category);
        }
    },
    created: function created() {
        if (this.isWindowBig === true) return router.push('/');
        this.getLeaderboard();
    },
    mounted: function mounted() {
        // setInterval(()=>{
        //     this.makeHeart();
        // },900)
    }
});

Vue.component('modal', {
    props: ['modalData', 'test', 'url', 'modalPage', 'urlChallenge'],
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
    template: '\n        <div style="position: relative;">\n            <img :src="url" alt="" class="circle responsive-img img-lead" v-imgfallback>\n            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3 animated tada infinite" v-if="index === 0"><i class="fa fa-trophy gold"></i></span>\n            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 1"><i class="fa fa-trophy silver"></i></span>\n            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 2"><i class="fa fa-trophy bronze"></i></span>\n            <span class="btn btn-small btn-floating lead-fab z-depth-3" v-if="index > 2">{{index + 1}}</span>\n        </div>\n    '
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
Vue.directive('imgfallback', {
    bind: function bind(el, binding, vnode) {
        //let fallback = 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png'
        var fallback = vnode.context.$parent.noProfileUrl;
        el.onerror = function () {
            if (el.src !== fallback) {
                el.src = fallback;
                console.log(vnode);
            }
        };
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
Vue.filter('truncate', function (value) {
    if (value && value.length > 20) {
        return value.slice(0, 20);
    }
    return value;
});

var store = new Vuex.Store({
    //state management in VUE
    state: {
        instaName: '',
        celebList: null,
        previousChamps: null,
        url: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
        challenge: null
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
        },
        previousChamps: function previousChamps(state, data) {
            state.previousChamps = data;
        },
        challenge: function challenge(state, data) {
            state.challenge = data;
        }
    }
});

var routes = [{ path: '/leaderboard', component: leaderboard }, { path: '/dash', component: container }, { path: '/game/:category', component: game }, { path: '/', component: landing }, { path: '/challenge/:insta/:time/:category', component: landing }, { path: '', redirect: '/' }];
var router = new VueRouter({
    routes: routes // short for `routes: routes`
});

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');