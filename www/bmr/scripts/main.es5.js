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
            adsenseServed: false,
            holdEvent: false,
            logo: "https://drive.google.com/uc?id=1ctizeSjjAuaEKuOWPgIjau7A5LNcMA7Q",
            baseUrl: 'https://styleminions.co/api'
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
        },
        isLocalhost: function isLocalhost() {
            return location.href.includes(':8000') || location.href.includes('localhost');
        }
    },
    mounted: function mounted() {
        var modal = document.querySelector('.modal');
        var tooltip = document.querySelector('.tooltipped');
        var modalOptions = {};
        //if (this.$route.path.includes('game')) modalOptions.dismissible = false
        if (modal) this.modalInstance = M.Modal.init(modal, modalOptions);
        if (tooltip) M.Tooltip.init(tooltip);
    },
    destroy: function destroy() {
        this.modalInstance.destroy();
    },
    created: function created() {
        this.validateClubListState();
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
        vibrate: function vibrate(seconds) {
            if ('vibrate' in navigator && this.volume === true) {
                navigator.vibrate(seconds);
            }
        },
        toggleModal: function toggleModal(modalData) {
            this.modalData = modalData;
            this.modalInstance.open();
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
            function clearInterval(_x) {
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
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (error) {
                        console.warn(new Error(error));
                    }
                }, 100);
            } else {
                console.log('Ad served already');
            }
        },
        closeModal: function closeModal() {
            this.modalInstance.close();
        },

        getProfile: function getProfile() {
            var _this2 = this;

            this.modalPage.imageacquired = false; // remove submit button while typing
            this.modalPage.verified = this.modalPage.unverified = false;
            this.modalPage.showButton = true;
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

            if (this.$route.path.includes('request')) {
                return this.getVipStatus(profile);
            }
            this.modalPage.loader = true;
            if (profile === '') return this.modalPage.fail = true;
            axios.get('/profile', {
                params: {
                    insta: profile
                }
            }).then(function (res) {
                if (res.status === 200) {
                    var sift = res.data.match(/og:image.+(http.+)"/i)[1];
                    _this3.$store.commit('url', sift);
                    _this3.modalPage.fail = false;
                    _this3.modalPage.loader = false;
                    _this3.modalPage.imageacquired = true;
                }
            }).catch(function (error) {
                _this3.modalPage.fail = true;
            });
            //this.url = profile;
        },
        getVipStatus: function getVipStatus(profile) {
            var _this4 = this;

            var club_id = this.modalPage.brand.id || this.$store.state.vipMode.club;
            var date = moment().toISOString();
            this.modalPage.showButton = false;
            this.modalPage.loader = true;
            if (profile === '') return this.modalPage.fail = true;
            var promises = [];
            promises.push(axios.get('/profile', { params: { insta: profile } }));
            promises.push(axios.get(this.baseUrl + '/bmr-vip/' + club_id + '/' + profile + '/' + date));
            return Promise.all(promises).then(function (res) {
                var instagram = res[0];
                var verifyApi = res[1];
                if (instagram.status === 200) {
                    var sift = instagram.data.match(/og:image.+(http.+)"/i)[1];
                    _this4.$store.commit('url', sift);
                    _this4.modalPage.fail = false;
                    _this4.modalPage.imageacquired = true;
                } else {
                    _this4.modalPage.fail = true;
                }
                if (verifyApi.status === 200) {
                    verifyApi.data[0].insta = profile;
                    verifyApi.data[0].club = club_id;
                    _this4.$store.commit('vipMode', verifyApi.data[0]);
                    _this4.modalPage.verified = true;
                } else {
                    _this4.modalPage.unverified = true;
                    _this4.$store.commit('resetVipMode');
                }
            }).finally(function () {
                _this4.modalPage.loader = false;
            });
        },
        validateId: function validateId() {
            var _this5 = this;

            var club = this.$store.state.clubs.findIndex(function (item) {
                return String(item.id) === _this5.appName;
            });
            if (club === -1) {
                this.$router.push('/home');
            }
        },
        validateClubListState: function validateClubListState() {
            var landingRoute = this.$route.name === '/';
            if (this.$store.state.clubs.length === 0 && !landingRoute) {
                this.$router.push('/');
            }
        },
        getClubData: function getClubData() {
            var _this6 = this;

            return this.$store.state.clubs.find(function (item) {
                return String(item.id) === _this6.appName;
            });
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
            dataObject.clubId = this.appName;
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
        var _this7 = this;

        fetch('https://styleminions.co/api/bmrclients').then(function (res) {
            if (res.status === 200) {
                return res.json();
            } else {
                return 'fail';
            }
        }).catch(function (err) {
            console.log(new Error(err));
        }).then(function (res) {
            if (res !== 'fail') {
                _this7.$store.commit('clubs', res);
                setTimeout(function () {
                    _this7.$router.push('/home');
                }, 2000);
            } else if (res === 'fail') {}
        });
    }
});

