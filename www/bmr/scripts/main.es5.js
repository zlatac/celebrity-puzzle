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
            noProfileUrl: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
            isConnected: false,
            adsenseServed: false
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
        modalAdsense: function modalAdsense() {
            if (this.adsenseServed === false) {
                //No need to call for the same ad unit 
                this.adsenseServed = true;
                setTimeout(function () {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }, 100);
            } else {
                console.log('Ad served already');
            }
        },
        inputHighlight: function inputHighlight() {
            var input = document.querySelector('#search');
            input.focus();
            input.setSelectionRange(0, 9999);
        },
        webSocket: function webSocket() {
            if ('io' in window) {
                //var socket = io('https://mochanow.com');
                var socket = io();
                return socket;
            }
        },
        trackAction: function trackAction(dataObject) {
            var payload = JSON.stringify(dataObject);
            axios.post('https://styleminions.co/api/blessmyrequest?payload=' + payload);
        },
        locationPerimeter: function locationPerimeter(latitude, longitude, distance) {
            //average human walks 5km/hr => therefore walking 2km in 24 minutes
            //this function returns the pointA and pointD of the perimeter around the users location
            if (distance === undefined) distance = 0.05; //default distance in km tested with google map(50 metres)
            var latitudeInMinutes = latitude * 60; // 1 degree = 60 minutes
            var longitudeInMinutes = longitude * 60;
            var distanceInMinutes = distance * 60 / 60; //using 60km/hr
            var pointA = {};
            var pointD = {};
            function minutesToDegrees(minutes) {
                return minutes / 60;
            }
            pointA.latitude = minutesToDegrees(latitudeInMinutes + distanceInMinutes);
            pointA.longitude = minutesToDegrees(longitudeInMinutes - distanceInMinutes);
            pointD.latitude = minutesToDegrees(latitudeInMinutes - distanceInMinutes);
            pointD.longitude = minutesToDegrees(longitudeInMinutes + distanceInMinutes);

            return { pointA: pointA, pointD: pointD };

            function filterClubs() {
                clubsArray.filter(function (item) {
                    return item.long < mylocation.pointD.longitude && item.long > mylocation.pointA.longitude && item.lat < mylocation.pointA.latitude && item.lat > mylocation.pointD.latitude;
                }).map(function (item) {
                    item.distance = distanceFromDj();return item;
                }).sort(function (a, b) {
                    if (a.distance < b.distance) return -1;if (a.distance > b.distance) return 1;
                });
                //below is to sort by closest location to the user
                function distanceFromDj(lat1, lon1, lat2, lon2) {
                    //code calculation source https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
                    var p = 0.017453292519943295; // Math.PI / 180
                    var c = Math.cos;
                    var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

                    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
                }
            }
        }
    }
};
var landing = Vue.component('landing', {
    // dark theme: #101010
    // dark blue: #070b19
    // dark experiment:#252525
    template: '#landing',
    mixins: [serviceProvider],
    created: function created() {
        var _this2 = this;

        setTimeout(function () {
            _this2.$router.push('/home');
        }, 3000);
    }
});

var home = Vue.component('home', {
    template: '\n        <div>\n        <h4 class="center-align white-text" style="margin-bottom:40px;">Select Your Club</h4>\n            <div class="card dark-card animated fadeInUp" v-for="(x, index) in clubs">\n                <div class="row">\n                    <div class="col s4">\n                        <div style="position: relative;">\n                            <img class="circle" :src="x.image" width="70px">\n                        </div>\n                    </div>\n                    <div class="col s5">\n                        {{x.name}}\n                        <p class="grey-text p-space">{{x.location}}</p>\n                        \n                    </div>\n                    <div class="col s3">\n                        <span class="btn btn-floating waves-effect waves-light" @click="joinRoom(x)"">\n                            <i class="material-icons">send</i>\n                        </span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ',
    mixins: [serviceProvider],
    computed: {
        clubs: function clubs() {
            return this.$store.state.clubs;
        }
    },
    methods: {
        joinRoom: function joinRoom(id) {
            this.$router.push('/request/' + id.id);
        }
    }
});

