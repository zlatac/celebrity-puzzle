<template>
    <div>
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
        <div class="card dark-card animated fadeInUp" v-for="(x, index) in clubs" :key="index">
            <div class="row">
                <div class="col s4">
                    <div style="position: relative;">
                        <img class="circle" :src="x.image" width="70px">
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
    </div>
</template>

<script>
import serviceProvider from '../mixin.js'
export default {
    mixins: [serviceProvider],
    data: function(){
        return{
            showSearch:false,
            isSearchFocused:false,
            inputSearch:''
        }
    },
    computed:{
        clubs(){
            if(this.safe(this.inputSearch)){
                if(this.inputSearch.toLowerCase() === 'bmr report'){
                    this.$router.push('/report')
                    return
                }
                return this.$store.state.clubs.filter((item)=>{
                    let search = this.inputSearch.toLowerCase()
                    return item.name.toLowerCase().includes(search) || item.city.toLowerCase().includes(search)
                })
            }
            return this.$store.state.clubs
        }
    },
    methods:{
        joinRoom(id){
            this.$router.push(`/request/${id.id}`)
        },
        resetInput(){
            this.inputSearch = ''
        },
        toggleSearch(){
            switch(this.showSearch){
                case true:
                    this.showSearch = false;
                    this.resetInput()
                    break;
                case false:
                    this.showSearch = true;
                    break
                default:
                    this.showSearch = false;
                    break;
            }
        },
        searchClub(){

        }
    }
}
</script>