var home = Vue.component('home', {
    template: '\n        <div style="margin-bottom: 65px;">\n            <h4 class="center-align white-text" style="margin-bottom:40px;" v-show="!showSearch">\n                Select Your Club\n            </h4>\n            <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4"\n                 @click="toggleSearch" v-show="!isSearchFocused">\n                <i class="fa fa-search" style="font-size:32px;color:white;margin-top:2px;" v-show="!showSearch"></i>\n                <i class="far fa-times-circle" style="font-size:40px;color:white;margin-top:2px;" v-show="showSearch"></i>\n            </div>\n            <div class="row animated fadeIn" style="margin-bottom:30px;background-color:white;border-radius:22px;width: 90%;\n                    margin-top:20px;" v-show="showSearch">\n                <form  novalidate @submit.stop.prevent="searchClub">\n                    <div class="col s12">\n                        <input type="text" name="q" placeholder="Search club, lounge, radio..." @keypress="inputSearch = $event.target.value" \n                               @input="inputSearch = $event.target.value" v-inputHighlight="showSearch" autocomplete="off">\n                    </div>\n                </form>\n            </div>\n            <div class="card dark-card animated fadeInUp" v-show="clubs.length === 0">\n                <div class="row">\n                    <div class="col s12 center">\n                        <p><b>Sorry!! Can\'t find "{{inputSearch}}".</b></p>\n                    </div>\n                </div>\n            </div>\n            <div class="card dark-card animated fadeInUp" v-for="(x, index) in clubs">\n                <div class="row">\n                    <div class="col s4">\n                        <div style="position: relative;" @touchstart="goToAdmin(x,$event)" @touchend="holdEvent = false"\n                             @mousedown="goToAdmin(x,$event)" @mouseup="holdEvent = false">\n                            <img class="circle" :src="x.image" width="70px" style="z-index: -1;">\n                            <div style="position:absolute; width:100%; height:100%; top:0"></div>\n                        </div>\n                    </div>\n                    <div class="col s5" style="text-transform:capitalize;">\n                        {{x.name}}\n                        <p class="grey-text p-space">{{x.city}}</p>\n                        \n                    </div>\n                    <div class="col s3">\n                        <span class="btn btn-floating waves-effect waves-light" @click="joinRoom(x)">\n                            <i class="material-icons">send</i>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <modal :modalPage="modalPage" :modalData="modalData" @submit="addVip" @close="closeModal">\n                <h5 style="text-align: center;margin-bottom: 30px">\n                    {{modalPage.brand.name}}\n                </h5>\n            </modal>\n        </div>\n    ',
    mixins: [serviceProvider],
    data: function data() {
        return {
            showSearch: false,
            isSearchFocused: false,
            inputSearch: '',
            modalPage: {
                page: 'home',
                insta: false,
                fail: false,
                imageAcquired: false,
                loader: false,
                brand: {},
                verified: false,
                unverified: false,
                showButton: true
            }
        };
    },
    computed: {
        clubs: function clubs() {
            var _this8 = this;

            if (this.safe(this.inputSearch)) {
                if (this.inputSearch.toLowerCase() === 'bmr report') {
                    this.$router.push('/report');
                    return;
                }
                return this.$store.state.clubs.filter(function (item) {
                    var search = _this8.inputSearch.toLowerCase();
                    return item.name.toLowerCase().includes(search) || item.city.toLowerCase().includes(search);
                });
            }
            return this.$store.state.clubs;
        }
    },
    methods: {
        joinRoom: function joinRoom(id) {
            this.$router.push('/request/' + id.id);
        },
        resetInput: function resetInput() {
            this.inputSearch = '';
        },
        toggleSearch: function toggleSearch() {
            switch (this.showSearch) {
                case true:
                    this.showSearch = false;
                    this.resetInput();
                    break;
                case false:
                    this.showSearch = true;
                    break;
                default:
                    this.showSearch = false;
                    break;
            }
        },
        goToAdmin: function goToAdmin(brand, event) {
            var _this9 = this;

            event.preventDefault();
            this.holdEvent = true;
            setTimeout(function () {
                if (_this9.holdEvent) {
                    _this9.holdEvent = false;
                    _this9.modalPage.insta = true;
                    _this9.modalPage.spotify = true;
                    _this9.modalPage.brand = brand;
                    _this9.modalInstance.open();
                }
            }, 2000);
        },
        addVip: function addVip(insta) {
            var _this10 = this;

            this.modalPage.loader = true;
            var club_id = this.modalPage.brand.id;
            var date = moment().toISOString();
            var expiry_date = moment().add(10, 'h').toISOString();
            var limit = 3;
            axios.get(this.baseUrl + '/bmr-vip/' + club_id + '/' + insta + '/' + date).then(function (res) {
                if (res.status === 204) {
                    return axios.post(_this10.baseUrl + '/bmr-vip/' + club_id + '/' + insta + '/' + expiry_date + '/' + limit);
                } else {
                    _this10.modalPage.unverified = true;
                    _this10.modalPage.showButton = false;
                    return { status: 0 };
                }
            }).then(function (res) {
                if (res.status === 201) {
                    _this10.modalPage.verified = true;
                    _this10.modalPage.showButton = false;
                }
            }).finally(function () {
                _this10.modalPage.loader = false;
            });
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
            noResult: false,
            modalPage: {
                page: 'spotify',
                insta: false,
                fail: false,
                imageAcquired: false,
                loader: false,
                verified: false,
                unverified: false,
                showButton: false,
                brand: {},
                appName: this.appName
            }
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
            return this.getClubData();
        },
        vipMode: function vipMode() {
            return this.$store.state.vipMode;
        },
        isVip: function isVip() {
            return this.vipMode.limit > 0 && this.vipMode.club === this.appName;
        }
    },
    methods: {
        searchTrack: function searchTrack() {
            var _this11 = this;

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
                        _this11.searchResult = res.tracks.items.map(function (item) {
                            var obj = {};
                            obj.image = item.album.images[1].url;
                            obj.song = item.name;
                            obj.artist = item.artists.map(function (item) {
                                return item.name;
                            }).join(', ');
                            obj.id = item.id;
                            return obj;
                        });
                        _this11.noResult = _this11.searchResult.length === 0 ? true : false;
                        _this11.pendingSearch = [];
                        _this11.loader = false;
                        _this11.scrollToResultTop();
                        //this.searchInput = ''
                    } else if (res === 'fail') {
                        _this11.pendingSearch.push(_this11.searchInput);
                        _this11.socket.emit('newTokenPlease');
                    }
                }).finally(function (res) {
                    var payload = { trackTask: 'search', search: _this11.searchInput, timestamp: moment().toISOString(), domain: location.host };
                    _this11.trackAction(payload);
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
                this.socket.emit('audience', {
                    appName: this.appName,
                    id: this.socket.id,
                    task: 'request',
                    song: payload,
                    vip: this.vipMode
                });
                this.requestedSongs.push(payload.id);
                payload.trackTask = 'request';
                payload.domain = location.host;
                this.trackAction(payload);
            }
        },
        vipSendRequest: function vipSendRequest(payload) {
            var _this12 = this;

            if (!this.safe(payload.inProgress)) {
                payload.inProgress = true;
                this.getVipStatus(this.vipMode.insta).then(function () {
                    if (_this12.isVip) {
                        _this12.sendRequest(payload);
                    } else {
                        console.log('you are no longer a vip');
                    }
                }).then(function () {
                    payload.inProgress = false;
                });
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
        },
        enterVip: function enterVip() {
            this.modalPage.insta = true;
            this.modalPage.spotify = true;
            this.modalPage.brand = this.club;
            this.modalPage.appName = this.appName;
            this.modalInstance.open();
        },
        appColorScheme: function appColorScheme(vip) {
            var doc = document.documentElement;
            var normal = 'linear-gradient(120deg, #92fe9d 0%, #00c9ff 107%)';
            var gold = 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8a6e2f 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #ffffac 8%, #d1b464 25%, #5d4a1f 62.5%, #5d4a1f 100%)';
            var change = vip ? gold : normal;
            doc.style.setProperty('--main', change);
            console.log('fired', change);
        }
    },
    watch: {
        isVip: function isVip(newValue, oldValue) {
            this.appColorScheme(newValue);
            console.log('fired first', newValue);
        }
    },
    created: function created() {
        var _this13 = this;

        this.validateId();
        if (this.isVip) this.getVipStatus(this.vipMode.insta);
        this.socket.on('connect', function (data) {
            _this13.isConnected = true;
            _this13.socket.emit('audience', { appName: _this13.appName, id: _this13.socket.id, task: 'population' });
            console.log(data, 'connected my nigga');
        });
        this.socket.on('disconnect', function (data) {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            _this13.isConnected = false;
        });
        this.socket.on('reconnect', function (data) {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            _this13.isConnected = true;
        });
        //this.socket.emit('join','we in this bitch son');
        this.socket.on('sendMetrics', function (data) {
            //console.log(data,'metric data');
            if (data.appName === _this13.appName && 'task' in data && data.task === 'request') {
                _this13.metrics = data;
                //this.showMetrics = true;
            }
        });
        this.socket.on('newToken', function (data) {
            _this13.$store.commit('accessToken', data);
            if (_this13.pendingSearch.length > 0) {
                _this13.searchTrack();
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
            return this.getClubData();
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
                    var requestedSong = this.requestBasket[checkIdExist];
                    requestedSong.hide = true;
                    this.reduceVipLimit(requestedSong);
                }
            }
        },
        reduceVipLimit: function reduceVipLimit(requestedSong) {
            if (requestedSong.vipList.size > 0 && requestedSong.playedVip === true) {
                var promises = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = requestedSong.vipList.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var vip = _step.value;

                        promises.push(axios.post(this.baseUrl + '/bmr-vip-limit/' + vip.club + '/' + vip.uuid));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                Promise.all(promises);
            }
        },
        getTrackBpm: function getTrackBpm(trackObject) {
            var _this14 = this;

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
                    var musicKey = _this14.musicNotes[res.key];
                    var bpm = Math.floor(Number(res.tempo));
                    var output = musicKey + ' - ' + bpm + ' bpm';
                    var indexInBasket = _this14.requestBasket.findIndex(function (item) {
                        return item.id === id;
                    });
                    _this14.requestBasket[indexInBasket].bpm = output;
                } else if (res === 'fail') {
                    _this14.pendingTrackDetails.push(trackObject);
                    _this14.controlSocket.emit('newTokenPlease');
                }
            });
        }
    },
    created: function created() {
        var _this15 = this;

        this.validateId();
        this.controlSocket.on('connect', function (data) {
            _this15.isConnected = true;
            console.log('connected my nigga');
        });
        this.controlSocket.on('disconnect', function (data) {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            _this15.isConnected = false;
        });
        this.controlSocket.on('answer', function (data) {
            console.log(data);
            if (data.appName === _this15.appName) {
                if ('task' in data && data.task === 'population') {
                    console.log('population gwoth complete', data);
                    _this15.population.push(data);
                }
                if ('task' in data && data.task === 'request') {
                    console.log('request added bruh', data);
                    var checkIdExist = _this15.requestBasket.findIndex(function (item) {
                        return item.id === data.song.id;
                    });
                    console.log(checkIdExist);
                    if (checkIdExist === -1) {
                        data.song.vipList = new Map();
                        data.song.requestCount = 1;
                        data.song.hide = false;
                        data.song.bpm = '';
                        if (data.vip.limit > 0) data.song.vipList.set(data.vip.insta, data.vip);
                        data.song.showVip = false;
                        _this15.requestBasket.push(data.song);
                        _this15.getTrackBpm(data.song);
                    } else {
                        var requestedSong = _this15.requestBasket[checkIdExist];
                        requestedSong.requestCount += 1;
                        if (data.vip.limit > 0) requestedSong.vipList.set(data.vip.insta, data.vip);
                    }
                    _this15.controlSocket.emit('analytics', { appName: _this15.appName, requestNumber: _this15.requestList.length, task: 'request' });
                }
                if ('task' in data && data.task === 'pendingRequests') {
                    //pending requests from server will include requests already received before disconnection
                    //take only the requests we dont have in the requestBasket to avoid double counting of requests
                    var addUp = function addUp(accumulator, currentValue) {
                        return accumulator + currentValue;
                    };
                    var totalRequestsReceived = 0; //default
                    if (_this15.requestBasket.length > 0) {
                        totalRequestsReceived = _this15.requestBasket.map(function (item) {
                            return item.requestCount;
                        }).reduce(addUp);
                    }

                    var onlyNewPendingRequests = data.pendingRequests.slice(totalRequestsReceived);
                    onlyNewPendingRequests.forEach(function (request) {
                        var checkIdExist = _this15.requestBasket.findIndex(function (item) {
                            return item.id === request.song.id;
                        });
                        console.log(checkIdExist);
                        if (checkIdExist === -1) {
                            request.song.requestCount = 1;
                            request.song.hide = false;
                            request.song.bpm = '';
                            _this15.requestBasket.push(request.song);
                            _this15.getTrackBpm(request.song);
                        } else {
                            _this15.requestBasket[checkIdExist].requestCount += 1;
                        }
                    });
                }
            }
        });
        this.controlSocket.on('newToken', function (data) {
            _this15.$store.commit('accessToken', data);
            if (_this15.pendingTrackDetails.length > 0) {
                var tracks = _this15.pendingTrackDetails;
                _this15.pendingTrackDetails = [];
                tracks.forEach(function (item) {
                    _this15.getTrackBpm(item);
                });
            }
        });
        this.controlSocket.on('reconnect', function (data) {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            _this15.isConnected = true;
            _this15.controlSocket.emit('updateRequests');
        });
    },
    destroyed: function destroyed() {
        //console.log('damn son am out')
        this.controlSocket.close();
    }
});

