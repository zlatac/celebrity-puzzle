'use strict';

var serviceProvider = {
    data: function data() {
        return {
            modalInstance: null,
            modalData: {},
            inputProfile: '',
            loader: false,
            toastInstance: null,
            copiedToClipboard: false,
            challengeFriends: false,
            volume: true,
            noProfileUrl: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png'
        };
    },
    computed: {
        url: function url() {
            return this.$store.state.url;
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
    beforeCreate: function beforeCreate() {},
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
            if (this.volume === true) {
                tones.play(key, octave);
            }
        }),
        vibrate: function vibrate(seconds) {
            if ('vibrate' in navigator && this.volume === true) {
                navigator.vibrate(seconds);
            }
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
        generateDeviceId: function generateDeviceId(skipredirect) {
            var _this = this;

            //if skipredirect is not true redirect to dash page
            axios('/myipaddress').then(function (res) {
                var ip = res.data;
                var unixtime = moment().unix();
                var hash = generateHash(ip, unixtime);
                localStorage.deviceId = hash;
            }).catch(function (error) {
                console.warn(new Error(error));
            }).finally(function () {
                if (skipredirect !== true) {
                    _this.sendToCategory();
                    console.log('wow');
                }
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
        clearInterval: function (_clearInterval) {
            function clearInterval(_x6) {
                return _clearInterval.apply(this, arguments);
            }

            clearInterval.toString = function () {
                return _clearInterval.toString();
            };

            return clearInterval;
        }(function (intervalInstance) {
            if (this.safe(intervalInstance)) {
                clearInterval(intervalInstance);
            }
        }),
        webSocket: function webSocket() {
            if ('io' in window) {
                //var socket = io('https://mochanow.com');
                var socket = io();
                return socket;
            }
        }
    }
};
var landing = Vue.component('landing', {
    // template: `<div class="landing animated fadeIn" main="height: 100%;width: 100%;position: absolute;background:var(--main)">
    //                 <div class="center-align fwhite" style="font-family: 'Pacifico', cursive;">
    //                     <div style="font-size:45px;margin-top:15%">Celebrity Puzzle</div>
    //                     <div style="font-size:26px;margin-top:20px">align the stars</div>
    //                     <div class="btn btn-large red-text white tooltipped" style="margin-top:20px" v-if="isWindowBig" data-position="top" data-tooltip="Coming soon to desktops and laptops">
    //                         <i class="material-icons">stay_primary_portrait</i> Mobile phones only
    //                     </div>
    //                     <spinner class="animated fadeIn" style="margin-top:250px" :colorClass="'white'" v-if="!isWindowBig"></spinner>
    //                 </div>
    //            </div>`,
    template: '#landing',
    mixins: [serviceProvider],
    created: function created() {
        var _this2 = this;

        setTimeout(function () {
            _this2.$router.push('/request');
        }, 3000);
    }
});

var spotify = Vue.component('spotify', {
    template: '#spotify',
    mixins: [serviceProvider],
    data: function data() {
        return {
            searchInput: '',
            searchResult: [],
            isConnected: false,
            metrics: { requestNumber: 0 },
            appName: 'blessmyrequest',
            accessNumber: 0,
            pendingSearch: [],
            requestedSongs: {},
            noResult: false
        };
    },
    computed: {
        socket: function socket() {
            return this.webSocket();
        }
    },
    methods: {
        searchTrack: function searchTrack() {
            var _this3 = this;

            if (this.safe(this.searchInput)) {
                this.loader = true;
                // let token = 'BQCmVbA7pD8mZI9pCpUt5HcsO1Fb9nCRqlhcTAu52TpwCS4uxIi4BffjrENegBzfMjhMXHr_esCHR_R0O5M'
                var token = this.$store.state.accessToken;
                var query = encodeURIComponent(this.searchInput);
                var type = 'track';
                console.log(this.searchInput);

                fetch('https://api.spotify.com/v1/search?q=' + query + '&type=' + type + '&access_token=' + token).then(function (res) {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        return 'fail';
                    }
                }).catch(function (err) {
                    console.log(new Error(err));
                }).then(function (res) {
                    if (res !== 'fail') {
                        _this3.searchResult = res.tracks.items.map(function (item) {
                            var obj = {};
                            obj.image = item.album.images[1].url;
                            obj.song = item.name;
                            obj.artist = item.artists.map(function (item) {
                                return item.name;
                            }).join(', ');
                            obj.id = item.id;
                            return obj;
                        });
                        _this3.noResult = _this3.searchResult.length === 0 ? true : false;
                        _this3.pendingSearch = [];
                        _this3.loader = false;
                        _this3.scrollToResultTop();
                        //this.searchInput = ''
                    } else if (res === 'fail') {
                        _this3.pendingSearch.push(_this3.searchInput);
                        _this3.socket.emit('newTokenPlease');
                    }
                });
            }
        },
        scrollToResultTop: function scrollToResultTop() {
            var elem = document.querySelector('.firstresult');
            if (this.safe(elem)) {
                elem.scrollIntoView(false); //false aligns the bottom of the element to the bottom of available space and vice versa
            }
        },
        sendRequest: function sendRequest(payload) {
            if (this.safe(payload)) {
                payload.timestamp = moment().toISOString();
                console.log(payload);
                this.socket.emit('audience', { appName: this.appName, id: this.socket.id, task: 'request', song: payload });
                this.requestedSongs[payload.id] = true;
            }
        },
        goToDjView: function goToDjView() {
            this.accessNumber++;
            if (this.accessNumber === 4) {
                this.$router.push('/dj');
            }
        }
    },
    created: function created() {
        var _this4 = this;

        this.socket.on('connect', function (data) {
            _this4.isConnected = true;
            _this4.socket.emit('audience', { appName: _this4.appName, id: _this4.socket.id, task: 'population' });
            console.log(data, 'connected my nigga');
        });
        //this.socket.emit('join','we in this bitch son');
        this.socket.on('sendMetrics', function (data) {
            //console.log(data,'metric data');
            if (data.appName === _this4.appName && 'task' in data && data.task === 'request') {
                _this4.metrics = data;
                //this.showMetrics = true;
            }
        });
        this.socket.on('newToken', function (data) {
            _this4.$store.commit('accessToken', data);
            if (_this4.pendingSearch.length > 0) {
                _this4.searchTrack();
            }
        });
    },
    destroyed: function destroyed() {
        //console.log('damn son am out')
        this.socket.close();
    }
});

var djSpotify = Vue.component('djSpotify', {
    template: '#djspotify',
    mixins: [serviceProvider],
    data: function data() {
        return {
            requestBasket: [],
            population: [],
            pendingTrackDetails: [],
            isConnected: false,
            appName: 'blessmyrequest',
            musicNotes: ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B']
        };
    },
    computed: {
        controlSocket: function controlSocket() {
            return this.webSocket();
        },
        requestList: function requestList() {
            if (this.requestBasket.length > 0) {
                return this.requestBasket.filter(function (item) {
                    return item.hide !== true;
                }).sort(function (a, b) {
                    //requestCount takes primary precident in sort followed by timestamp
                    //1 (makes b a lower index than a) -1(makes b a higher index than a)
                    if (b.requestCount > a.requestCount) {
                        return 1;
                    }
                    if (b.requestCount < a.requestCount) {
                        return -1;
                    }
                    if (b.requestCount === a.requestCount && b.timestamp > a.timestamp) {
                        return 1;
                    }
                    if (b.requestCount === a.requestCount && b.timestamp < a.timestamp) {
                        return -1;
                    }
                });
            } else {
                return this.requestBasket;
            }
        }
    },
    methods: {
        hideRequest: function hideRequest(payload) {
            if (this.safe(payload)) {
                var checkIdExist = this.requestBasket.findIndex(function (item) {
                    return item.id === payload.id;
                });
                if (checkIdExist !== -1) {
                    this.requestBasket[checkIdExist].hide = true;
                }
            }
        },
        getTrackBpm: function getTrackBpm(trackObject) {
            var _this5 = this;

            var id = trackObject.id;
            var token = this.$store.state.accessToken;
            fetch('https://api.spotify.com/v1/audio-features/' + id + '?access_token=' + token).then(function (res) {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return 'fail';
                }
            }).catch(function (err) {
                console.log(new Error(err));
            }).then(function (res) {
                if (res !== 'fail') {
                    var musicKey = _this5.musicNotes[res.key];
                    var bpm = Math.floor(Number(res.tempo));
                    var output = musicKey + ' - ' + bpm + ' bpm';
                    var indexInBasket = _this5.requestBasket.findIndex(function (item) {
                        return item.id === id;
                    });
                    _this5.requestBasket[indexInBasket].bpm = output;
                } else if (res === 'fail') {
                    _this5.pendingTrackDetails.push(trackObject);
                    _this5.controlSocket.emit('newTokenPlease');
                }
            });
        }
    },
    created: function created() {
        var _this6 = this;

        this.controlSocket.on('answer', function (data) {
            if (data.appName === _this6.appName) {
                if ('task' in data && data.task === 'population') {
                    console.log('population gwoth complete', data);
                    _this6.population.push(data);
                }
                if ('task' in data && data.task === 'request') {
                    console.log('request added bruh', data);
                    var checkIdExist = _this6.requestBasket.findIndex(function (item) {
                        return item.id === data.song.id;
                    });
                    console.log(checkIdExist);
                    if (checkIdExist === -1) {
                        data.song.requestCount = 1;
                        data.song.hide = false;
                        data.song.bpm = '';
                        _this6.requestBasket.push(data.song);
                        _this6.getTrackBpm(data.song);
                    } else {
                        _this6.requestBasket[checkIdExist].requestCount += 1;
                    }
                    _this6.controlSocket.emit('analytics', { appName: _this6.appName, requestNumber: _this6.requestList.length, task: 'request' });
                }
            }
        });
        this.controlSocket.on('newToken', function (data) {
            _this6.$store.commit('accessToken', data);
            if (_this6.pendingTrackDetails.length > 0) {
                var tracks = _this6.pendingTrackDetails;
                _this6.pendingTrackDetails = [];
                tracks.forEach(function (item) {
                    _this6.getTrackBpm(item);
                });
            }
        });
    }
});

Vue.component('modal', {
    props: ['modalData', 'test', 'url', 'modalPage', 'urlChallenge', 'challenger'],
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
                //console.log(vnode)
            }
        };
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
        url: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
        accessToken: null
    },
    mutations: {
        url: function url(state, data) {
            state.url = data;
        },
        accessToken: function accessToken(state, data) {
            state.accessToken = data;
        }
    }
});

var routes = [{ path: '/request', component: spotify }, { path: '/dj', component: djSpotify }, { path: '/', component: landing }, { path: '*', redirect: '/' }];
var router = new VueRouter({
    routes: routes // short for `routes: routes`
});

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');