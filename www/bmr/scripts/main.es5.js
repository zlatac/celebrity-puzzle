'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
            noProfileUrl: 'data:image/png;base64,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',
            isConnected: false,
            adsenseServed: false,
            holdEvent: false,
            logo: "https://drive.google.com/uc?id=1ctizeSjjAuaEKuOWPgIjau7A5LNcMA7Q",
            baseUrl: 'https://styleminions.co/api',
            profileTimeout: null,
            instaName: '',
            appLogoImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/7QCEUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAGccAigAYkZCTUQwMTAwMGE4YTAxMDAwMDI0MDMwMDAwYWEwNDAwMDA4ODA1MDAwMGY0MDUwMDAwOGMwNzAwMDA3ZjA5MDAwMDAwMGEwMDAwZGYwYTAwMDA3NDBiMDAwMGQzMGUwMDAwAP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/CABEIAJYAlgMAIgABEQECEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQQFBgMCB//EABkBAAMBAQEAAAAAAAAAAAAAAAECBAADBf/EABkBAAMBAQEAAAAAAAAAAAAAAAECBAADBf/aAAwDAAABEQIRAAAB/VBsjzxX4Xc74inzhB5iBkClYrQrdDb5PT5W7ISwNnn94L8PjzRX5TSzem41c189JkYUYGnQgEguQgHS3eQ2uduqFszsr787PHEHm6fl+o4WyefG7xxta48/KRuY7x+cI3MQpT8wD1vrha6elzxFvkEFzqOW6njdObpZKUfPr5fJ4bXzX9krysrrvBp+Wi/n6QQAQGuQV8UIBdVynVcbfrC3cpe8fb1yVrlioOl4Dso3mXlK3T81ofmAcrkIr4iFLquU6vnZ9VrNbnXU1M3SKq1moHtq2bl1cPP+BIIHEAba3Tr5oQA6zkut52fVO5kpTPhdpnhtTz98damT1mVuOKQswgH3t6Wma6/N9Zk9Vx0GidbyPWJX6Y0ZIb59fFpHSc1A6dFj1YVhA5rVfrN2sh7g2xcnsM1pMD0jz0iEDTCFIgYQC+rPSbt5XR7QxDYNvjJ2Yycd8+nnvNghcIBs7lDoTWDUhsG3/8QAIhAAAgECBgMBAAAAAAAAAAAAAgMBAAQQERIgITATMTIi/9oACAEAAAEFAsZnKmXNEUl0LcYUp4s3sOAhrJZPWi5y2sOAEykywO34mJiem1foxninM8hYx6MBOG25D1WTs8Ls+Ng+sGpFlNUS+iJ0yo/IBlqLYPqjLSIv44mG20FRgQTusWadw+quymtMTNuzLAhgoda1PE9Q+quP0z2B0stIgUHFMULIdbEHUPqmUxka4GBPKaRMTOLrYGU1Jq6B+aICKrX9KgJNYxOUD427HvBcFOZbh+a+XWvDsHYsYK4ddEfSPzTPyy5nxtwupyWDhJbryimSnpH5q5n8iLHIQ+VTHOCrYWAUaS2KXLSug0N2D81cznVu4PFdSLjtLjRTnxksfGtgQVpssF6VPX5F7B+avS0sqWFI1awrTeOgQJxErG2V5WYXadmqBB13UzMz0AMmSFQpeNzb5YmZH1AMmVsiEjtfbQdGMhPSi3NtJSKh3mInDbOp4nalUtJVoAbv/8QAJREAAgIBBAMAAQUAAAAAAAAAAQIAAyEEEBEgEjFBEyIyQmFx/9oACAECEQE/AZbeK/8AY9rWe+ikrkSrU84fe+38Y/uE85M01avyDLNMyZHXT2/xO1r/AJG520f2HEapLciPUye+lb+S876P7Lv2wHxyICDLNMDlYVK4PXSfZcORFBbMC+OdmUNgy1FU4PTSfY0rxysf1GsVRzHvLet2XxPG2k+y08LDgBlOYtqleY9WN0pBHJmoq8v1DbS/ZdcCOFglb+B5jWFjtVX5He3T/VmRjrXUWgAA4HRq1b30pQEc9P/EAB4RAAEEAwEBAQAAAAAAAAAAAAEAAhAgAxESMTBR/9oACAEBEQE/AUxhcg0N8oUW/ksZ0YyOI8QyA1Iho5EZYBLV1u+VN9nq2RN+L4Nt7h99Jph1hINtfEU//8QALhAAAQMACQMDAwUAAAAAAAAAAQACEQMQEiAhIjFBUTBhkTKBsRMzQiNicXKi/9oACAEAAAY/Aq8Vk8rMZ6Gsjgrg8X5Kx046lmk83ZKk1yzwoPSsu9Pxc7bXAswUtxHSsO12qsD3uivg8rHTnoAjUIOCJuiqUC4Q0rspZgVDhF9zXaa3hVG26LASMJCzaE+DVDhKmj8LHpirtojZMuozI/hfVH234EIh59O6wqzBSMzekKhDs1o4JjwMDg5Ooj6H4hBrvuM/0E+OZuTo5Zhhz0BUaNoGB9Sex3Ks0mBbo5C1ieVOzjF2DmPCkCO18VO7tlUjSLM4xWz+1eYqG5R0RUx22io6T2NdrgyrcwO6ii8qSZPSFQbs7VZ4j8V9Ol0+K3HEY4Ig6i7DV2N0VUn7QmiQCEBRnEalWX+n4ViizPdwg3hF/wCU2rto6uUb7XRULPqjGqNu1U0eu6LGnMU2j2FyNhrXbb73JcYCii8qTj0Q1upUDXe5ao9NxXmPShokrl3N6WYOUOEdLDBvKhvnoQ4Sv03exUXoELNmN7//xAAmEAEAAQIFBQADAQEAAAAAAAABEQAhECAxQVEwYXGBoZGxwdHw/9oACAEAAAE/IcQEqCtoz3UtKdBotAtXtZ/w9Oa2Y2dQ0Ek2/wB0XLZEXoOa/wCwmM5XbVUSUeHpSh7tHEgK2Ckl2aMnzVGpKlf6XSgzWauTCEbl8r4sbsnZVoyeDoOqhJKDdhTO7uX4sJqE7BUwe0mZvQyiFVPeG2qZJZxSo0M3xYaCwYfyoZRYPc2rRQIX8sIMB3pSVk5UFAImz0/iwKka0Zy6081I/SrpQscLvV277GzShkQwiQmEWucmtSfpNTpfFhebwH90lglJFoaE+KHQCw2pnVMxPZyTA8xTH4DTofBgDIJ5bb0S+oQ1HZVY/dEmg8KQ5izw3yrPCaJgl2bZ/gwvAJ0HcpM1sVbPtxn0Xbdqe/qvQa+DBS3JvmuIp9FDJJphBwWNFeflwrWD3pSpN3pfBhfLEkuAJp0KQ8p5ajCgtNEARkabl9KmzIyGlPqIhyvNYJqYTlMvwYN48Dzq0lBSEWKCQgu2Famv0aMklgcKPbjdpzhJS95bNbnqprYvRkUdTJ8GEttcOCYTqhxEThFmWatanIWbbFWyHFvkY+6VBBBphNJ32f3JAgA1aVkI76dKp3eiFE0Er2pcuR5F+hixKMadukEmFThu65k5FxbNS1LpIyO5qLF3VavQhKHehuwUGRbZp8iOav3taUWLZf/aAAwDAAABEQIRAAAQ8+skl7f308ukyFbErdS8Mkr95wVjd/krKpDmMWi/7dvtXA898RViVvZ48nnyoe8uZt5nkmNqToJVGk+c88jcGnh6c888cIvmH888/8QAJhEAAQMDAwQCAwAAAAAAAAAAAQARMRAhQVGBsSBhocHR8HGR4f/aAAgBAhEBPxBC2nQj19tMUAoUdYoGq1qG3KEQsiAi6e1mEeatQvH8UOXHH4pPb7RAHKxSfuEdstqmTIWuEEBG9GUtvtGbRlEIYuP4bbgoKxzhYBPhHGWqEyntRxAfYQATe/ojflEMYUAMumU926J7faiDoVtp5uiYynQMq12CjIxTxSW1OH3vwmupyTq/pDawYgOajspTTOJoQBM9lJLuiIhRB0fGMUM8YFXj4/hSFQCt1NgsaOgTaiGLUCfsX6P/xAAcEQEBAAIDAQEAAAAAAAAAAAABABEhEDFBIGH/2gAIAQERAT8Qtp5dclllgOmx75d11ABgsSzUumWWWW9jjGkt5jdpmB0lllmWW8cDvTYSF7Zlsyy3iWJcalzytmWW8xbbjhZbMYMksuo7vx4ZZYGN2PTLwCWWWWGXnxZZZZZYTBj5ZmBjPx//xAAnEAEAAgEDAgcBAQEBAAAAAAABABEhEDFBIFFhcYGRobHR8MHhMP/aAAgBAAABPxDVGQMqtBAFNwox6EuZPF28um9VgqPEPTtKS/ju/k89djfAN14SyKhwOD9eu9Fiy6cbxxLZTc/nMQChHInPQ9fgG67Rc9uwGw7GixcjIVPpioL3CnouMWMdEtZqbl+TfbRSwFq8RC7MXYO/m6MZ8Z9Sgbsdk8mZgnmgw9OY4331uXL1YmWDbex6aXAycHbg6GfCfWt54Cc+veLr28bPXtFly4y4sWVUgSbNVydnknceg7HB0M+E+tM+nZYq1aJZAlDi7ErF8Q2otiZElsDf7/5OwSHh8mLLixdFhgULF2dk+tXRZ8J9aHLxHG7dDyqoTizXB4zcvI9mJW5lAo5H4O566MUHcFy3Teuz6Mx52QpJei6XrejPhPrQcd836mg+3vEoyM91F28snpKNuwBluLeIymlEz5/k48yGA2Yw8TSuJ4Yh6yvKWbGDxPyXFly49DPhPrRtRaUM3bu9Agiauz8C8oyiUbeB5D7lgwCzwTeO9TCA8SAV7Unp0UJu48PmczeNbGZfkei9GfAfWghSb1JWlc3mErTxRf8A25iU8wtrYf7BYWpFLiwoMO7D5s9emqZSnJ78EeRlmzqvVnwH1pdlVqd1Kx5iR4SgJujz531Vm2LfWzWu/sGfIJly+LH5uPSL78vRcuXNk+C+tNoSexcPk+ZTpgmOV/MAEFFic6IUUI7DLsANFArtFcMbU/R+zcDAlrperhpxFixYs+C+tKiFRTagqO+IKOVwzGySygaIz5u5BLAsRsYBACikeYm2WVgDjHMo/seYdNGuTvtdf7KQV79yf3fW4s+D+tGn7jZ/QVBwxLUrED5wNmXlgIZZn5fkNb0pYXdWBxPUjusCOEVyjgX5V0LGak9PDj+wQK3h7/8AYRFEpHh0WM+D+tDeLK1adhOeY5hSqgQmnet4wBCwJWXs9oGAVhX3lj9AQXdXa9VivH2t29YAAAKA40fNAY+Tsl6LKbA2lcTCI2p+j9mZCSlr0WjYp5NdCxQbqA+/KV5Jsf4OhG93D8j8lxgumqHA8DW49KxXy8B9vYmGA/K8Dw6lrYy/xpiYr4TfyeYy5fUsCouyOPTvMiZf0Pj/AMFXa8bTZJ33T33i1y1TUvpRPRa3/wAixeecaHp+wAAAMAcdP//Z'
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
        },
        jukeboxMode: function jukeboxMode() {
            return this.getClubData().client_type.includes('jukebox');
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
        cleanInstaHandle: function cleanInstaHandle(handle) {
            return handle.replace('@', '').toLowerCase();
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
        instaLink: function instaLink(handle) {
            //return `https://www.instagram.com/${handle}/`
            return '/profile?insta=' + handle;
        },

        getProfile: function getProfile(input) {
            var _this2 = this;

            if (typeof input === 'string' && this.safe(input)) this.inputProfile = input; //$event gets passed by vue
            this.modalPage.imageacquired = false; // remove submit button while typing
            this.modalPage.verified = this.modalPage.unverified = false;
            this.modalPage.showButton = true;
            if (this.profileTimeout !== null) {
                clearTimeout(this.profileTimeout);
            }
            this.profileTimeout = setTimeout(function () {
                //console.log(this.inputProfile)
                var profile = _this2.cleanInstaHandle(_this2.inputProfile);
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
            axios.get(this.instaLink(profile)).then(function (res) {
                if (res.status === 200) {
                    console.log(res);
                    var user = res.data.graphql.user;
                    _this3.instaName = user.full_name;
                    _this3.$store.commit('url', user.profile_pic_url);
                    _this3.modalPage.fail = false;
                    _this3.modalPage.loader = false;
                    _this3.modalPage.imageacquired = true;
                }
            }).catch(function (error) {
                _this3.modalPage.fail = true;
            });
        },
        getInstaImage: function getInstaImage(handle) {
            return axios.get(this.instaLink(handle)).then(function (res) {
                if (res.status === 200) {
                    var user = res.data.graphql.user;
                    var image = user.profile_pic_url;
                    return image;
                }
            });
        },
        getVipStatus: function getVipStatus(profile) {
            var _this4 = this;

            var instaProfile = this.cleanInstaHandle(profile);
            var club_id = this.modalPage.brand.id || this.$store.state.vipMode.club;
            var date = moment().toISOString();
            this.modalPage.showButton = false;
            this.modalPage.loader = true;
            if (instaProfile === '') return this.modalPage.fail = true;
            var promises = [];
            promises.push(axios.get(this.instaLink(instaProfile)));
            promises.push(axios.get(this.baseUrl + '/bmr-vip/' + club_id + '/' + instaProfile + '/' + date));
            return Promise.all(promises).then(function (res) {
                var instagram = res[0];
                var verifyApi = res[1];
                if (instagram.status === 200) {
                    var sift = instagram.data.graphql.user.profile_pic_url;
                    _this4.$store.commit('url', sift);
                    _this4.modalPage.fail = false;
                    _this4.modalPage.imageacquired = true;
                } else {
                    _this4.modalPage.fail = true;
                }
                if (verifyApi.status === 200) {
                    verifyApi.data[0].insta = instaProfile;
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
            var landingRoute = this.$route.path === '/';
            if (this.$route.path.includes('join') && this.$route.params.code !== '') {
                this.$store.commit('joinParty', this.$route.params.code);
            }
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
        isMobileOrTablet: function isMobileOrTablet() {
            var maxTabletWidth = 768;
            return window.innerWidth <= maxTabletWidth;
        },
        isIOS: function isIOS() {
            return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
            );
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
var jukeboxMixin = {
    data: function data() {
        return {
            searchInput: '',
            searchResult: [],
            pendingSearch: [],
            requestedSongs: [],
            noResult: false
        };
    },
    computed: {
        displaySearchResult: function displaySearchResult() {
            var _this7 = this;

            //Used in conjuction with v-html for html entities
            return this.searchResult.map(function (item) {
                item.song = _this7.$root.$options.filters.songName(item.song);
                item.artist = _this7.$root.$options.filters.songName(item.artist);
                return item;
            });
        }
    },
    methods: {
        SharePartyRoom: function SharePartyRoom() {
            if ('share' in navigator) {
                navigator.share({
                    title: 'BlessMyRequest',
                    text: 'Request a song now & enjoy the party',
                    url: window.location.origin + '/#/join/' + this.club.id
                }).catch(function (error) {
                    console.error(new Error(error));
                });
            }
        },
        youtube: function youtube(query) {
            var _this8 = this;

            this.loader = true;
            var searchUrl = 'https://www.googleapis.com/youtube/v3/search';
            var key = 'AIzaSyCZVImtMr37nqi5MPRuNtvr0D-kp0Eq0Bk';
            var maxTime = 247; // 4 minutes - if longer than 4 minutes then set maxtime
            var params = new URLSearchParams({
                q: query + ' audio',
                part: 'snippet',
                maxResults: 5,
                key: key
            });
            fetch(searchUrl + '?' + params.toString()).then(function (response) {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(function (res) {
                _this8.searchResult = res.items.map(function (item) {
                    var obj = {};
                    obj.image = item.snippet.thumbnails.default.url;
                    obj.song = item.snippet.title.split(' - ')[1];
                    obj.artist = item.snippet.title.split(' - ')[0];
                    obj.id = item.id.videoId;
                    return obj;
                });
                _this8.noResult = _this8.searchResult.length === 0 ? true : false;
                _this8.pendingSearch = [];
                _this8.loader = false;
                _this8.scrollToResultTop();
                console.log(res, 'am done');
            });
        },
        alreadyRequested: function alreadyRequested(payload) {
            if (this.requestedSongs.findIndex(function (item) {
                return item === payload;
            }) !== -1) {
                return true;
            }
            return false;
        },
        scrollToResultTop: function scrollToResultTop() {
            var elem = document.querySelector('.firstresult');
            if (this.safe(elem)) {
                elem.scrollIntoView(false); //false aligns the bottom of the element to the bottom of available space and vice versa
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
        var _this9 = this;

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
                _this9.$store.commit('clubs', res);
                setTimeout(function () {
                    _this9.$router.push('/home');
                }, 2000);
            } else if (res === 'fail') {}
        });
    }
});

var home = Vue.component('home', {
    template: '\n        <div style="margin-bottom: 65px;">\n            <h4 class="center-align white-text" style="margin-bottom:40px;" v-show="!showSearch">\n                Select Your Club\n            </h4>\n            <div class="btn-floating btn-large waves-effect waves-light fab-menu animated bounce z-depth-4"\n                 @click="toggleSearch" v-show="!isSearchFocused">\n                <i class="fa fa-search" style="font-size:32px;color:white;margin-top:2px;" v-show="!showSearch"></i>\n                <i class="far fa-times-circle" style="font-size:40px;color:white;margin-top:2px;" v-show="showSearch"></i>\n            </div>\n            <div class="row animated fadeIn" style="margin-bottom:30px;background-color:white;border-radius:22px;width: 90%;\n                    margin-top:20px;" v-show="showSearch">\n                <form  novalidate @submit.stop.prevent="searchClub">\n                    <div class="col s12">\n                        <input type="text" name="q" placeholder="Search club, lounge, radio..." @keypress="inputSearch = $event.target.value" \n                               @input="inputSearch = $event.target.value" v-inputHighlight="showSearch" autocomplete="off">\n                    </div>\n                </form>\n            </div>\n            <div class="card dark-card animated fadeInUp" v-show="clubs.length === 0">\n                <div class="row">\n                    <div class="col s12 center">\n                        <p><b>Sorry!! Can\'t find "{{inputSearch}}".</b></p>\n                    </div>\n                </div>\n            </div>\n            <div class="card dark-card animated fadeInUp" v-for="(x, index) in clubs">\n                <div class="row">\n                    <div class="col s4">\n                        <div style="position: relative;" @touchstart="goToAdmin(x,$event)" @touchend="holdEvent = false"\n                             @mousedown="goToAdmin(x,$event)" @mouseup="holdEvent = false">\n                            <img class="circle" v-imgfallback :src="x.image" width="70px" style="z-index: -1;">\n                            <div style="position:absolute; width:100%; height:100%; top:0"></div>\n                        </div>\n                    </div>\n                    <div class="col s5" style="text-transform:capitalize;">\n                        {{x.name}}\n                        <p class="grey-text p-space">{{x.city}}</p>\n                        \n                    </div>\n                    <div class="col s3">\n                        <span class="btn btn-floating waves-effect waves-light" @click="joinRoom(x)">\n                            <i class="material-icons">send</i>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <modal :modalPage="modalPage" :modalData="modalData" @submit="addVip" @close="closeModal">\n                <h5 style="text-align: center;margin-bottom: 30px">\n                    {{modalPage.brand.name}}\n                </h5>\n                <div class="row">\n                    <div class="col s8">\n                        <input \n                            type="password"\n                            placeholder="Bar code"\n                            v-model="modalPage.barCode"\n                            inputmode="numeric"\n                            minlength="4"\n                            maxlength="4"\n                            size="4"/>\n                    </div>\n                </div>\n            </modal>\n        </div>\n    ',
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
                showButton: true,
                barCode: ''
            }
        };
    },
    computed: {
        clubs: function clubs() {
            var _this10 = this;

            if (this.safe(this.inputSearch)) {
                if (this.inputSearch.toLowerCase() === 'bmr report') {
                    this.$router.push('/report');
                    return;
                }
                return this.$store.state.clubs.filter(function (item) {
                    var search = _this10.inputSearch.toLowerCase();
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
            var _this11 = this;

            event.preventDefault();
            this.holdEvent = true;
            setTimeout(function () {
                if (_this11.holdEvent) {
                    _this11.holdEvent = false;
                    _this11.modalPage.insta = true;
                    _this11.modalPage.spotify = true;
                    _this11.modalPage.brand = brand;
                    _this11.modalInstance.open();
                }
            }, 2000);
        },
        addVip: function addVip(instaProfile) {
            var _this12 = this;

            var insta = this.cleanInstaHandle(instaProfile);
            this.modalPage.loader = true;
            var club_id = this.modalPage.brand.id;
            var date = moment().toISOString();
            var expiry_date = moment().add(10, 'h').toISOString();
            var limit = 3;
            axios.get(this.baseUrl + '/bmr-vip/' + club_id + '/' + insta + '/' + date).then(function (res) {
                if (res.status === 204) {
                    return axios.post(_this12.baseUrl + '/bmr-vip/' + club_id + '/' + insta + '/' + expiry_date + '/' + limit);
                } else {
                    _this12.modalPage.unverified = true;
                    _this12.modalPage.showButton = false;
                    return { status: 0 };
                }
            }).then(function (res) {
                if (res.status === 201) {
                    _this12.modalPage.verified = true;
                    _this12.modalPage.showButton = false;
                }
            }).finally(function () {
                _this12.modalPage.loader = false;
            });
        }
    }
});

var homeTwo = Vue.component('homeTwo', {
    template: '#home-two',
    mixins: [serviceProvider],
    data: function data() {
        return {
            showModal: false,
            modalInput: '',
            modalType: '',
            hostPartyIsMobile: false,
            showHostMobile: false,
            hostChecked: false,
            partyModalLoader: false,
            partyModalError: false,
            toastInstance: undefined,
            mobileOffImage: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik01Mi45MjMwOCwwYy0xMS4yNDA5OSwwIC0xOS44NDYxNSw4LjYwNTE3IC0xOS44NDYxNSwxOS44NDYxNXY2LjQwODY1bC0xOC4zOTkwNCwtMTguMzk5MDRjLTEuMjQwMzgsLTEuMzE3OTEgLTIuOTQ1OTEsLTIuMDQxNDcgLTQuNzU0ODEsLTIuMDY3MzFjLTIuNzEzMzQsLTAuMDUxNjggLTUuMjE5OTUsMS41NTA0OCAtNi4yNTM2LDQuMDU3MDljLTEuMDU5NSwyLjUwNjYyIC0wLjQ2NTE1LDUuNDI2NjkgMS40OTg3OSw3LjMxMzFsMTQ4LjIyNTk2LDE0Ny42MDU3N2MxLjYwMjE3LDEuOTYzOTQgNC4xNjA0NiwyLjg2ODM5IDYuNjQxMjIsMi4yOTk4OGMyLjQ1NDkzLC0wLjU2ODUxIDQuMzkzMDMsLTIuNTA2NjEgNC45NjE1NCwtNC45NjE1NGMwLjU2ODUxLC0yLjQ4MDc3IC0wLjMzNTk0LC01LjAzOTA2IC0yLjI5OTg4LC02LjY0MTIybC0xNy4xNTg2NSwtMTcuMTU4NjV2LTExOC40NTY3M2MwLC0xMS4yNDA5OSAtOC42MDUxNywtMTkuODQ2MTUgLTE5Ljg0NjE1LC0xOS44NDYxNXpNODIuNjkyMzEsNi42MTUzOGgxMy4yMzA3N2MxLjk4OTc4LDAgMy4zMDc2OSwxLjMxNzkxIDMuMzA3NjksMy4zMDc2OWMwLDEuOTg5NzggLTEuMzE3OTEsMy4zMDc2OSAtMy4zMDc2OSwzLjMwNzY5aC0xMy4yMzA3N2MtMS45ODk3OCwwIC0zLjMwNzY5LC0xLjMxNzkxIC0zLjMwNzY5LC0zLjMwNzY5YzAsLTEuOTg5NzggMS4zMTc5MSwtMy4zMDc2OSAzLjMwNzY5LC0zLjMwNzY5ek00OS42MTUzOCwxOS44NDYxNWg3OS4zODQ2MmMxLjk4OTc4LDAgMy4zMDc2OSwxLjMxNzkxIDMuMzA3NjksMy4zMDc2OXYxMDEuOTE4MjdsLTg2LC04NS41ODY1NHYtMTYuMzMxNzNjMCwtMS45ODk3OCAxLjMxNzkxLC0zLjMwNzY5IDMuMzA3NjksLTMuMzA3Njl6TTMzLjA3NjkyLDYzLjQ2NjM1djg4LjY4NzVjMCwxMS4yNDA5OSA4LjYwNTE3LDE5Ljg0NjE1IDE5Ljg0NjE1LDE5Ljg0NjE1aDcyLjc2OTIzYzQuNjI1NiwwIDguNjgyNjksLTEuMjkyMDYgMTEuOTkwMzgsLTMuOTI3ODhsLTI5LjE0OTA0LC0yOS4xNDkwNGgtNTguOTE4MjdjLTEuOTg5NzgsMCAtMy4zMDc2OSwtMS4zMTc5MSAtMy4zMDc2OSwtMy4zMDc2OXYtNTguOTE4Mjd6TTg5LjMwNzY5LDE0Ni43Nzg4NWM0LjYyNTYsMCA4LjY4MjY5LDQuMDU3MDkgOC42ODI2OSw4LjY4MjY5YzAsNC42MjU2IC00LjA1NzA5LDguNjgyNjkgLTguNjgyNjksOC42ODI2OWMtNC42MjU2LDAgLTguNjgyNjksLTQuMDU3MDkgLTguNjgyNjksLTguNjgyNjljMCwtNC42MjU2IDQuMDU3MDksLTguNjgyNjkgOC42ODI2OSwtOC42ODI2OXoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=='
        };
    },
    computed: {
        partyCards: function partyCards() {
            return [{
                name: 'host party',
                icons: [{
                    img: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0zOC44MTM3MSwxNS4xOTQ3MWMtMC4wNzc1MywwLjA1MTY5IC0wLjE1NTA1LDAuMTI5MjEgLTAuMjMyNTgsMC4yMDY3M2MwLjQ5MDk5LC0wLjUxNjgzIDEuMTg4NzEsLTEuMDU5NDkgMS42MjgwMSwtMS4zNjk1OWMxMy4zMzQxMywtOC42NTY4NSAyOC43MzU1OCwtMTMuMjgyNDYgNDUuODE2NzEsLTEzLjI4MjQ2YzE1Ljk2OTk2LDAgMzAuOTMyMSw0LjQxODg3IDQzLjY5NzcyLDEyLjA5Mzc1YzAuOTMwMjksMC41NDI2NyAzLjQ2Mjc0LDIuMjc0MDQgNC43NTQ4MSwzLjg1MDM3Yy0xMi4zMjYzMiwtMTMuNTkyNTUgLTQ4LjU1NTg5LDE1LjU4MjMzIC00OC41NTU4OSwxNS41ODIzM2MtMTIuNTA3MjEsLTkuNjY0NjYgLTI0LjAzMjQ1LC0xNi4yNTQyMSAtMzIuNjExNzgsLTE4LjYwNTc3Yy03LjE4MzksLTEuOTYzOTQgLTEyLjE0NTQ0LC0wLjMxMDEgLTE0LjQ5Njk5LDEuNTI0NjR6TTE0OC40MzI2OSwyOC4wMzc4NmMtMC4zNjE3OCwtMC40MTM0NiAtMC43NzUyNCwtMC44MDEwOCAtMS4xNjI4NiwtMS4yNDAzOGMtMy4xMDA5NiwtMy40MTEwNiAtNi45MjU0OCwtNC4yMzc5OCAtMTAuMzg4MjIsLTQuMDMxMjVjLTMuMTUyNjQsMS4wMDc4MSAtMTcuNjc1NDgsNi4yMjc3NyAtMzUuNTU3NjksMjMuMTI4MDFjMCwwIDIwLjEzMDQxLDE5LjU4Nzc0IDMyLjQ4MjU4LDM5LjYxNDc4YzEyLjMyNjMyLDIwLjAyNzA0IDE5LjY5MTEsMzUuNzY0NDIgMTUuMTY4ODcsNTcuNjAwMzdjMTMuNzQ3NiwtMTUuMTE3MTkgMjIuMTIwMTksLTM1LjE5NTkyIDIyLjEyMDE5LC01Ny4yNjQ0MmMwLC0yMi4zMDEwOCAtOC41NzkzMywtNDIuNjM4MjIgLTIyLjY2Mjg2LC01Ny44MDcxek0xMTcuNjgxNDksOTQuMDYyNWMtNS40NTI1MywtNi4xNTAyNCAtMTMuNTkyNTUsLTE0LjkxMDQ2IC0yNC4zMTY3MSwtMjUuNjA4NzhjLTIuMzUxNTYsLTIuMzI1NzIgLTQuODMyMzMsLTQuNzU0ODEgLTcuNDQyMzEsLTcuMjg3MjZjMCwwIC0zLjkyNzg4LDMuOTI3ODggLTkuMDE4NjMsOS4wOTYxNXYtMC4wMjU4NGMtNi41Mzc4Niw2LjYxNTM4IC0xNS4wMTM4MiwxNS4yMjA1NSAtMTkuNzE2OTUsMjAuMjU5NjJjLTguMzcyNiw4Ljk0MTEgLTMyLjM3OTIxLDM3LjAwNDgxIC0zMy43MjI5Niw1Mi43NDIxOWMwLDAgLTUuMzQ5MTYsLTEyLjQ4MTM3IDYuMzgyODEsLTQxLjI2ODYzYzcuNjQ5MDQsLTE4LjgzODM1IDMwLjc3NzA0LC00Ny4wODI5NCA0MC40NDE3MSwtNTYuMzA4MjljMCwwIC04LjgzNzc0LC05LjY5MDUxIC0xOS44OTc4MywtMTYuNDA5MjZsLTAuMDc3NTMsLTAuMDI1ODRjMCwwIC0wLjEyOTIxLC0wLjEwMzM3IC0wLjMxMDEsLTAuMjA2NzNjLTUuMzIzMzIsLTMuMTc4NDkgLTExLjE2MzQ2LC01LjYzMzQyIC0xNi43NDUxOSwtNS45NjkzNWMtNS43MTA5NCwwLjQxMzQ2IC05LjMyODcyLDQuNTk5NzYgLTkuMzI4NzIsNC41OTk3NmMtMTQuMjkwMjcsMTUuMjIwNTUgLTIzLjAyNDY0LDM1LjY4NjkgLTIzLjAyNDY0LDU4LjIyMDU1YzAsNDcuMDA1NDEgMzguMDkwMTQsODUuMDk1NTUgODUuMTIxMzksODUuMDk1NTVjMjQuOTM2OSwwIDQ3LjM2NzE5LC0xMC43NSA2Mi45NDk1MiwtMjcuODU2OTdjMCwtMC4wMjU4NSAtMS43ODMwNSwtMTEuMjQwOTkgLTEzLjIzMDc3LC0yNy4zNDAxNWMtMi43MTMzNCwtMy43NzI4MyAtMTIuNTMzMDUsLTE1LjUzMDY1IC0xOC4wNjMxLC0yMS43MDY3M3oiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==',
                    name: 'xbox',
                    width: '9.7%'
                }, {
                    img: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik02Ni4xNTM4NSwyMy4xNTM4NXYxMjEuMzUwOTZsMjYuMjU0ODEsOC4wNjI1di0xMDEuMjk4MDhjMCwtMi42ODc1IDAuMzM1OTQsLTQuNjUxNDQgMS40NDcxMiwtNS43ODg0NmMxLjExMTE4LC0xLjU1MDQ4IDIuMTQ0ODMsLTEuNzA1NTMgMy43MjExNSwtMS4wMzM2NWMzLjc5ODY4LDEuMTExMTggNS41ODE3Myw0LjU0ODA4IDUuNTgxNzMsMTAuMTI5ODF2NDAuNzI1OTZjOC41MDE4LDQuMDMxMjUgMTYuMTI1LDQuNDQ0NzEgMjEuNzA2NzMsMC4yMDY3M2M1LjgxNDMsLTQuMDMxMjUgOC44ODk0MiwtMTEuMTg5MyA4Ljg4OTQyLC0yMS45MTM0NmMwLC0xMS4xODkzIC0yLjA5MzE1LC0xOS44MjAzMSAtNy4wMjg4NSwtMjUuNDI3ODhjLTQuNDcwNTUsLTYuMDIxMDMgLTEyLjM1MjE2LC0xMC44NTMzNyAtMjMuOTgwNzcsLTE0Ljg4NDYyYy0xNC41MjI4MywtNC43MDMxMiAtMjYuNzQ1NzksLTguMDYyNSAtMzYuNTkxMzUsLTEwLjEyOTgxek01OC4wOTEzNSw5Ni41NDMyN2wtNS4xNjgyNywxLjY1Mzg1bC0zMi40NTY3MywxMS41NzY5MmwtNS41ODE3MywyLjI3NDA0Yy04LjUwMTgsMy41NjYxMSAtMTMuMDQ5ODgsNy4zOTA2MyAtMTIuODE3MzEsMTAuNzVjMC40MzkzLDQuOTA5ODYgNi4wNDY4OCw4LjQ3NTk2IDE2LjEyNSwxMS4xNjM0NmMxMy4wNzU3MiwzLjUxNDQyIDI2LjMzMjMzLDQuMzE1NTEgMzkuODk5MDQsMi4yNzQwNHYtMTMuODUwOTZsLTUuMTY4MjcsMS44NjA1OGwtNS43ODg0NiwyLjI3NDA0bC05LjMwMjg4LDEuODYwNThsLTguODg5NDIsLTEuMDMzNjVjLTEuNzgzMDUsLTEuMTM3MDIgLTIuMzc3NCwtMi40MDMyNCAtMS4yNDAzOCwtMy41MTQ0MmMxLjExMTE4LC0wLjY3MTg3IDIuNzY1MDMsLTEuNjAyMTYgNC41NDgwOCwtMi4yNzQwNGw1Ljk5NTE5LC0yLjA2NzMxbDE5Ljg0NjE1LC03LjAyODg1ek0xMzMuMzQxMzUsMTAyLjk1MTkyYy0yLjQyOTA4LC0wLjEwMzM3IC00Ljg4NDAxLDAuMTAzMzcgLTcuMjM1NTgsMC4yMDY3M2MtOC42ODI2OSwwLjE4MDg5IC0xNy41OTc5NiwxLjYwMjE3IC0yNi44NzUsNC41NDgwOHYxNi4zMzE3M2wxOC4zOTkwNCwtNi40MDg2NWw5LjUwOTYyLC0zLjMwNzY5YzAsMCAzLjU5MTk1LC0wLjk1NjEzIDYuMjAxOTIsLTEuNjUzODVjNC4wMDU0MSwtMS4wNTk0OSA4LjI2OTIzLDAuNDEzNDYgOC4yNjkyMywwLjQxMzQ2YzIuNDU0OTMsMC4yMDY3MyAzLjY5NTMxLDEuMTM3MDIgNC4xMzQ2MiwyLjI3NDA0YzAuNDM5MywxLjM0Mzc1IC0xLjE4ODcsMi4zNzc0IC00LjU0ODA4LDMuNTE0NDJsLTguMjY5MjMsMy4zMDc2OWwtMzMuNjk3MTIsMTEuOTkwMzh2MTUuOTE4MjdsMTUuNzExNTQsLTUuNTgxNzNsMzcuODMxNzMsLTEzLjQzNzVsNC41NDgwOCwtMi4wNjczMWM4Ljk2Njk1LC0zLjM1OTM3IDEzLjA0OTg4LC02Ljg5OTY0IDEyLjYxMDU4LC0xMS4zNzAxOWMtMC4yMzI1NywtNC4yNjM4MiAtNS4zMjMzMSwtNy42MjMyIC0xNC4yNjQ0MiwtMTAuNTQzMjdjLTcuNTQ1NjcsLTIuNTMyNDUgLTE1LjA2NTUxLC0zLjg1MDM2IC0yMi4zMjY5MiwtNC4xMzQ2MnoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==',
                    name: 'playstation',
                    width: '10%'
                }, {
                    img: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0wLDI0LjA4djExMC4wOGgxNzJ2LTExMC4wOHpNMzcuODQsMTQxLjA0Yy0xLjg5NDY5LDAgLTMuNDQsMS41MzE4OCAtMy40NCwzLjQ0YzAsMS45MDgxMyAxLjU0NTMxLDMuNDQgMy40NCwzLjQ0aDk2LjMyYzEuOTA4MTMsMCAzLjQ0LC0xLjUzMTg3IDMuNDQsLTMuNDRjMCwtMS45MDgxMiAtMS41MzE4NywtMy40NCAtMy40NCwtMy40NHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==',
                    name: 'tv',
                    width: '10%'
                }, {
                    img: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0yMC40NzIwMywxMy43ODAxNmMtMy42MTc1NCwwIC02LjY5MTg3LDIuOTYxODQgLTYuNjkxODcsNi42MjQ2OXY4Ni4yNzU0N2MwLDEuMjMxOTkgMC4zMjkwNCwyLjM1Mjc2IDAuODY2NzIsMy4zMzI1Yy0wLjIyNDYsMC4zODkxIC0wLjQyNzczLDAuODA2ODYgLTAuNTc3ODEsMS4yODMyOGMtMC4wMDIyNCwwLjAwMjI0IC0wLjAwNDQ4LDAuMDA0NDggLTAuMDA2NzIsMC4wMDY3MmwtOS43MDg1OSwzMC45NDY1NmMtMC41NDQ3NywwLjYxNTQyIC0wLjg0NTg0LDEuNDA4NzMgLTAuODQ2NTYsMi4yMzA2M3YxMC4zMmMwLDMuNjQ0NjYgMi45NDI4Nyw2LjgxMjgxIDYuNjY1LDYuODEyODFoMTUxLjY1NTYzYzMuNzIyMTIsMCA2LjY2NSwtMy4xNjgxNSA2LjY2NSwtNi44MTI4MXYtMTAuMzJjLTAuMDAwNzIsLTAuODIxOSAtMC4zMDE3OSwtMS42MTUyIC0wLjg0NjU2LC0yLjIzMDYzbC05LjcwODYsLTMwLjk0NjU2Yy0wLjE1MDkyLC0wLjQ4MzUxIC0wLjM1Njk3LC0wLjkwMzI0IC0wLjU4NDUzLC0xLjI5NjcyYzAuNTM1ODksLTAuOTc4NTYgMC44NjY3MiwtMi4wOTU5OCAwLjg2NjcyLC0zLjMyNTc4di04Ni4yNzU0N2MwLC0zLjY2Mjg0IC0zLjA3NDMzLC02LjYyNDY5IC02LjY5MTg4LC02LjYyNDY5ek0yMC42MTk4NCwyMC42MTk4NGgxMzAuNzYwMzF2ODYuMDYwNDdjMCwtMC4zMzUwNiAtMC4yNzAxNywtMC4wMjAxNiAtMC4wMjAxNSwtMC4wMjAxNmgtMTMwLjcyYzAuMjUwMTUsMCAtMC4wMjAxNiwtMC4zMTUwNCAtMC4wMjAxNiwwLjAyMDE2ek0zNy44NCwxMTMuNTJoOTYuMzJsMy40NCwxMC4zMmgtMTAzLjJ6TTcyLjI0LDEzMC43MmgyNy41MmwzLjQ0LDYuODhoLTM0LjR6TTEwLjI1MjgxLDE0Ny44NTI4MWgxNTEuNDk0Mzd2Ni45NDcxOWMwLDAuMDU0OCAwLjAwMzI2LDAuMDU4NzMgMC4wMDY3MiwwLjA2NzE5aC0xNTEuNTA3ODFjMC4wMDM0NiwtMC4wMDg0NiAwLjAwNjcyLC0wLjAxMjQgMC4wMDY3MiwtMC4wNjcxOXoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==',
                    name: 'laptop',
                    width: '10%'
                }, {
                    img: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik01OS4xMjUsMS4zNDM3NWMtOS42NzUsMCAtMTcuNDY4NzUsNy43OTM3NSAtMTcuNDY4NzUsMTcuNDY4NzV2MjAuMTU2MjVjMCwyLjI4NDM3IDEuNzQ2ODcsNC4wMzEyNSA0LjAzMTI1LDQuMDMxMjVjMi4yODQzOCwwIDQuMDMxMjUsLTEuNzQ2ODggNC4wMzEyNSwtNC4wMzEyNXYtMjAuMTU2MjVjMCwtNS4yNDA2MiA0LjE2NTYyLC05LjQwNjI1IDkuNDA2MjUsLTkuNDA2MjVoOTQuMDYyNWM1LjI0MDYyLDAgOS40MDYyNSw0LjE2NTYzIDkuNDA2MjUsOS40MDYyNXYxMzQuMzc1YzAsNS4yNDA2MiAtNC4xNjU2Myw5LjQwNjI1IC05LjQwNjI1LDkuNDA2MjVoLTI2Ljg3NWMtMi4yODQzNywwIC00LjAzMTI1LDEuNzQ2ODcgLTQuMDMxMjUsNC4wMzEyNWMwLDIuMjg0MzggMS43NDY4OCw0LjAzMTI1IDQuMDMxMjUsNC4wMzEyNWgyNi44NzVjOS42NzUsMCAxNy40Njg3NSwtNy43OTM3NSAxNy40Njg3NSwtMTcuNDY4NzV2LTEzNC4zNzVjMCwtOS42NzUgLTcuNzkzNzUsLTE3LjQ2ODc1IC0xNy40Njg3NSwtMTcuNDY4NzV6TTMyLjI1LDU1LjA5Mzc1Yy05LjY3NSwwIC0xNy40Njg3NSw3Ljc5Mzc1IC0xNy40Njg3NSwxNy40Njg3NXY4MC42MjVjMCw5LjY3NSA3Ljc5Mzc1LDE3LjQ2ODc1IDE3LjQ2ODc1LDE3LjQ2ODc1aDQwLjMxMjVjOS42NzUsMCAxNy40Njg3NSwtNy43OTM3NSAxNy40Njg3NSwtMTcuNDY4NzV2LTgwLjYyNWMwLC05LjY3NSAtNy43OTM3NSwtMTcuNDY4NzUgLTE3LjQ2ODc1LC0xNy40Njg3NXpNMzIuMjUsNjMuMTU2MjVoNDAuMzEyNWM1LjI0MDYyLDAgOS40MDYyNSw0LjE2NTYzIDkuNDA2MjUsOS40MDYyNXY4MC42MjVjMCw1LjI0MDYyIC00LjE2NTYzLDkuNDA2MjUgLTkuNDA2MjUsOS40MDYyNWgtNDAuMzEyNWMtNS4yNDA2MiwwIC05LjQwNjI1LC00LjE2NTYzIC05LjQwNjI1LC05LjQwNjI1di04MC42MjVjMCwtNS4yNDA2MiA0LjE2NTYzLC05LjQwNjI1IDkuNDA2MjUsLTkuNDA2MjV6TTEwNi4xNTYyNSwxNTQuNjMwOThjLTEuMDQxNDEsMCAtMi4wODIyOSwwLjM3MTEgLTIuODIxMzUsMS4xMTAxN2MtMC44MDYyNSwwLjgwNjI1IC0xLjIwOTksMS43NDYzNSAtMS4yMDk5LDIuODIxMzVjMCwxLjA3NSAwLjQwMzY1LDIuMTQ5NDggMS4yMDk5LDIuODIxMzVsMC41MzgwMiwwLjUzODAyYzAuMjY4NzUsMC4xMzQzOCAwLjUzNzUsMC4yNjk4IDAuNjcxODgsMC40MDQxN2MwLjI2ODc1LDAuMTM0MzggMC41MzY5OCwwLjEzMzMzIDAuODA1NzMsMC4yNjc3YzAuMjY4NzUsMCAwLjUzNjk3LDAuMTMzODUgMC44MDU3MiwwLjEzMzg1YzAuMjY4NzUsMCAwLjUzNjk3LDAuMDAwNTIgMC44MDU3MiwtMC4xMzM4NWMwLjI2ODc1LDAgMC41MzY5OCwtMC4xMzMzMyAwLjgwNTczLC0wLjI2NzdjMC4yNjg3NSwtMC4xMzQzOCAwLjUzNzUsLTAuMjY5OCAwLjY3MTg4LC0wLjQwNDE3YzAuMjY4NzUsLTAuMTM0MzggMC40MDM2NSwtMC4yNjkyNyAwLjUzODAyLC0wLjUzODAyYzAuODA2MjUsLTAuODA2MjUgMS4yMDk5LC0xLjc0NjM1IDEuMjA5OSwtMi44MjEzNWMwLC0xLjA3NSAtMC40MDM2NSwtMi4xNDk0OCAtMS4yMDk5LC0yLjgyMTM1Yy0wLjczOTA2LC0wLjczOTA2IC0xLjc3OTk0LC0xLjExMDE3IC0yLjgyMTM1LC0xLjExMDE3eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+',
                    name: 'mobile-tablet',
                    width: '10%'
                }],
                classes: { 'host-card': true, 'shake': this.hostPartyIsMobile, 'fadeInUp': !this.hostPartyIsMobile && !this.hostChecked },
                placeholder: 'Enter Party Name',
                inputStyle: 'text-transform: capitalize',
                footerStyle: 'display: inline-flex; width: 100%; justify-content: space-evenly;',
                maxLength: 26

            }, {
                name: 'join party',
                icons: [{
                    img: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxNzIgMTcyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik01OS4xMjUsMS4zNDM3NWMtOS42NzUsMCAtMTcuNDY4NzUsNy43OTM3NSAtMTcuNDY4NzUsMTcuNDY4NzV2MjAuMTU2MjVjMCwyLjI4NDM3IDEuNzQ2ODcsNC4wMzEyNSA0LjAzMTI1LDQuMDMxMjVjMi4yODQzOCwwIDQuMDMxMjUsLTEuNzQ2ODggNC4wMzEyNSwtNC4wMzEyNXYtMjAuMTU2MjVjMCwtNS4yNDA2MiA0LjE2NTYyLC05LjQwNjI1IDkuNDA2MjUsLTkuNDA2MjVoOTQuMDYyNWM1LjI0MDYyLDAgOS40MDYyNSw0LjE2NTYzIDkuNDA2MjUsOS40MDYyNXYxMzQuMzc1YzAsNS4yNDA2MiAtNC4xNjU2Myw5LjQwNjI1IC05LjQwNjI1LDkuNDA2MjVoLTI2Ljg3NWMtMi4yODQzNywwIC00LjAzMTI1LDEuNzQ2ODcgLTQuMDMxMjUsNC4wMzEyNWMwLDIuMjg0MzggMS43NDY4OCw0LjAzMTI1IDQuMDMxMjUsNC4wMzEyNWgyNi44NzVjOS42NzUsMCAxNy40Njg3NSwtNy43OTM3NSAxNy40Njg3NSwtMTcuNDY4NzV2LTEzNC4zNzVjMCwtOS42NzUgLTcuNzkzNzUsLTE3LjQ2ODc1IC0xNy40Njg3NSwtMTcuNDY4NzV6TTMyLjI1LDU1LjA5Mzc1Yy05LjY3NSwwIC0xNy40Njg3NSw3Ljc5Mzc1IC0xNy40Njg3NSwxNy40Njg3NXY4MC42MjVjMCw5LjY3NSA3Ljc5Mzc1LDE3LjQ2ODc1IDE3LjQ2ODc1LDE3LjQ2ODc1aDQwLjMxMjVjOS42NzUsMCAxNy40Njg3NSwtNy43OTM3NSAxNy40Njg3NSwtMTcuNDY4NzV2LTgwLjYyNWMwLC05LjY3NSAtNy43OTM3NSwtMTcuNDY4NzUgLTE3LjQ2ODc1LC0xNy40Njg3NXpNMzIuMjUsNjMuMTU2MjVoNDAuMzEyNWM1LjI0MDYyLDAgOS40MDYyNSw0LjE2NTYzIDkuNDA2MjUsOS40MDYyNXY4MC42MjVjMCw1LjI0MDYyIC00LjE2NTYzLDkuNDA2MjUgLTkuNDA2MjUsOS40MDYyNWgtNDAuMzEyNWMtNS4yNDA2MiwwIC05LjQwNjI1LC00LjE2NTYzIC05LjQwNjI1LC05LjQwNjI1di04MC42MjVjMCwtNS4yNDA2MiA0LjE2NTYzLC05LjQwNjI1IDkuNDA2MjUsLTkuNDA2MjV6TTEwNi4xNTYyNSwxNTQuNjMwOThjLTEuMDQxNDEsMCAtMi4wODIyOSwwLjM3MTEgLTIuODIxMzUsMS4xMTAxN2MtMC44MDYyNSwwLjgwNjI1IC0xLjIwOTksMS43NDYzNSAtMS4yMDk5LDIuODIxMzVjMCwxLjA3NSAwLjQwMzY1LDIuMTQ5NDggMS4yMDk5LDIuODIxMzVsMC41MzgwMiwwLjUzODAyYzAuMjY4NzUsMC4xMzQzOCAwLjUzNzUsMC4yNjk4IDAuNjcxODgsMC40MDQxN2MwLjI2ODc1LDAuMTM0MzggMC41MzY5OCwwLjEzMzMzIDAuODA1NzMsMC4yNjc3YzAuMjY4NzUsMCAwLjUzNjk3LDAuMTMzODUgMC44MDU3MiwwLjEzMzg1YzAuMjY4NzUsMCAwLjUzNjk3LDAuMDAwNTIgMC44MDU3MiwtMC4xMzM4NWMwLjI2ODc1LDAgMC41MzY5OCwtMC4xMzMzMyAwLjgwNTczLC0wLjI2NzdjMC4yNjg3NSwtMC4xMzQzOCAwLjUzNzUsLTAuMjY5OCAwLjY3MTg4LC0wLjQwNDE3YzAuMjY4NzUsLTAuMTM0MzggMC40MDM2NSwtMC4yNjkyNyAwLjUzODAyLC0wLjUzODAyYzAuODA2MjUsLTAuODA2MjUgMS4yMDk5LC0xLjc0NjM1IDEuMjA5OSwtMi44MjEzNWMwLC0xLjA3NSAtMC40MDM2NSwtMi4xNDk0OCAtMS4yMDk5LC0yLjgyMTM1Yy0wLjczOTA2LC0wLjczOTA2IC0xLjc3OTk0LC0xLjExMDE3IC0yLjgyMTM1LC0xLjExMDE3eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+',
                    name: 'mobile-tablet',
                    width: '10%'
                }],
                classes: { 'join-card': true, 'fadeInUp': true },
                placeholder: 'Party code',
                inputStyle: 'text-transform: uppercase',
                footerStyle: '',
                maxLength: 5
            }];
        },
        partyModal: function partyModal() {
            switch (this.modalType) {
                case 'host party':
                    return this.partyCards[0];
                    break;
                case 'join party':
                    return this.partyCards[1];
                    break;
                default:
                    return {};
            }
        },
        modalInputTrimmed: function modalInputTrimmed() {
            return this.modalInput.trim();
        },
        isJoinParty: function isJoinParty() {
            return this.modalType.includes('join');
        },
        isHostParty: function isHostParty() {
            return this.modalType.includes('host');
        }
    },
    mounted: function mounted() {
        this.autoJoinParty();
    },
    methods: {
        startParty: function startParty() {
            var _this13 = this;

            this.partyModalError = false;
            this.partyModalLoader = true;
            // this.$noSleep = new NoSleep()
            // this.$noSleep.enable()
            var fetchParams = '?name=' + this.modalInputTrimmed;
            fetch('/startParty' + fetchParams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                return res.json();
            }).then(function (res) {
                var party = {
                    name: res.name,
                    id: res.code,
                    client_type: 'jukebox',
                    image: _this13.appLogoImage
                };
                _this13.$store.commit('clubs', [party]);
                _this13.$router.push('/dj/' + party.id);
                _this13.partyModalLoader = false;
            }).catch(function (error) {
                console.log(new Error(error));
                _this13.partyModalError = true;
                _this13.partyModalLoader = false;
            });
        },
        joinParty: function joinParty() {
            var _this14 = this;

            this.partyModalError = false;
            this.partyModalLoader = true;
            var fetchParams = '?code=' + this.modalInputTrimmed;
            fetch('/startParty' + fetchParams, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                return res.json();
            }).then(function (res) {
                var party = {
                    name: res.name,
                    id: res.code,
                    client_type: 'jukebox',
                    image: _this14.appLogoImage
                };
                _this14.$store.commit('clubs', [party]);
                _this14.$router.push('/request/' + party.id);
                _this14.partyModalLoader = false;
            }).catch(function (error) {
                console.log(new Error(error));
                _this14.partyModalError = true;
                _this14.partyModalLoader = false;
            });
        },
        submitModalInput: function submitModalInput() {
            switch (this.modalType) {
                case 'host party':
                    this.startParty();
                    break;
                case 'join party':
                    this.joinParty();
                    break;
                default:
            }
        },
        closeModal: function closeModal() {
            this.showModal = false;
        },
        openModal: function openModal(type) {
            this.partyModalError = false;
            this.modalInput = '';
            this.modalType = type;
            M.Toast.dismissAll();
            switch (this.modalType) {
                case 'host party':
                    // if (this.isMobileOrTablet()) {
                    //     this.showHostMobile = false
                    //     this.hostChecked = true
                    //     this.hostPartyIsMobile = true
                    //     if (this.toastInstance === undefined){
                    //         this.toastInstance = M.toast({
                    //             html: 'Mobile/Tablet not supported currently. Please host party with laptop, smart TV & gaming console browsers.',
                    //             displayLength: 8000,
                    //             completeCallback: () => {
                    //                 this.toastInstance = undefined
                    //             }
                    //         })
                    //     }
                    //     setTimeout(() => {
                    //         this.hostPartyIsMobile = false
                    //         this.showHostMobile = true
                    //     }, 1500)
                    //     return
                    // }
                    this.showModal = true;
                    break;
                case 'join party':
                    this.showModal = true;
                    break;
                default:
            }
        },
        inputTyping: function inputTyping() {
            if (this.partyModalError) {
                this.partyModalError = false;
            }
        },
        autoJoinParty: function autoJoinParty() {
            var partyCode = this.$store.state.partyCodeFromLink;
            if (partyCode !== '') {
                this.modalType = 'join party';
                this.modalInput = partyCode;
                this.showModal = true;
                this.$store.commit('joinParty', '');
            }
        }
    }
});

var spotify = Vue.component('spotify', {
    template: '#spotify',
    mixins: [serviceProvider, jukeboxMixin],
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
            },
            djData: {
                handle: '',
                image: '',
                name: ''
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
        },
        isDjHere: function isDjHere() {
            var routeId = this.$route.params.id;
            if (routeId === this.$store.state.badge.appName && this.$route.path.includes('request')) {
                return true;
            }
            return false;
        },
        displaySearchResult: function displaySearchResult() {
            var _this15 = this;

            //Used in conjuction with v-html for html entities
            return this.searchResult.map(function (item) {
                item.song = _this15.$root.$options.filters.songName(item.song);
                item.artist = _this15.$root.$options.filters.songName(item.artist);
                return item;
            });
        }
    },
    methods: {
        searchTrack: function searchTrack() {
            var _this16 = this;

            if (this.safe(this.searchInput)) {
                if (this.club.client_type.includes('jukebox')) {
                    this.youtube(this.searchInput);
                    return;
                }
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
                        _this16.searchResult = res.tracks.items.map(function (item) {
                            var obj = {};
                            obj.image = item.album.images[1].url;
                            obj.song = item.name;
                            obj.artist = item.artists.map(function (item) {
                                return item.name;
                            }).join(', ');
                            obj.id = item.id;
                            return obj;
                        });
                        _this16.noResult = _this16.searchResult.length === 0 ? true : false;
                        _this16.pendingSearch = [];
                        _this16.loader = false;
                        _this16.scrollToResultTop();
                        //this.searchInput = ''
                    } else if (res === 'fail') {
                        _this16.pendingSearch.push(_this16.searchInput);
                        _this16.socket.emit('newTokenPlease');
                    }
                }).finally(function (res) {
                    var payload = { trackTask: 'search', search: _this16.searchInput, timestamp: moment().toISOString(), domain: location.host };
                    _this16.trackAction(payload);
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
            var _this17 = this;

            if (!this.safe(payload.inProgress)) {
                payload.inProgress = true;
                this.getVipStatus(this.vipMode.insta).then(function () {
                    if (_this17.isVip) {
                        _this17.sendRequest(payload);
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
        },
        youtube: function youtube(query) {
            var _this18 = this;

            this.loader = true;
            var searchUrl = 'https://www.googleapis.com/youtube/v3/search';
            var key = 'AIzaSyCZVImtMr37nqi5MPRuNtvr0D-kp0Eq0Bk';
            var maxTime = 247; // 4 minutes - if longer than 4 minutes then set maxtime
            var params = new URLSearchParams({
                q: query + ' audio',
                part: 'snippet',
                maxResults: 5,
                key: key
            });
            fetch(searchUrl + '?' + params.toString()).then(function (response) {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(function (res) {
                _this18.searchResult = res.items.map(function (item) {
                    var obj = {};
                    obj.image = item.snippet.thumbnails.default.url;
                    obj.song = item.snippet.title.split(' - ')[1];
                    obj.artist = item.snippet.title.split(' - ')[0];
                    obj.id = item.id.videoId;
                    return obj;
                });
                _this18.noResult = _this18.searchResult.length === 0 ? true : false;
                _this18.pendingSearch = [];
                _this18.loader = false;
                _this18.scrollToResultTop();
                console.log(res, 'am done');
            });
        }
    },
    watch: {
        isVip: function isVip(newValue, oldValue) {
            this.appColorScheme(newValue);
            console.log('fired first', newValue);
        }
    },
    created: function created() {
        var _this19 = this;

        this.validateId();
        if (this.isVip) this.getVipStatus(this.vipMode.insta);
        this.socket.on('connect', function (data) {
            _this19.isConnected = true;
            _this19.socket.emit('audience', { appName: _this19.appName, id: _this19.socket.id, task: 'population' });
            _this19.socket.emit('getDj', { appName: _this19.appName });
            console.log(data, 'connected my nigga');
        });
        this.socket.on('disconnect', function (data) {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            _this19.isConnected = false;
        });
        this.socket.on('reconnect', function (data) {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            _this19.isConnected = true;
            var payload = { appName: _this19.appName };
            _this19.socket.emit('getDj', payload);
        });
        //this.socket.emit('join','we in this bitch son');
        this.socket.on('sendMetrics', function (data) {
            //console.log(data,'metric data');
            if (data.appName === _this19.appName && 'task' in data && data.task === 'request') {
                _this19.metrics = data;
                //this.showMetrics = true;
            }
        });
        this.socket.on('newToken', function (data) {
            _this19.$store.commit('accessToken', data);
            if (_this19.pendingSearch.length > 0) {
                _this19.searchTrack();
            }
        });
        this.socket.on('djData', function (data) {
            _this19.djData.name = data.djData.name;
            _this19.djData.handle = data.djData.handle;
            _this19.getInstaImage(data.djData.handle).then(function (res) {
                var payload = { appName: _this19.appName, image: res };
                _this19.$store.commit('badgeImage', payload);
                _this19.djData.image = res;
            }).catch(function (error) {
                console.warn(error);
            });
        });
        this.socket.on('noDj', function (data) {
            _this19.$store.commit('noDj');
        });
        this.socket.on('sessionOver', function (data) {
            if (_this19.appName.toLowerCase() === data) {
                var appName = _this19.appName;
                _this19.$router.replace('/home');
                M.toast({
                    html: 'Something went wrong. Party room with code [' + appName + '] no longer exists. Please join a new party room.',
                    displayLength: 60000
                });
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
    mixins: [serviceProvider, jukeboxMixin],
    data: function data() {
        return {
            requestBasket: [],
            population: [],
            pendingTrackDetails: [],
            jukeBoxList: [],
            autoPlayList: [],
            allPlayList: [],
            allPlayListMap: new Map(),
            genreOptions: [],
            isConnected: false,
            jukeBoxInstance: undefined,
            fadeOutIntervalInstance: undefined,
            musicNotes: ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'],
            playerStates: ['ended', 'playing', 'paused', 'buffering', 'video cued'],
            endAtSeconds: 240,
            playing: false,
            widgetStarted: false,
            showHostRequest: false,
            jukeboxPlayerReady: false,
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
        },
        displayRequests: function displayRequests() {
            if (this.jukeboxMode) {
                return this.jukeBoxList;
            }
            return this.requestList;
        }
    },
    methods: {
        hideRequest: function hideRequest(payload) {
            if (this.safe(payload)) {
                if (this.jukeboxMode) {
                    this.doNotPlaySong(payload);
                    return;
                }
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
            var _this20 = this;

            var id = trackObject.id;
            var token = this.$store.state.accessToken;
            // Don't run for jukebox clients
            if (this.jukeboxMode) {
                return;
            }
            var calls = [fetch('https://api.spotify.com/v1/audio-features/' + id + '?access_token=' + token), fetch('https://api.spotify.com/v1/tracks/' + id + '?access_token=' + token)];
            Promise.all(calls).then(function (res) {
                if (res.every(function (i) {
                    return i.status === 200;
                })) {
                    return Promise.all(res.map(function (i) {
                        return i.json();
                    }));
                } else {
                    return 'fail';
                }
            }).catch(function (err) {
                console.log(new Error(err));
            }).then(function (res) {
                if (res !== 'fail') {
                    var _ref = [].concat(_toConsumableArray(res)),
                        audioFeatures = _ref[0],
                        trackDetails = _ref[1];

                    var musicKey = _this20.musicNotes[audioFeatures.key];
                    var bpm = Math.floor(Number(audioFeatures.tempo));
                    var output = musicKey + ' - ' + bpm + ' bpm';
                    var indexInBasket = _this20.requestBasket.findIndex(function (item) {
                        return item.id === id;
                    });
                    _this20.requestBasket[indexInBasket].bpm = output;
                    _this20.requestBasket[indexInBasket].explicit = trackDetails.explicit;
                } else if (res === 'fail') {
                    _this20.pendingTrackDetails.push(trackObject);
                    _this20.controlSocket.emit('newTokenPlease');
                }
            });
        },
        setDj: function setDj() {
            //save to database first
            var payload = {};
            payload.appName = this.appName;
            payload.handle = this.inputProfile;
            payload.name = this.instaName;
            this.controlSocket.emit('setDj', payload);
            this.modalPage.verified = true;
            this.modalPage.imageacquired = false;
            this.$store.commit('badgeImage', { image: this.url, appName: this.appName });
        },
        getJukeboxApi: function getJukeboxApi() {
            var _this21 = this;

            var tag = document.createElement('script');
            // IOS mobile should have a video loaded by default to prevent error and not keep showing the power button
            var videoId = this.isIOS() && this.isMobileOrTablet() ? 'q1Yz0Vfp2jY' : undefined;
            // When api is ready to be used this will be called
            window.onYouTubeIframeAPIReady = function () {
                _this21.jukeBoxInstance = new YT.Player('jukebox', {
                    height: '200',
                    width: '200',
                    videoId: videoId,
                    events: {
                        'onError': function onError(event) {
                            console.error(new Error(event.data));
                            console.warn('Due to faliure i had to play the next song');
                            _this21.playNextSong();
                        },
                        'onReady': function onReady() {
                            if (_this21.isIOS() && _this21.isMobileOrTablet()) {
                                document.querySelector('.jukebox-container').style.display = 'inline-block';
                            }
                            _this21.jukeboxPlayerReady = true;
                        },
                        'onStateChange': function onStateChange(event) {
                            _this21.jukeBoxStateChanged(event);
                        }
                    },
                    playerVars: {
                        autoplay: 1,
                        enablejsapi: 1,
                        fs: 0,
                        origin: 'https://www.youtube.com',
                        playsinline: 1,
                        controls: 1,
                        modestbranding: 1
                    }
                });
            };
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            if ('YT' in window) {
                //When user refreshes while in this route the script becomes loaded before they get back to this route
                window.onYouTubeIframeAPIReady();
                return;
            }
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },
        jukeBoxStateChanged: function jukeBoxStateChanged(event) {
            var _this22 = this;

            switch (this.playerStates[event.data]) {
                case 'ended':
                    this.widgetStarted = false;
                    // Sometimes the event fires in the order -1 0 -1 3 1 at the start of a new track
                    setTimeout(function () {
                        if (_this22.jukeBoxInstance.getPlayerState() === YT.PlayerState.ENDED) {
                            clearInterval(_this22.fadeOutIntervalInstance);
                            _this22.playNextSong();
                        }
                    }, 3000);
                    break;
                case 'playing':
                    this.playing = true;
                    this.widgetStarted = true;
                    clearInterval(this.fadeOutIntervalInstance);
                    this.fadeOutVolume();
                    var iframeDisplayState = document.querySelector('.jukebox-container').style.display;
                    if (iframeDisplayState !== 'none') {
                        document.querySelector('.jukebox-container').style.display = 'none';
                    }
                    break;
                case 'paused':
                    this.playing = false;
                    clearInterval(this.fadeOutIntervalInstance);
                    break;
                default:
                    break;
            }
        },
        addToPlaylist: function addToPlaylist(song) {
            var _this23 = this;

            try {
                if (this.jukeBoxList.length < 1) {
                    this.jukeBoxList.push(song);
                    this.jukeBoxInstance.setVolume(100);
                    this.jukeBoxInstance.loadVideoById({
                        videoId: song.id,
                        startSeconds: 0,
                        endSeconds: this.isLocalhost ? 30 : this.endAtSeconds
                    });
                    return;
                }
                this.jukeBoxList.push(song);
            } catch (error) {
                if (this.jukeBoxInstance === undefined && 'YT' in window) {
                    window.onYouTubeIframeAPIReady();
                    // Needs some time after generating a new instance of the API
                    setTimeout(function () {
                        _this23.jukeBoxInstance.loadVideoById({
                            videoId: _this23.jukeBoxList[0].id,
                            startSeconds: 0,
                            endSeconds: _this23.isLocalhost ? 30 : _this23.endAtSeconds
                        });
                        console.log('restarting.....');
                    }, 5000);
                }
            }
        },
        playNextSong: function playNextSong() {
            this.widgetStarted = false;
            this.jukeBoxList.shift();
            if (this.jukeBoxList.length > 0) {
                this.jukeBoxInstance.setVolume(100);
                this.jukeBoxInstance.loadVideoById({
                    videoId: this.jukeBoxList[0].id,
                    startSeconds: 0,
                    endSeconds: this.isLocalhost ? 30 : this.endAtSeconds
                });
            }
        },
        doNotPlaySong: function doNotPlaySong(payload) {
            var playerState = this.playerStates[this.jukeBoxInstance.getPlayerState()];
            var currentSongId = this.jukeBoxInstance.getVideoData().video_id;
            if (currentSongId === payload.id) {
                this.playNextSong();
                if (this.jukeBoxList.length === 0) {
                    this.jukeBoxInstance.pauseVideo();
                    this.addNextAutoRequest();
                }
            } else {
                var checkIdExist = this.jukeBoxList.findIndex(function (item) {
                    return item.id === payload.id;
                });
                if (checkIdExist !== -1) {
                    this.jukeBoxList.splice(checkIdExist, 1);
                }
            }
        },
        fadeOutVolume: function fadeOutVolume(milliseconds, volume) {
            var _this24 = this;

            var volumeMap = this.getVolumeTime();
            //console.log(volumeMap)
            this.fadeOutIntervalInstance = setInterval(function () {
                var currentTime = Math.floor(_this24.jukeBoxInstance.getCurrentTime());
                var volume = volumeMap.get(currentTime);
                if (volume !== undefined && volume > 1) {
                    _this24.jukeBoxInstance.setVolume(volume);
                }
                if (volume === 20) {
                    _this24.addNextAutoRequest();
                }
            }, 1000);
        },
        getVolumeTime: function getVolumeTime() {
            var fullSongDuration = Math.floor(this.jukeBoxInstance.getDuration());
            var duration = fullSongDuration < this.endAtSeconds ? fullSongDuration : this.endAtSeconds;
            var ninetyPercentDuration = 0.9 * duration;
            var frequency = 8;
            var durationDiff = duration - ninetyPercentDuration;
            var changeIncrement = Math.round(durationDiff / frequency);
            var volumeMap = new Map();
            var volume = 112; // so starting volume decreas is 80
            for (var i = 0; i < frequency; i++) {
                var mediaTime = Math.floor(ninetyPercentDuration) + i * changeIncrement;
                volume /= 1.4;
                volumeMap.set(mediaTime, Math.floor(volume));
            }

            return volumeMap;
        },
        mediaPlay: function mediaPlay() {
            this.jukeBoxInstance.playVideo();
        },
        mediaPause: function mediaPause() {
            this.jukeBoxInstance.pauseVideo();
        },
        getAutoPlaylist: function getAutoPlaylist() {
            var _this25 = this;

            fetch('/allPlaylist').then(function (res) {
                if (res.status === 200) {
                    return res.json();
                }
                throw new Error('request failed');
            }).then(function (res) {
                _this25.allPlayList = res;
                res.forEach(function (item) {
                    _this25.allPlayListMap.set(item.genre, item.songs);
                    _this25.genreOptions.push({
                        genre: item.genre,
                        selected: item.genre.includes('top 40') ? true : false
                    });
                });
                _this25.setupAutoPlay();
            });
        },
        setupAutoPlay: function setupAutoPlay() {
            var _this26 = this;

            this.autoPlayList = [];
            var autoDjStartPlayTime = 60000 * 3;
            this.genreOptions.forEach(function (item) {
                if (item.selected) {
                    var _autoPlayList;

                    var songs = _this26.allPlayListMap.get(item.genre);
                    (_autoPlayList = _this26.autoPlayList).push.apply(_autoPlayList, _toConsumableArray(songs));
                }
            });
            this.randomize(this.autoPlayList);
            setTimeout(function () {
                if (_this26.jukeBoxList.length < 1) {
                    _this26.addNextAutoRequest();
                }
            }, autoDjStartPlayTime);
        },
        addNextAutoRequest: function addNextAutoRequest() {
            if (this.autoPlayList.length > 0 && this.jukeBoxList.length <= 1) {
                var song = this.autoPlayList[0];
                this.autoPlayList.splice(0, 1);
                this.addRequest({ song: song }, true);
            }
        },
        toggleGenre: function toggleGenre(genreData) {
            genreData.selected = !genreData.selected;
        },
        addRequest: function addRequest(data, isAuto) {
            console.log('request added bruh', data);
            var checkIdExist = this.requestBasket.findIndex(function (item) {
                return item.id === data.song.id;
            });
            if (checkIdExist === -1) {
                data.song.vipList = new Map();
                data.song.requestCount = 1;
                data.song.hide = false;
                data.song.bpm = '';
                data.song.isAuto = isAuto || false;
                if ('vip' in data && data.vip.limit > 0) data.song.vipList.set(data.vip.insta, data.vip);
                data.song.showVip = false;
                this.requestBasket.push(data.song);
                this.getTrackBpm(data.song);
                if (this.jukeboxMode) {
                    this.addToPlaylist(data.song);
                }
            } else {
                var requestedSong = this.requestBasket[checkIdExist];
                requestedSong.requestCount += 1;
                if ('vip' in data && data.vip.limit > 0) requestedSong.vipList.set(data.vip.insta, data.vip);
                if (isAuto) {
                    this.addNextAutoRequest();
                }
            }
        },
        hostSearchTrack: function hostSearchTrack() {
            if (this.safe(this.searchInput)) {
                this.youtube(this.searchInput);
            }
        },
        hostSendRequest: function hostSendRequest(payload) {
            if (this.safe(payload)) {
                payload.timestamp = moment().toISOString();
                console.log(payload);
                this.addRequest({ song: payload });
                this.requestedSongs.push(payload.id);
                payload.trackTask = 'request';
                payload.domain = location.host;
                this.trackAction(payload);
            }
        },
        toggleShowHostRequest: function toggleShowHostRequest() {
            if (this.showHostRequest) {
                this.showHostRequest = false;
                return;
            }
            this.showHostRequest = true;
        }
    },
    created: function created() {
        var _this27 = this;

        this.validateId();
        this.controlSocket.on('connect', function (data) {
            _this27.isConnected = true;
            _this27.controlSocket.emit('getDj', { appName: _this27.appName });
            console.log('connected my nigga');
        });
        this.controlSocket.on('disconnect', function (data) {
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            _this27.isConnected = false;
        });
        this.controlSocket.on('answer', function (data) {
            console.log(data);
            if (data.appName === _this27.appName) {
                if ('task' in data && data.task === 'population') {
                    console.log('population gwoth complete', data);
                    _this27.population.push(data);
                }
                if ('task' in data && data.task === 'request') {
                    _this27.addRequest(data);
                    _this27.controlSocket.emit('analytics', { appName: _this27.appName, requestNumber: _this27.requestList.length, task: 'request' });
                }
                if ('task' in data && data.task === 'pendingRequests') {
                    //pending requests from server will include requests already received before disconnection
                    //take only the requests we dont have in the requestBasket to avoid double counting of requests
                    var addUp = function addUp(accumulator, currentValue) {
                        return accumulator + currentValue;
                    };
                    var totalRequestsReceived = 0; //default
                    if (_this27.requestBasket.length > 0) {
                        totalRequestsReceived = _this27.requestBasket.map(function (item) {
                            return item.requestCount;
                        }).reduce(addUp);
                    }

                    var onlyNewPendingRequests = data.pendingRequests.slice(totalRequestsReceived);
                    onlyNewPendingRequests.forEach(function (request) {
                        var checkIdExist = _this27.requestBasket.findIndex(function (item) {
                            return item.id === request.song.id;
                        });
                        console.log(checkIdExist);
                        if (checkIdExist === -1) {
                            request.song.vipList = new Map();
                            request.song.requestCount = 1;
                            request.song.hide = false;
                            request.song.bpm = '';
                            _this27.requestBasket.push(request.song);
                            _this27.getTrackBpm(request.song);
                            if (_this27.jukeboxMode) {
                                _this27.addToPlaylist(data.song);
                            }
                        } else {
                            _this27.requestBasket[checkIdExist].requestCount += 1;
                        }
                    });
                }
            }
        });
        this.controlSocket.on('newToken', function (data) {
            _this27.$store.commit('accessToken', data);
            if (_this27.pendingTrackDetails.length > 0) {
                var tracks = _this27.pendingTrackDetails;
                _this27.pendingTrackDetails = [];
                tracks.forEach(function (item) {
                    _this27.getTrackBpm(item);
                });
            }
        });
        this.controlSocket.on('reconnect', function (data) {
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            var payload = { appName: _this27.appName };
            _this27.isConnected = true;
            _this27.controlSocket.emit('updateRequests', payload);
        });
        this.controlSocket.on('djData', function (data) {
            _this27.getInstaImage(data.djData.handle).then(function (res) {
                var payload = { appName: _this27.appName, image: res };
                _this27.$store.commit('badgeImage', payload);
            });
        });
        this.controlSocket.on('sessionOver', function (data) {
            if (_this27.appName.toLowerCase() === data) {
                _this27.$router.replace('/home');
                M.toast({
                    html: 'Something went wrong. Please host a new party room',
                    displayLength: 60000
                });
            }
        });
    },
    mounted: function mounted() {
        this.getJukeboxApi();
        //M.toast({html: 'Join party on mobile/tablet to request songs now.', displayLength: 10000, classes: 'toast-lower'})
        this.getAutoPlaylist();
    },
    destroyed: function destroyed() {
        //console.log('damn son am out')
        this.controlSocket.close();
        clearInterval(this.fadeOutIntervalInstance);
        M.Toast.dismissAll();
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
            var _this28 = this;

            var params = { clubId: this.clientId, date: this.reportDate };
            if (this.safe(this.reportDate)) {
                this.loader = true;
                axios.get('https://styleminions.co/api/bmr-report', { params: params }).then(function (res) {
                    _this28.reportResponse = res.data;
                    _this28.buildReport();
                });
            }
        },
        getSelectedDate: function getSelectedDate(date) {
            console.log(date);
            this.reportDate = moment(date).format('YYYY-MM-DD');
        },
        buildReport: function buildReport() {
            var _this29 = this;

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
                return item.id === _this29.clientId;
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
    methods: {
        submitModal: function submitModal() {
            this.$emit('submit', this.inputProfile);
            this.inputProfile = '';
        },
        closeModal: function closeModal() {
            this.$emit('close');
            this.inputProfile = '';
        }
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
        //console.log('a change happened for the directive',vnode)
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

Vue.component('badge', {
    template: '\n    <div class="component">\n        <div class="dj-chip chip animated fadeInRight" @click="show = true">\n        <img :src="imageUrl" alt="Host">\n        Host\n        </div>\n        <slide-modal :show="show" @close="hideSlideModal">\n            <slot></slot>\n        </slide-modal>\n    </div>\n    ',
    mixins: [serviceProvider],
    data: function data() {
        return {
            show: false
        };
    },
    computed: {
        imageUrl: function imageUrl() {
            var routeId = this.$route.params.id;
            if (routeId === this.$store.state.badge.appName) {
                return this.$store.state.badge.image;
            }

            return this.noProfileUrl;
        }
    },
    methods: {
        hideSlideModal: function hideSlideModal() {
            this.show = false;
            this.$emit('close-badge');
        }
    }

});
Vue.component('slide-modal', {
    template: '\n    <div class="dj-modal-container" v-if="show">\n        <div class="close-body" @click="$emit(\'close\')">\n            <i class="material-icons" style="font-size:4em;color:white;">expand_more</i>\n        </div>\n        <div class="dj-modal-body animated slideInUp">\n            <slot></slot>\n        </div>\n    </div>\n    ',
    props: ['show']

});
Vue.component('get-insta', {
    template: '\n    <div class="row">\n        <div class="col s8">\n            <input type="text" placeholder="Instagram handle" :value="inputProfile" :class="{\'invalid\': comp.fail}"\n                @keypress="inputProfile = $event.target.value" @input="inputProfile = $event.target.value" \n                @keyup="$emit(\'get-profile\', inputProfile)">\n        </div>\n        <div class="col s4" v-show="!comp.fail" style="position: relative;">\n            <img :src="url" alt="" class="circle responsive-img img-lead animated fadeInLeft" v-show="!comp.loader">\n            <span v-show="comp.verified" class="btn btn-small btn-floating lead-fab z-depth-3"><i class="material-icons">check</i></span>\n            <span v-show="comp.unverified" class="btn btn-small btn-floating lead-fab z-depth-3"><i class="material-icons">close</i></span>\n            <spinner class="animated fadeIn" :colorClass="\'default\'" v-show="comp.loader"></spinner>\n        </div>\n        <div class="col s4" v-show="comp.fail">\n            <i class="material-icons">mood_bad</i><br><span style="font-size:10px">Oops! Not an instagram profile</span>\n        </div>\n    </div>\n    ',
    props: ['comp'],
    mixins: [serviceProvider]
});
Vue.directive('imgfallback', {
    bind: function bind(el, binding, vnode) {
        var fallback = serviceProvider.data().noProfileUrl;
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
Vue.filter('songName', function (value) {
    if (value !== undefined) {
        return value.toLowerCase().replace(/ (\[.+\]|\(.+\)|\*.+\*|\W|official|vevo|music|audio|hd|hq|lyric?.)/gi, '');
    }

    return value;
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
        url: serviceProvider.data().noProfileUrl,
        accessToken: null,
        clubs: [],
        vipMode: {
            limit: 0,
            uuid: 0,
            insta: '',
            club: ''
        },
        badge: {
            image: serviceProvider.data().noProfileUrl,
            appName: ''
        },
        partyCodeFromLink: ''
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
        },
        badgeImage: function badgeImage(state, data) {
            state.badge = data;
        },
        noDj: function noDj(state) {
            state.badge.appName = '';
        },
        joinParty: function joinParty(state, data) {
            state.partyCodeFromLink = data;
        }
    }
});

var routes = [{ path: '/request/:id', component: spotify }, { path: '/dj/:id', component: djSpotify }, { path: '/', component: landing }, { path: '/join/:code', component: landing }, { path: '/home', component: homeTwo }, { path: '/report', component: report }, { path: '*', redirect: '/' }];
var router = new VueRouter({
    routes: routes // short for `routes: routes`
});

Vue.prototype.$noSleep = function () {};

var app = new Vue({
    router: router,
    store: store
}).$mount('#myapp');