var report = Vue.component('report', {
    template: '#report',
    mixins: [serviceProvider],
    data: function data() {
        return {
            reportDate: '',
            clientId: '',
            reportResponse: [],
            reportDisplay: []
        };
    },
    computed: {
        clubs: function clubs() {
            return this.$store.state.clubs;
        }
    },
    methods: {
        getReport: function getReport() {
            var _this16 = this;

            var params = { clubId: this.clientId, date: this.reportDate };
            if (this.safe(this.reportDate)) {
                this.loader = true;
                axios.get('https://styleminions.co/api/bmr-report', { params: params }).then(function (res) {
                    _this16.reportResponse = res.data;
                    _this16.buildReport();
                });
            }
        },
        getSelectedDate: function getSelectedDate(date) {
            console.log(date);
            this.reportDate = moment(date).format('YYYY-MM-DD');
        },
        buildReport: function buildReport() {
            var _this17 = this;

            var clubs = this.clubs;
            var clubMapping = new Map();
            for (var index in clubs) {
                clubMapping.set(clubs[index].id, index);
                clubs[index].search = [];
                clubs[index].request = [];
                clubs[index].totalSearch = 0;
                clubs[index].totalRequest = 0;
            }

            this.reportResponse.forEach(function (item) {
                var index = clubMapping.get(item.clubId);
                switch (item.trackTask) {
                    case 'search':
                        clubs[index].search.push(item);
                        clubs[index].totalSearch++;
                        break;
                    case 'request':
                        clubs[index].request.push(item);
                        clubs[index].totalRequest++;
                        break;
                }
            });
            console.log(clubMapping, clubs);
            this.reportDisplay = !this.safe(this.clientId) ? clubs.sort(function (a, b) {
                return b.totalRequest - a.totalRequest;
            }) : clubs.filter(function (item) {
                return item.id === _this17.clientId;
            });
            this.$forceUpdate();
            this.loader = false;
        }
    },
    mounted: function mounted() {
        //Setup for MaterializeCss select plugin on the browser
        var elems = document.querySelectorAll('select');
        var options = {};
        var today = new Date();
        var datePickerOptions = {
            format: 'yyyy-mm-dd',
            defaultDate: today,
            setDefaultDate: true,
            maxDate: today,
            onSelect: this.getSelectedDate,
            onClose: this.getReport,
            autoClose: true
        };
        this.selectInstances = M.FormSelect.init(elems, options);
        //Setup datepicker
        var datepicker = document.querySelectorAll('.datepicker');
        var instances = M.Datepicker.init(datepicker, datePickerOptions);
    }
});

