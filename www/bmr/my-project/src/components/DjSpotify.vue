<template>
     <div class="zontainer center-align animated fadeIn">
        <div class="zow">
            <div class="col s12 lead-fixed">
                <div class="card-panel" style="margin-top: 0px;">
                    <div class="row valign-wrapper"  style="margin-bottom: 0px;">
                        <div class="col s4">
                            <img :src="club.image" 
                                 alt="" class="circle animated infinite" width="90px" height="90px" v-imgfallback
                                 :class="{'img-online pulse': isConnected, 'img-offline wobble': !isConnected}">
                        </div>
                        <div class="col s3"><span><i class="material-icons">people</i>{{population.length}}</span></div>
                        <div class="col s5"><span class="btn btn-floating">{{requestList.length}}</span> Requests</div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div style="margin-top: 160px;">
            <spinner :colorClass="'default'" v-show="loader"></spinner>
            <div class="row " v-show="!loader">
                <div class="card dark-card animated fadeInUp" v-for="(x, index) in requestList" v-if="x.hide === false" :key="index">
                    <div class="row">
                        <div class="col s4">
                            <div style="position: relative;">
                                <img :src="x.image" width="70px">
                                <span class="btn btn-small btn-floating lead-fab z-depth-3">{{x.requestCount}}</span>
                            </div>   
                        </div>                     
                        <div class="col s5">
                            {{x.song}} 
                            <p class="grey-text p-space">{{x.artist}}</p>
                            <p class="p-space"><b>[ {{x.bpm}} ]</b></p>
                        </div>
                        <div class="col s3"><span class="btn btn-floating" @click="hideRequest(x)"><i class="material-icons">close</i></span></div>
                    </div>
                </div>
            </div>
            <!-- <div class="row " style=""><div class="card animated fadeInUp firstresult"><div class="row"><div class="col s4"><div style="position: relative;"><img src="https://i.scdn.co/image/af440b4e0d8d22cb46b3723164281dfb70cdb4f5" width="70px"><span class="btn btn-small btn-floating lead-fab z-depth-3">10</span></div></div> <div class="col s5">Good Life - Kanye West,T-Pain</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/1820ea91e0723b1ce8820bb2cedae9f1be9d1de9" width="70px"></div> <div class="col s5">Lush Life - Zara Larsson</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/9e01aaf171b64785c693335e1ce19dcf1d7823c7" width="70px"></div> <div class="col s5">Good Life (with G-Eazy &amp; Kehlani) - G-Eazy,Kehlani</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/851015118292bbee6e0da67750df9782b3f1ec4b" width="70px"></div> <div class="col s5">Good Riddance (Time of Your Life) - Green Day</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/ec1beabb340e7a8ead24450a865d15788091752b" width="70px"></div> <div class="col s5">Good Life - OneRepublic</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/f56acdbbadc334a3d3107a063f3b08e816103bde" width="70px"></div> <div class="col s5">The Good Life - Three Days Grace</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/1b46b9593b3d4826cbd146033ec67b934419d029" width="70px"></div> <div class="col s5">Good Life - The Young Escape</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/a91e0ebec554bf1d3fbbdd4e3b8676763d78dae0" width="70px"></div> <div class="col s5">Real Good Life - The Mowgli's</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/5420c212ea73eb2dc80acdcf7601167e903a9641" width="70px"></div> <div class="col s5">Good Life - Keiynan Lonsdale</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/1e11df0d51bf42ec5a7100050dd45d09066b220f" width="70px"></div> <div class="col s5">The Good Life - Weezer</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/19320480eb39647c1447478eab03340b56fd9c58" width="70px"></div> <div class="col s5">Good Life - Kiso,Yvette</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/01e08194d9fd549f920f23ff98f0bfd492c8c7d9" width="70px"></div> <div class="col s5">Good Life - ZHU</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/9e846f095398a12c04761ae11667b9f4b2eef854" width="70px"></div> <div class="col s5">Life's Been Good - Joe Walsh</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/9b0df3e37e24cd96a289262f21bd53f1d752848d" width="70px"></div> <div class="col s5">Good Life - Collie Buddz</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/7c8648bc3de1876779f37e8fd0a8a8387a13d134" width="70px"></div> <div class="col s5">Good Life - OneRepublic</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/827f95bd3e6c3c8b358ff2063f04256a6b0b70c2" width="70px"></div> <div class="col s5">Life Is Beautiful - Rend Collective</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/cc9d6ddaf6d0e50858c1cbaef48d8c92638179c9" width="70px"></div> <div class="col s5">Good Life - Collie Buddz</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/2ea29569e7a387c7f5c34afb0b57120048a9e751" width="70px"></div> <div class="col s5">Good Life (feat. Rick Ross) - Sammie,Rick Ross</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/79558cefc1db040dad38c5fb642b0d06dfc7df3c" width="70px"></div> <div class="col s5">Good Time Good Life - Erin Bowman</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div><div class="card animated fadeInUp"><div class="row"><div class="col s4"><img src="https://i.scdn.co/image/5d40a995b5cc164f602874d13f16b715e85d7b61" width="70px"></div> <div class="col s5">Lone Pine Hill - Justin Townes Earle</div> <div class="col s3"><span class="btn btn-floating"><i class="material-icons">delete</i></span></div></div></div></div> -->
        </div>
    </div>
