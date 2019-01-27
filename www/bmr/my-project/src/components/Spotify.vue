<template>
    <div class="zontainer center-align animated fadeIn">
        <div class="zow">
            <div class="col s12 lead-fixed">
                <div class="card-panel" style="margin-top: 0px;padding-top: 5px;">
                    <div class="row" style="margin-bottom: 0px;">
                        <img :src="club.image" 
                             alt="" class="circle animated infinite" width="90px" height="90px" @click="goToDjView"
                             :class="{'img-online pulse': isConnected, 'img-offline wobble': !isConnected}" v-imgfallback>
                        <p class="zero-margin">{{club.name}} <span class="grey-text animated fadeIn" v-show="!isConnected">- Reconnecting...</span></p>
                        <p class="zero-margin-bottom">
                            <!-- <span><i class="material-icons">people</i>56</span> -->
                            <span class="chip">{{metrics.requestNumber}} Requests</span> 
                        </p>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <form  novalidate @submit.stop.prevent="searchTrack">
                            <div class="col s9">
                                <input type="text" name="q" placeholder="Search tracks" v-model="searchInput" 
                                       v-inputHighlight autocomplete="off">
                            </div>
                            <div class="col s3">
                                <button type="submit" class="btn btn-floating waves-effect waves-light">
                                    <i class="material-icons">search</i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 252px;">
            <spinner :colorClass="'default'" v-show="loader"></spinner>
            <adsense v-if="!loader && searchResult.length !== 0"></adsense>
            <div class="row " v-show="!loader">
                <div class="card dark-card animated fadeInUp" v-show="noResult === true">
                    <div class="row">
                        <div class="col s12">
                            <p><b>Sorry!! Can't find that song.</b></p>
                            <p><b>Search for another song.</b></p>
                        </div>
                    </div>
                </div>
                <div class="card dark-card animated fadeInUp" v-for="(x, index) in searchResult" :class="{'firstresult': index === 0}" :key="index">
                    <div class="row">
                        <div class="col s4">
                            <div style="position: relative;">
                                <img :src="x.image" width="70px">
                                <span class="btn btn-small btn-floating lead-fab z-depth-3 animated bounceIn" v-show="alreadyRequested(x.id) === true">
                                    <i class="material-icons">check</i>
                                </span>
                            </div>
                        </div>
                        <div class="col s5">
                            {{x.song}}
                            <p class="grey-text p-space">{{x.artist}}</p>
                            
                        </div>
                        <div class="col s3">
                            <span class="btn btn-floating waves-effect waves-light" @click="sendRequest(x)" :disabled="alreadyRequested(x.id) === true"
                                  :class="{'btn-opaque':alreadyRequested(x.id) === true}">
                                <i class="material-icons">send</i>
                            </span>
                            <p class="grey-text animated bounce" style="font-size:12px" v-show="alreadyRequested(x.id) === true">requested</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import serviceProvider from '../mixin'
export default {
    mixins: [serviceProvider],
    data: function(){
        return{
            searchInput: '',
            searchResult: [],
            metrics:{requestNumber:0},
            accessNumber:0,
            pendingSearch: [],
            requestedSongs:[],
            noResult:false
        }
    },
    computed:{
        socket(){
            return this.webSocket()
        },
        appName(){
            return String(this.$route.params.id)
        },
        club(){
            return this.getClubData()
        }
    },
    methods: {
        searchTrack(){
            if(this.safe(this.searchInput)){
                this.loader = true
                // let token = 'BQCmVbA7pD8mZI9pCpUt5HcsO1Fb9nCRqlhcTAu52TpwCS4uxIi4BffjrENegBzfMjhMXHr_esCHR_R0O5M'
                let token = this.$store.state.accessToken
                let query = encodeURIComponent(this.searchInput)
                let type = 'track'
                console.log(this.searchInput)

                fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&access_token=${token}`)
                .then((res)=>{
                    if(res.status === 200){
                        return res.json()
                    }else{
                        return 'fail'
                    }                    
                        
                })
                .catch((err)=>{
                    console.log(new Error(err))
                })
                .then((res)=>{
                    if(res !== 'fail'){
                        this.searchResult = res.tracks.items.map((item)=>{
                            let obj = {}
                            obj.image = item.album.images[1].url
                            obj.song = item.name
                            obj.artist = item.artists.map((item)=> item.name).join(', ')
                            obj.id = item.id
                            return obj
                        })
                        this.noResult = (this.searchResult.length === 0) ? true : false
                        this.pendingSearch = []
                        this.loader = false;
                        this.scrollToResultTop()
                        //this.searchInput = ''
                    }else if(res === 'fail'){
                        this.pendingSearch.push(this.searchInput)
                        this.socket.emit('newTokenPlease')
                    }                    
                })
                .finally((res)=>{
                    let payload = {trackTask:'search',search:this.searchInput, timestamp:moment().toISOString(),domain:location.host}
                    this.trackAction(payload)
                })
            }
        },
        scrollToResultTop(){
            let elem = document.querySelector('.firstresult')
            if(this.safe(elem)){
                elem.scrollIntoView(false) //false aligns the bottom of the element to the bottom of available space and vice versa
            }
        },
        sendRequest(payload){
            if(this.safe(payload) && this.isConnected === true){
                payload.timestamp = moment().toISOString()
                console.log(payload)
                this.socket.emit('audience',{appName:this.appName,id:this.socket.id,task:'request',song:payload})
                this.requestedSongs.push(payload.id)
                payload.trackTask = 'request'
                payload.domain = location.host
                this.trackAction(payload)
            }
        },
        goToDjView(){
            this.accessNumber++
            if(this.accessNumber === 4){
                this.$router.push(`/dj/${this.appName}`)
            }
        },
        alreadyRequested(payload){
            if(this.requestedSongs.findIndex(item => item === payload) !== -1){
                return true
            }
            return false
        }
    },
    created: function(){
        this.validateId()
        this.socket.on('connect', (data)=>{
            this.isConnected = true
            this.socket.emit('audience',{appName:this.appName,id:this.socket.id,task:'population'});
            console.log(data, 'connected my nigga');
        });
        this.socket.on('disconnect', (data)=>{
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            this.isConnected = false
        });
        this.socket.on('reconnect', (data)=>{
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            this.isConnected = true
        });
        //this.socket.emit('join','we in this bitch son');
        this.socket.on('sendMetrics',(data)=>{
            //console.log(data,'metric data');
            if(data.appName === this.appName && 'task' in data && data.task === 'request'){
                this.metrics = data;
                //this.showMetrics = true;
            }
        });
        this.socket.on('newToken',(data)=>{
            this.$store.commit('accessToken',data)
            if(this.pendingSearch.length > 0){
                this.searchTrack()
            }
        });
        this.socket.on('room',(data)=>{
            console.log(data)
        });
        
    },
    destroyed: function(){
        //console.log('damn son am out')
        this.socket.close()
    }
}
</script>