var spotify = Vue.component('spotify', {
    template: '#spotify',
    mixins: [serviceProvider],
    data: function data() {
        return {
            searchInput: '',
            searchResult: [],
            metrics: { requestNumber: 0 },
            accessNumber: 0,
            pendingSearch: [],
            requestedSongs: [],
            noResult: false
        };
    },
    computed: {
        socket: function socket() {
            return this.webSocket();
        },
        appName: function appName() {
            return String(this.$route.params.id);
        },
        club: function club() {
            return this.$store.state.clubs[this.appName];
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
                }).finally(function (res) {
                    var payload = { trackTask: 'search', search: _this3.searchInput, timestamp: moment().toISOString(), domain: location.host };
                    _this3.trackAction(payload);
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
            if (this.safe(payload) && this.isConnected === true) {
                payload.timestamp = moment().toISOString();
                console.log(payload);
                this.socket.emit('audience', { appName: this.appName, id: this.socket.id, task: 'request', song: payload });
                this.requestedSongs.push(payload.id);
                payload.trackTask = 'request';
                payload.domain = location.host;
                this.trackAction(payload);
            }
        },
        goToDjView: function goToDjView() {
            this.accessNumber++;
            if (this.accessNumber === 4) {
                this.$router.push('/dj/' + this.appName);
            }
        },
        alreadyRequested: function alreadyRequested(payload) {
            if (this.requestedSongs.findIndex(function (item) {
                return item === payload;
            }) !== -1) {
                return true;
            }
            return false;
        }
    },
    created: function created() {
        var _this4 = this;

        this.socket.on('connect', function (data) {
            _this4.isConnected = true;
            _this4.socket.emit('audience', { appName: _this4.appName, id: _this4.socket.id, task: 'population' });
            console.log(data, 'connected my nigga');
        });
        this.socket.on('disconnect', function (data) {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            _this4.isConnected = false;
        });
        this.socket.on('reconnect', function (data) {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            _this4.isConnected = true;
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
        this.socket.on('room', function (data) {
            console.log(data);
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
        },
        club: function club() {
            return this.$store.state.clubs[this.appName];
        },
        appName: function appName() {
            return String(this.$route.params.id);
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

        this.controlSocket.on('connect', function (data) {
            _this6.isConnected = true;
            console.log('connected my nigga');
        });
        this.controlSocket.on('disconnect', function (data) {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            _this6.isConnected = false;
        });
        this.controlSocket.on('answer', function (data) {
            console.log(data);
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
                if ('task' in data && data.task === 'pendingRequests') {
                    //pending requests from server will include requests already received before disconnection
                    //take only the requests we dont have in the requestBasket to avoid double counting of requests
                    var addUp = function addUp(accumulator, currentValue) {
                        return accumulator + currentValue;
                    };
                    var totalRequestsReceived = 0; //default
                    if (_this6.requestBasket.length > 0) {
                        totalRequestsReceived = _this6.requestBasket.map(function (item) {
                            return item.requestCount;
                        }).reduce(addUp);
                    }

                    var onlyNewPendingRequests = data.pendingRequests.slice(totalRequestsReceived);
                    onlyNewPendingRequests.forEach(function (request) {
                        var checkIdExist = _this6.requestBasket.findIndex(function (item) {
                            return item.id === request.song.id;
                        });
                        console.log(checkIdExist);
                        if (checkIdExist === -1) {
                            request.song.requestCount = 1;
                            request.song.hide = false;
                            request.song.bpm = '';
                            _this6.requestBasket.push(request.song);
                            _this6.getTrackBpm(request.song);
                        } else {
                            _this6.requestBasket[checkIdExist].requestCount += 1;
                        }
                    });
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
        this.controlSocket.on('reconnect', function (data) {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            _this6.isConnected = true;
            _this6.controlSocket.emit('updateRequests');
        });
    },
    destroyed: function destroyed() {
        //console.log('damn son am out')
        this.controlSocket.close();
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
Vue.directive('inputHighlight', {
    bind: function bind(el, binding) {
        el.onfocus = function () {
            if (el.value !== '') {
                el.setSelectionRange(0, 9999);
            }
            //console.log('i am focused')
        };
        el.onkeyup = function (event) {
            if (event.keyCode === 13) {
                //code for submit 
                el.blur();
            }
            //console.log('am submitted',event) 
        };
    }
});
Vue.component('adsense', {
    template: '\n    <div>\n        <!-- footer ad  data-adtest="on"-->\n        <ins class="adsbygoogle center-block"\n            style="display:block"\n            data-ad-client="ca-pub-8868040855394757"\n            data-ad-slot="1741308624"></ins>\n    </div>\n    ',
    mixins: [serviceProvider],
    mounted: function mounted() {
        this.modalAdsense();
    }
});
Vue.directive('imgfallback', {
    bind: function bind(el, binding, vnode) {
        var fallback = 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png';
        //let fallback = vnode.context.$parent.noProfileUrl
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
        accessToken: null,
        clubs: {
            "222": {
                name: 'Dstrct Lounge',
                image: 'https://scontent-yyz1-1.cdninstagram.com/vp/f4b55339abe6e23a49ec3b745bb6a344/5BBBFA95/t51.2885-19/10005336_738724742906786_974893778_a.jpg',
                location: 'Guelph',
                id: 222
            },
            "444": {
                name: 'Lavo Ultra Lounge',
                image: 'https://instagram.fyto1-1.fna.fbcdn.net/vp/041688062a716ba91f9b7ad1ff8a17bc/5C280F78/t51.2885-19/s150x150/30604238_192226541572010_7830072766152835072_n.jpg',
                location: 'Nashville',
                id: 444
            }

        }
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

var routes = [{ path: '/request/:id', component: spotify }, { path: '/dj/:id', component: djSpotify }, { path: '/', component: landing }, { path: '/home', component: home }, { path: '*', redirect: '/' }];
var router = new VueRouter({
    routes: routes // short for `routes: routes`
});

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');