</template>
<script>
import serviceProvider from '../mixin.js'
export default {
    mixins: [serviceProvider],
    data: function(){
        return{
            requestBasket:[],
            population: [],
            pendingTrackDetails:[],
            isConnected: false,
            musicNotes:['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B']
        }
    },
    computed:{
        controlSocket(){
            return this.webSocket()
        },
        requestList(){
            if(this.requestBasket.length > 0){
                return this.requestBasket
                .filter((item)=> item.hide !== true)
                .sort((a,b)=>{
                    //requestCount takes primary precident in sort followed by timestamp
                    //1 (makes b a lower index than a) -1(makes b a higher index than a)
                    if(b.requestCount > a.requestCount){
                        return 1
                    } 
                    if(b.requestCount < a.requestCount){
                        return -1
                    } 
                    if(b.requestCount === a.requestCount && b.timestamp > a.timestamp){
                        return 1
                    }
                    if(b.requestCount === a.requestCount && b.timestamp < a.timestamp){
                        return -1
                    }
                })
            }else{
                return this.requestBasket
            }
            
        },
        club(){
            return this.getClubData()
        },
        appName(){
            return String(this.$route.params.id)
        },
    },
    methods: {
        hideRequest(payload){
            if(this.safe(payload)){
                let checkIdExist = this.requestBasket.findIndex((item) => item.id === payload.id)
                if(checkIdExist !== -1){
                    this.requestBasket[checkIdExist].hide = true
                }
            }
        },
        getTrackBpm(trackObject){
            let id = trackObject.id
            let token = this.$store.state.accessToken
            fetch(`https://api.spotify.com/v1/audio-features/${id}?access_token=${token}`)
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
                    let musicKey = this.musicNotes[res.key]
                    let bpm = Math.floor(Number(res.tempo))
                    let output = `${musicKey} - ${bpm} bpm`
                    let indexInBasket = this.requestBasket.findIndex((item)=> item.id === id)
                    this.requestBasket[indexInBasket].bpm = output
                }else if(res === 'fail'){
                    this.pendingTrackDetails.push(trackObject)
                    this.controlSocket.emit('newTokenPlease')
                }                    
            })
        }
    },
    created:function(){
        this.validateId()
        this.controlSocket.on('connect', (data)=>{
            this.isConnected = true
            console.log('connected my nigga');
        });
        this.controlSocket.on('disconnect', (data)=>{
            // console.log('i am disconnected bro');
            // alert('i am disconnected bro')
            this.isConnected = false
        });
        this.controlSocket.on('answer',(data)=>{
            console.log(data)
            if(data.appName === this.appName){
                if('task' in data && data.task === 'population'){
                    console.log('population gwoth complete', data)
                    this.population.push(data)
                }
                if('task' in data && data.task === 'request'){
                    console.log('request added bruh', data)
                    let checkIdExist = this.requestBasket.findIndex((item) => item.id === data.song.id)
                    console.log(checkIdExist)
                    if(checkIdExist === -1){
                        data.song.requestCount = 1
                        data.song.hide = false
                        data.song.bpm = ''
                        this.requestBasket.push(data.song)
                        this.getTrackBpm(data.song)
                    }else{
                        this.requestBasket[checkIdExist].requestCount += 1
                    }
                    this.controlSocket.emit('analytics',{appName:this.appName,requestNumber:this.requestList.length,task:'request'});
                    
                }
                if('task' in data && data.task === 'pendingRequests'){
                    //pending requests from server will include requests already received before disconnection
                    //take only the requests we dont have in the requestBasket to avoid double counting of requests
                    const addUp = (accumulator, currentValue) => accumulator + currentValue
                    let totalRequestsReceived = 0 //default
                    if(this.requestBasket.length > 0){
                        totalRequestsReceived = this.requestBasket.map(item => item.requestCount).reduce(addUp)
                    }
                    
                    let onlyNewPendingRequests = data.pendingRequests.slice(totalRequestsReceived)
                    onlyNewPendingRequests.forEach((request)=>{
                        let checkIdExist = this.requestBasket.findIndex((item) => item.id === request.song.id)
                        console.log(checkIdExist)
                        if(checkIdExist === -1){
                            request.song.requestCount = 1
                            request.song.hide = false
                            request.song.bpm = ''
                            this.requestBasket.push(request.song)
                            this.getTrackBpm(request.song)
                        }else{
                            this.requestBasket[checkIdExist].requestCount += 1
                        }
                    })
                }
            }
            
        })
        this.controlSocket.on('newToken',(data)=>{
            this.$store.commit('accessToken',data)
            if(this.pendingTrackDetails.length > 0){
                let tracks = this.pendingTrackDetails
                this.pendingTrackDetails = []
                tracks.forEach((item)=>{
                    this.getTrackBpm(item)
                })                
            }
        });
        this.controlSocket.on('reconnect', (data)=>{
            // console.log('i am reconnected bitch');
            // alert('i am reconnected bitch')
            this.isConnected = true
            this.controlSocket.emit('updateRequests')
        });
        
    },
    destroyed: function(){
        //console.log('damn son am out')
        this.controlSocket.close()
    }
}
</script>