Vue.component('modal', {
    props: ['modalPage'],
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
    bind: function bind(el, binding, vnode) {
        el.onfocus = function () {
            vnode.context.isSearchFocused = true;
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
        el.onblur = function () {
            vnode.context.isSearchFocused = false;
            console.log('not in focus anymore');
            //vnode.context.toggleSearch()
        };
    },
    componentUpdated: function componentUpdated(el, binding, vnode, oldVnode) {
        console.log('a change happened for the directive', vnode);
        if (binding.value !== binding.oldValue) {
            console.log('now i have a reason to do stuff');
            if (binding.value === true) {
                el.focus();
            }
            if (binding.value === false) {
                el.blur();
            }
        }
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
        clubs: [],
        vipMode: {
            limit: 0,
            uuid: 0,
            insta: '',
            club: ''
        }
    },
    mutations: {
        url: function url(state, data) {
            state.url = data;
        },
        accessToken: function accessToken(state, data) {
            state.accessToken = data;
        },
        clubs: function clubs(state, data) {
            state.clubs = data;
        },
        vipMode: function vipMode(state, data) {
            state.vipMode.limit = data.request_limit;
            state.vipMode.uuid = data.unique_id;
            state.vipMode.insta = data.insta;
            state.vipMode.club = data.club;
        },
        reduceLimit: function reduceLimit(state) {
            state.vipMode.limit--;
        },
        resetVipMode: function resetVipMode(state) {
            state.vipMode.limit = 0;
        }
    }
});

var routes = [{ path: '/request/:id', component: spotify }, { path: '/dj/:id', component: djSpotify }, { path: '/', component: landing }, { path: '/home', component: home }, { path: '/report', component: report }, { path: '*', redirect: '/' }];
var router = new VueRouter({
    routes: routes // short for `routes: routes`
});

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');