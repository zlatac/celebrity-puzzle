const serviceProvider = {
    data: function () {
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
            baseUrl: 'https://styleminions.co/api',
            profileTimeout: null,
            instaName: ''
        };
    },
    computed: {
        url() {
            return this.$store.state.url;
        },
        isWindowBig() {
            return this.checkWindow();
        },
        deviceId() {
            if ('deviceId' in localStorage) {
                return localStorage.deviceId;
            } else {
                return 'empty';
            }
        },
        isLocalhost() {
            return location.href.includes(':8000') || location.href.includes('localhost');
        }

    },
    mounted: function () {
        let modal = document.querySelector('.modal');
        let tooltip = document.querySelector('.tooltipped');
        let modalOptions = {};
        //if (this.$route.path.includes('game')) modalOptions.dismissible = false
        if (modal) this.modalInstance = M.Modal.init(modal, modalOptions);
        if (tooltip) M.Tooltip.init(tooltip);
    },
    destroy: function () {
        this.modalInstance.destroy();
    },
    created: function () {
        this.validateClubListState();
    },
    methods: {
        safe: function safe(a) {
            if (a === undefined || a === null || a === '') {
                return false;
            }
            return true;
        },
        checkWindow: function () {
            if (window.innerWidth > 600 && window.innerWidth > 768) {
                //768px is for tablet (ipad)
                return true;
            }
            return false;
        },
        randomize: function (array) {
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
        cleanInstaHandle(handle) {
            return handle.replace('@', '').toLowerCase();
        },
        toggleModal: function (modalData) {
            this.modalData = modalData;
            this.modalInstance.open();
        },
        generateDeviceId: function (skipredirect) {
            //if skipredirect is not true redirect to dash page
            axios('/myipaddress').then(res => {
                let ip = res.data;
                let unixtime = moment().unix();
                let hash = generateHash(ip, unixtime);
                localStorage.deviceId = hash;
            }).catch(error => {
                console.warn(new Error(error));
            }).finally(() => {
                if (skipredirect !== true) {
                    this.sendToCategory();
                    console.log('wow');
                }
            });
            function generateHash(ip, time) {
                //hash structure is [ip address + time + (ip-random)(time-random)(ip-random)]
                let address = ip.replace('.', '');
                let stringtime = String(time);
                let hash = '';
                for (let i = 0; i < 3; i++) {
                    if (i !== 1) {
                        hash += address[Math.floor(Math.random() * address.length)];
                    } else {
                        hash += stringtime[Math.floor(Math.random() * stringtime.length)];
                    }
                }
                return `${ip}-${time}-${hash}`;
            }
        },
        clearInterval: function (intervalInstance) {
            if (this.safe(intervalInstance)) {
                clearInterval(intervalInstance);
            }
        },
        modalAdsense: function () {
            if (this.adsenseServed === false) {
                //No need to call for the same ad unit 
                this.adsenseServed = true;
                setTimeout(() => {
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
        closeModal() {
            this.modalInstance.close();
        },
        getProfile: function (input) {
            if (typeof input === 'string' && this.safe(input)) this.inputProfile = input;
            this.modalPage.imageacquired = false; // remove submit button while typing
            this.modalPage.verified = this.modalPage.unverified = false;
            this.modalPage.showButton = true;
            if (this.profileTimeout !== null) {
                clearTimeout(this.profileTimeout);
            }
            this.profileTimeout = setTimeout(() => {
                //console.log(this.inputProfile)
                let profile = this.cleanInstaHandle(this.inputProfile);
                this.fetchInstaProfile(profile);
            }, 1200);
        },
        fetchInstaProfile: function (profile) {
            if (this.$route.path.includes('request')) {
                return this.getVipStatus(profile);
            }
            this.modalPage.loader = true;
            if (profile === '') return this.modalPage.fail = true;
            axios.get(`/profile`, {
                params: {
                    insta: profile
                }
            }).then(res => {
                if (res.status === 200) {
                    let sift = JSON.parse(res.data.match(/window._sharedData = ({.+);/i)[1]);
                    let user = sift.entry_data.ProfilePage["0"].graphql.user;
                    this.instaName = user.full_name;
                    this.$store.commit('url', user.profile_pic_url);
                    this.modalPage.fail = false;
                    this.modalPage.loader = false;
                    this.modalPage.imageacquired = true;
                }
            }).catch(error => {
                this.modalPage.fail = true;
            });
        },
        getInstaImage(handle) {
            return axios.get(`/profile`, {
                params: {
                    insta: handle
                }
            }).then(res => {
                if (res.status === 200) {
                    let sift = JSON.parse(res.data.match(/window._sharedData = ({.+);/i)[1]);
                    let user = sift.entry_data.ProfilePage["0"].graphql.user;
                    let image = user.profile_pic_url;
                    return image;
                }
            });
        },
        getVipStatus(profile) {
            const instaProfile = this.cleanInstaHandle(profile);
            const club_id = this.modalPage.brand.id || this.$store.state.vipMode.club;
            const date = moment().toISOString();
            this.modalPage.showButton = false;
            this.modalPage.loader = true;
            if (instaProfile === '') return this.modalPage.fail = true;
            let promises = [];
            promises.push(axios.get(`/profile`, { params: { insta: instaProfile } }));
            promises.push(axios.get(`${this.baseUrl}/bmr-vip/${club_id}/${instaProfile}/${date}`));
            return Promise.all(promises).then(res => {
                const instagram = res[0];
                const verifyApi = res[1];
                if (instagram.status === 200) {
                    let sift = instagram.data.match(/og:image.+(http.+)"/i)[1];
                    this.$store.commit('url', sift);
                    this.modalPage.fail = false;
                    this.modalPage.imageacquired = true;
                } else {
                    this.modalPage.fail = true;
                }
                if (verifyApi.status === 200) {
                    verifyApi.data[0].insta = instaProfile;
                    verifyApi.data[0].club = club_id;
                    this.$store.commit('vipMode', verifyApi.data[0]);
                    this.modalPage.verified = true;
                } else {
                    this.modalPage.unverified = true;
                    this.$store.commit('resetVipMode');
                }
            }).finally(() => {
                this.modalPage.loader = false;
            });
        },
        validateId() {
            let club = this.$store.state.clubs.findIndex(item => String(item.id) === this.appName);
            if (club === -1) {
                this.$router.push('/home');
            }
        },
        validateClubListState() {
            let landingRoute = this.$route.name === '/';
            if (this.$store.state.clubs.length === 0 && !landingRoute) {
                this.$router.push('/');
            }
        },
        getClubData() {
            return this.$store.state.clubs.find(item => String(item.id) === this.appName);
        },
        inputHighlight() {
            let input = document.querySelector('#search');
            input.focus();
            input.setSelectionRange(0, 9999);
        },
        webSocket() {
            if ('io' in window) {
                //var socket = io('https://mochanow.com');
                var socket = io();
                return socket;
            }
        },
        trackAction(dataObject) {
            dataObject.clubId = this.appName;
            let payload = JSON.stringify(dataObject);
            axios.post(`https://styleminions.co/api/blessmyrequest?payload=${payload}`);
        },
        locationPerimeter(latitude, longitude, distance) {
            //average human walks 5km/hr => therefore walking 2km in 24 minutes
            //this function returns the pointA and pointD of the perimeter around the users location
            if (distance === undefined) distance = 0.05; //default distance in km tested with google map(50 metres)
            let latitudeInMinutes = latitude * 60; // 1 degree = 60 minutes
            let longitudeInMinutes = longitude * 60;
            let distanceInMinutes = distance * 60 / 60; //using 60km/hr
            let pointA = {};
            let pointD = {};
            function minutesToDegrees(minutes) {
                return minutes / 60;
            }
            pointA.latitude = minutesToDegrees(latitudeInMinutes + distanceInMinutes);
            pointA.longitude = minutesToDegrees(longitudeInMinutes - distanceInMinutes);
            pointD.latitude = minutesToDegrees(latitudeInMinutes - distanceInMinutes);
            pointD.longitude = minutesToDegrees(longitudeInMinutes + distanceInMinutes);

            return { pointA, pointD };

            function filterClubs() {
                clubsArray.filter(item => {
                    return item.long < mylocation.pointD.longitude && item.long > mylocation.pointA.longitude && item.lat < mylocation.pointA.latitude && item.lat > mylocation.pointD.latitude;
                }).map(item => {
                    item.distance = distanceFromDj();return item;
                }).sort((a, b) => {
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
const landing = Vue.component('landing', {
    // dark theme: #101010
    // dark blue: #070b19
    // dark experiment:#252525
    template: '#landing',
    mixins: [serviceProvider],
    created: function () {
        fetch(`https://styleminions.co/api/bmrclients`).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return 'fail';
            }
        }).catch(err => {
            console.log(new Error(err));
        }).then(res => {
            if (res !== 'fail') {
                this.$store.commit('clubs', res);
                setTimeout(() => {
                    this.$router.push('/home');
                }, 2000);
            } else if (res === 'fail') {}
        });
    }
});

const home = Vue.component('home', {
    template: `
        <div style="margin-bottom: 65px;">
            <h4 class="center-align white-text" style="margin-bottom:40px;" v-show="!showSearch">
                Select Your Club
            </h4>
            <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4"
                 @click="toggleSearch" v-show="!isSearchFocused">
                <i class="fa fa-search" style="font-size:32px;color:white;margin-top:2px;" v-show="!showSearch"></i>
                <i class="far fa-times-circle" style="font-size:40px;color:white;margin-top:2px;" v-show="showSearch"></i>
            </div>
            <div class="row animated fadeIn" style="margin-bottom:30px;background-color:white;border-radius:22px;width: 90%;
                    margin-top:20px;" v-show="showSearch">
                <form  novalidate @submit.stop.prevent="searchClub">
                    <div class="col s12">
                        <input type="text" name="q" placeholder="Search club, lounge, radio..." @keypress="inputSearch = $event.target.value" 
                               @input="inputSearch = $event.target.value" v-inputHighlight="showSearch" autocomplete="off">
                    </div>
                </form>
            </div>
            <div class="card dark-card animated fadeInUp" v-show="clubs.length === 0">
                <div class="row">
                    <div class="col s12 center">
                        <p><b>Sorry!! Can't find "{{inputSearch}}".</b></p>
                    </div>
                </div>
            </div>
            <div class="card dark-card animated fadeInUp" v-for="(x, index) in clubs">
                <div class="row">
                    <div class="col s4">
                        <div style="position: relative;" @touchstart="goToAdmin(x,$event)" @touchend="holdEvent = false"
                             @mousedown="goToAdmin(x,$event)" @mouseup="holdEvent = false">
                            <img class="circle" :src="x.image" width="70px" style="z-index: -1;">
                            <div style="position:absolute; width:100%; height:100%; top:0"></div>
                        </div>
                    </div>
                    <div class="col s5" style="text-transform:capitalize;">
                        {{x.name}}
                        <p class="grey-text p-space">{{x.city}}</p>
                        
                    </div>
                    <div class="col s3">
                        <span class="btn btn-floating waves-effect waves-light" @click="joinRoom(x)">
                            <i class="material-icons">send</i>
                        </span>
                    </div>
                </div>
            </div>
            <modal :modalPage="modalPage" :modalData="modalData" @submit="addVip" @close="closeModal">
                <h5 style="text-align: center;margin-bottom: 30px">
                    {{modalPage.brand.name}}
                </h5>
            </modal>
        </div>
    `,
    mixins: [serviceProvider],
    data: function () {
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
        clubs() {
            if (this.safe(this.inputSearch)) {
                if (this.inputSearch.toLowerCase() === 'bmr report') {
                    this.$router.push('/report');
                    return;
                }
                return this.$store.state.clubs.filter(item => {
                    let search = this.inputSearch.toLowerCase();
                    return item.name.toLowerCase().includes(search) || item.city.toLowerCase().includes(search);
                });
            }
            return this.$store.state.clubs;
        }
    },
    methods: {
        joinRoom(id) {
            this.$router.push(`/request/${id.id}`);
        },
        resetInput() {
            this.inputSearch = '';
        },
        toggleSearch() {
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
        goToAdmin(brand, event) {
            event.preventDefault();
            this.holdEvent = true;
            setTimeout(() => {
                if (this.holdEvent) {
                    this.holdEvent = false;
                    this.modalPage.insta = true;
                    this.modalPage.spotify = true;
                    this.modalPage.brand = brand;
                    this.modalInstance.open();
                }
            }, 2000);
        },
        addVip(instaProfile) {
            const insta = this.cleanInstaHandle(instaProfile);
            this.modalPage.loader = true;
            const club_id = this.modalPage.brand.id;
            const date = moment().toISOString();
            const expiry_date = moment().add(10, 'h').toISOString();
            const limit = 3;
            axios.get(`${this.baseUrl}/bmr-vip/${club_id}/${insta}/${date}`).then(res => {
                if (res.status === 204) {
                    return axios.post(`${this.baseUrl}/bmr-vip/${club_id}/${insta}/${expiry_date}/${limit}`);
                } else {
                    this.modalPage.unverified = true;
                    this.modalPage.showButton = false;
                    return { status: 0 };
                }
            }).then(res => {
                if (res.status === 201) {
                    this.modalPage.verified = true;
                    this.modalPage.showButton = false;
                }
            }).finally(() => {
                this.modalPage.loader = false;
            });
        }
    }
});

const spotify = Vue.component('spotify', {
    template: '#spotify',
    mixins: [serviceProvider],
    data: function () {
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
            },
            djData: {
                handle: '',
                image: '',
                name: ''
            }
        };
    },
    computed: {
        socket() {
            return this.webSocket();
        },
        appName() {
            return String(this.$route.params.id);
        },
        club() {
            return this.getClubData();
        },
        vipMode() {
            return this.$store.state.vipMode;
        },
        isVip() {
            return this.vipMode.limit > 0 && this.vipMode.club === this.appName;
        },
        isDjHere() {
            const routeId = this.$route.params.id;
            if (routeId === this.$store.state.badge.appName && this.$route.path.includes('request')) {
                return true;
            }
            return false;
        }
    },
    methods: {
        searchTrack() {
            if (this.safe(this.searchInput)) {
                this.loader = true;
                // let token = 'BQCmVbA7pD8mZI9pCpUt5HcsO1Fb9nCRqlhcTAu52TpwCS4uxIi4BffjrENegBzfMjhMXHr_esCHR_R0O5M'
                let token = this.$store.state.accessToken;
                let query = encodeURIComponent(this.searchInput);
                let type = 'track';
                console.log(this.searchInput);

                fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&access_token=${token}`).then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        return 'fail';
                    }
                }).catch(err => {
                    console.log(new Error(err));
                }).then(res => {
                    if (res !== 'fail') {
                        this.searchResult = res.tracks.items.map(item => {
                            let obj = {};
                            obj.image = item.album.images[1].url;
                            obj.song = item.name;
                            obj.artist = item.artists.map(item => item.name).join(', ');
                            obj.id = item.id;
                            return obj;
                        });
                        this.noResult = this.searchResult.length === 0 ? true : false;
                        this.pendingSearch = [];
                        this.loader = false;
                        this.scrollToResultTop();
                        //this.searchInput = ''
                    } else if (res === 'fail') {
                        this.pendingSearch.push(this.searchInput);
                        this.socket.emit('newTokenPlease');
                    }
                }).finally(res => {
                    let payload = { trackTask: 'search', search: this.searchInput, timestamp: moment().toISOString(), domain: location.host };
                    this.trackAction(payload);
                });
            }
        },
        scrollToResultTop() {
            let elem = document.querySelector('.firstresult');
            if (this.safe(elem)) {
                elem.scrollIntoView(false); //false aligns the bottom of the element to the bottom of available space and vice versa
            }
        },
        sendRequest(payload) {
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
        vipSendRequest(payload) {
            if (!this.safe(payload.inProgress)) {
                payload.inProgress = true;
                this.getVipStatus(this.vipMode.insta).then(() => {
                    if (this.isVip) {
                        this.sendRequest(payload);
                    } else {
                        console.log('you are no longer a vip');
                    }
                }).then(() => {
                    payload.inProgress = false;
                });
            }
        },
        goToDjView() {
            this.accessNumber++;
            if (this.accessNumber === 4) {
                this.$router.push(`/dj/${this.appName}`);
            }
        },
        alreadyRequested(payload) {
            if (this.requestedSongs.findIndex(item => item === payload) !== -1) {
                return true;
            }
            return false;
        },
        enterVip() {
            this.modalPage.insta = true;
            this.modalPage.spotify = true;
            this.modalPage.brand = this.club;
            this.modalPage.appName = this.appName;
            this.modalInstance.open();
        },
        appColorScheme(vip) {
            const doc = document.documentElement;
            const normal = 'linear-gradient(120deg, #92fe9d 0%, #00c9ff 107%)';
            const gold = 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8a6e2f 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #ffffac 8%, #d1b464 25%, #5d4a1f 62.5%, #5d4a1f 100%)';
            const change = vip ? gold : normal;
            doc.style.setProperty('--main', change);
            console.log('fired', change);
        }
    },
    watch: {
        isVip: function (newValue, oldValue) {
            this.appColorScheme(newValue);
            console.log('fired first', newValue);
        }
    },
    created: function () {
        this.validateId();
        if (this.isVip) this.getVipStatus(this.vipMode.insta);
        this.socket.on('connect', data => {
            this.isConnected = true;
            this.socket.emit('audience', { appName: this.appName, id: this.socket.id, task: 'population' });
            this.socket.emit('getDj', { appName: this.appName });
            console.log(data, 'connected my nigga');
        });
        this.socket.on('disconnect', data => {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            this.isConnected = false;
        });
        this.socket.on('reconnect', data => {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            this.isConnected = true;
            const payload = { appName: this.appName };
            this.socket.emit('getDj', payload);
        });
        //this.socket.emit('join','we in this bitch son');
        this.socket.on('sendMetrics', data => {
            //console.log(data,'metric data');
            if (data.appName === this.appName && 'task' in data && data.task === 'request') {
                this.metrics = data;
                //this.showMetrics = true;
            }
        });
        this.socket.on('newToken', data => {
            this.$store.commit('accessToken', data);
            if (this.pendingSearch.length > 0) {
                this.searchTrack();
            }
        });
        this.socket.on('djData', data => {
            this.djData.name = data.djData.name;
            this.djData.handle = data.djData.handle;
            this.getInstaImage(data.djData.handle).then(res => {
                const payload = { appName: this.appName, image: res };
                this.$store.commit('badgeImage', payload);
                this.djData.image = res;
            }).catch(error => {
                console.warn(error);
            });
        });
    },
    destroyed: function () {
        //console.log('damn son am out')
        this.socket.close();
    }
});

const djSpotify = Vue.component('djSpotify', {
    template: '#djspotify',
    mixins: [serviceProvider],
    data: function () {
        return {
            requestBasket: [],
            population: [],
            pendingTrackDetails: [],
            isConnected: false,
            musicNotes: ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'],
            modalPage: {
                page: 'djspotify',
                insta: false,
                fail: false,
                imageacquired: false,
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
        controlSocket() {
            return this.webSocket();
        },
        requestList() {
            if (this.requestBasket.length > 0) {
                return this.requestBasket.filter(item => item.hide !== true).sort((a, b) => {
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
        club() {
            return this.getClubData();
        },
        appName() {
            return String(this.$route.params.id);
        }
    },
    methods: {
        hideRequest(payload) {
            if (this.safe(payload)) {
                let checkIdExist = this.requestBasket.findIndex(item => item.id === payload.id);
                if (checkIdExist !== -1) {
                    let requestedSong = this.requestBasket[checkIdExist];
                    requestedSong.hide = true;
                    this.reduceVipLimit(requestedSong);
                }
            }
        },
        reduceVipLimit(requestedSong) {
            if (requestedSong.vipList.size > 0 && requestedSong.playedVip === true) {
                let promises = [];
                for (let vip of requestedSong.vipList.values()) {
                    promises.push(axios.post(`${this.baseUrl}/bmr-vip-limit/${vip.club}/${vip.uuid}`));
                }
                Promise.all(promises);
            }
        },
        getTrackBpm(trackObject) {
            let id = trackObject.id;
            let token = this.$store.state.accessToken;
            fetch(`https://api.spotify.com/v1/audio-features/${id}?access_token=${token}`).then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return 'fail';
                }
            }).catch(err => {
                console.log(new Error(err));
            }).then(res => {
                if (res !== 'fail') {
                    let musicKey = this.musicNotes[res.key];
                    let bpm = Math.floor(Number(res.tempo));
                    let output = `${musicKey} - ${bpm} bpm`;
                    let indexInBasket = this.requestBasket.findIndex(item => item.id === id);
                    this.requestBasket[indexInBasket].bpm = output;
                } else if (res === 'fail') {
                    this.pendingTrackDetails.push(trackObject);
                    this.controlSocket.emit('newTokenPlease');
                }
            });
        },
        setDj() {
            //save to database first
            const payload = {};
            payload.appName = this.appName;
            payload.handle = this.inputProfile;
            payload.name = this.instaName;
            this.controlSocket.emit('setDj', payload);
            this.modalPage.verified = true;
            this.modalPage.imageacquired = false;
            this.$store.commit('badgeImage', { image: this.url, appName: this.appName });
        }
    },
    created: function () {
        this.validateId();
        this.controlSocket.on('connect', data => {
            this.isConnected = true;
            this.controlSocket.emit('getDj', { appName: this.appName });
            console.log('connected my nigga');
        });
        this.controlSocket.on('disconnect', data => {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            this.isConnected = false;
        });
        this.controlSocket.on('answer', data => {
            console.log(data);
            if (data.appName === this.appName) {
                if ('task' in data && data.task === 'population') {
                    console.log('population gwoth complete', data);
                    this.population.push(data);
                }
                if ('task' in data && data.task === 'request') {
                    console.log('request added bruh', data);
                    let checkIdExist = this.requestBasket.findIndex(item => item.id === data.song.id);
                    console.log(checkIdExist);
                    if (checkIdExist === -1) {
                        data.song.vipList = new Map();
                        data.song.requestCount = 1;
                        data.song.hide = false;
                        data.song.bpm = '';
                        if (data.vip.limit > 0) data.song.vipList.set(data.vip.insta, data.vip);
                        data.song.showVip = false;
                        this.requestBasket.push(data.song);
                        this.getTrackBpm(data.song);
                    } else {
                        let requestedSong = this.requestBasket[checkIdExist];
                        requestedSong.requestCount += 1;
                        if (data.vip.limit > 0) requestedSong.vipList.set(data.vip.insta, data.vip);
                    }
                    this.controlSocket.emit('analytics', { appName: this.appName, requestNumber: this.requestList.length, task: 'request' });
                }
                if ('task' in data && data.task === 'pendingRequests') {
                    //pending requests from server will include requests already received before disconnection
                    //take only the requests we dont have in the requestBasket to avoid double counting of requests
                    const addUp = (accumulator, currentValue) => accumulator + currentValue;
                    let totalRequestsReceived = 0; //default
                    if (this.requestBasket.length > 0) {
                        totalRequestsReceived = this.requestBasket.map(item => item.requestCount).reduce(addUp);
                    }

                    let onlyNewPendingRequests = data.pendingRequests.slice(totalRequestsReceived);
                    onlyNewPendingRequests.forEach(request => {
                        let checkIdExist = this.requestBasket.findIndex(item => item.id === request.song.id);
                        console.log(checkIdExist);
                        if (checkIdExist === -1) {
                            request.song.vipList = new Map();
                            request.song.requestCount = 1;
                            request.song.hide = false;
                            request.song.bpm = '';
                            this.requestBasket.push(request.song);
                            this.getTrackBpm(request.song);
                        } else {
                            this.requestBasket[checkIdExist].requestCount += 1;
                        }
                    });
                }
            }
        });
        this.controlSocket.on('newToken', data => {
            this.$store.commit('accessToken', data);
            if (this.pendingTrackDetails.length > 0) {
                let tracks = this.pendingTrackDetails;
                this.pendingTrackDetails = [];
                tracks.forEach(item => {
                    this.getTrackBpm(item);
                });
            }
        });
        this.controlSocket.on('reconnect', data => {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            const payload = { appName: this.appName };
            this.isConnected = true;
            this.controlSocket.emit('updateRequests', payload);
        });
        this.controlSocket.on('djData', data => {
            this.getInstaImage(data.djData.handle).then(res => {
                const payload = { appName: this.appName, image: res };
                this.$store.commit('badgeImage', payload);
            });
        });
    },
    destroyed: function () {
        //console.log('damn son am out')
        this.controlSocket.close();
    }
});

const report = Vue.component('report', {
    template: '#report',
    mixins: [serviceProvider],
    data: function () {
        return {
            reportDate: '',
            clientId: '',
            reportResponse: [],
            reportDisplay: []
        };
    },
    computed: {
        clubs() {
            return this.$store.state.clubs;
        }
    },
    methods: {
        getReport() {
            const params = { clubId: this.clientId, date: this.reportDate };
            if (this.safe(this.reportDate)) {
                this.loader = true;
                axios.get('https://styleminions.co/api/bmr-report', { params }).then(res => {
                    this.reportResponse = res.data;
                    this.buildReport();
                });
            }
        },
        getSelectedDate(date) {
            console.log(date);
            this.reportDate = moment(date).format('YYYY-MM-DD');
        },
        buildReport() {
            let clubs = this.clubs;
            let clubMapping = new Map();
            for (let index in clubs) {
                clubMapping.set(clubs[index].id, index);
                clubs[index].search = [];
                clubs[index].request = [];
                clubs[index].totalSearch = 0;
                clubs[index].totalRequest = 0;
            }

            this.reportResponse.forEach(item => {
                const index = clubMapping.get(item.clubId);
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
            this.reportDisplay = !this.safe(this.clientId) ? clubs.sort((a, b) => b.totalRequest - a.totalRequest) : clubs.filter(item => item.id === this.clientId);
            this.$forceUpdate();
            this.loader = false;
        }
    },
    mounted: function () {
        //Setup for MaterializeCss select plugin on the browser
        let elems = document.querySelectorAll('select');
        let options = {};
        const today = new Date();
        const datePickerOptions = {
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
        const datepicker = document.querySelectorAll('.datepicker');
        const instances = M.Datepicker.init(datepicker, datePickerOptions);
    }
});

Vue.component('modal', {
    props: ['modalPage'],
    template: '#comp-modal',
    mixins: [serviceProvider],
    data: function () {
        return {
            whyme: 'heloo'
        };
    }
});

Vue.component('champion', {
    props: ['index', 'url'],
    template: `
        <div style="position: relative;">
            <img :src="url" alt="" class="circle responsive-img img-lead" v-imgfallback>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3 animated tada infinite" v-if="index === 0"><i class="fa fa-trophy gold"></i></span>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 1"><i class="fa fa-trophy silver"></i></span>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 2"><i class="fa fa-trophy bronze"></i></span>
            <span class="btn btn-small btn-floating lead-fab z-depth-3" v-if="index > 2">{{index + 1}}</span>
        </div>
    `
});
Vue.component('spinner', {
    props: ['colorClass'],
    template: `
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
Vue.directive('inputHighlight', {
    bind: function (el, binding, vnode) {
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
    componentUpdated: function (el, binding, vnode, oldVnode) {
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
    template: `
    <div>
        <!-- footer ad  data-adtest="on"-->
        <ins class="adsbygoogle center-block"
            style="display:block"
            data-ad-client="ca-pub-8868040855394757"
            data-ad-slot="1741308624"></ins>
    </div>
    `,
    mixins: [serviceProvider],
    mounted() {
        this.modalAdsense();
    }
});

Vue.component('badge', {
    template: `
    <div class="component">
        <div class="dj-chip chip animated fadeInRight" @click="show = true">
        <img :src="imageUrl" alt="Contact Person">
        DJ
        </div>
        <slide-modal :show="show" @close="show = false">
            <slot></slot>
        </slide-modal>
    </div>
    `,
    data: function () {
        return {
            show: false,
            link: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png'
        };
    },
    computed: {
        imageUrl() {
            const routeId = this.$route.params.id;
            if (routeId === this.$store.state.badge.appName) {
                return this.$store.state.badge.image;
            }

            return this.link;
        }
    }

});
Vue.component('slide-modal', {
    template: `
    <div class="dj-modal-container" v-if="show">
        <div class="close-body" @click="$emit('close')"></div>
        <div class="dj-modal-body animated slideInUp">
            <slot></slot>
        </div>
    </div>
    `,
    props: ['show']

});
Vue.component('get-insta', {
    template: `
    <div class="row">
        <div class="col s8">
            <input type="text" placeholder="Instagram handle" :value="inputProfile" :class="{'invalid': comp.fail}"
                @keypress="inputProfile = $event.target.value" @input="inputProfile = $event.target.value" 
                @keyup="$emit('get-profile', inputProfile)">
        </div>
        <div class="col s4" v-show="!comp.fail" style="position: relative;">
            <img :src="url" alt="" class="circle responsive-img img-lead animated fadeInLeft" v-show="!comp.loader">
            <span v-show="comp.verified" class="btn btn-small btn-floating lead-fab z-depth-3"><i class="material-icons">check</i></span>
            <span v-show="comp.unverified" class="btn btn-small btn-floating lead-fab z-depth-3"><i class="material-icons">close</i></span>
            <spinner class="animated fadeIn" :colorClass="'default'" v-show="comp.loader"></spinner>
        </div>
        <div class="col s4" v-show="comp.fail">
            <i class="material-icons">mood_bad</i><br><span style="font-size:10px">Oops! Not an instagram profile</span>
        </div>
    </div>
    `,
    props: ['comp'],
    mixins: [serviceProvider]
});
Vue.directive('imgfallback', {
    bind: function (el, binding, vnode) {
        let fallback = 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png';
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

const store = new Vuex.Store({
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
        },
        badge: {
            image: 'https://www.chaarat.com/wp-content/uploads/2017/08/placeholder-user-300x300.png',
            appName: ''
        }
    },
    mutations: {
        url(state, data) {
            state.url = data;
        },
        accessToken(state, data) {
            state.accessToken = data;
        },
        clubs(state, data) {
            state.clubs = data;
        },
        vipMode(state, data) {
            state.vipMode.limit = data.request_limit;
            state.vipMode.uuid = data.unique_id;
            state.vipMode.insta = data.insta;
            state.vipMode.club = data.club;
        },
        reduceLimit(state) {
            state.vipMode.limit--;
        },
        resetVipMode(state) {
            state.vipMode.limit = 0;
        },
        badgeImage(state, data) {
            state.badge = data;
        }
    }
});

const routes = [{ path: '/request/:id', component: spotify }, { path: '/dj/:id', component: djSpotify }, { path: '/', component: landing }, { path: '/home', component: home }, { path: '/report', component: report }, { path: '*', redirect: '/' }];
const router = new VueRouter({
    routes // short for `routes: routes`
});

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');