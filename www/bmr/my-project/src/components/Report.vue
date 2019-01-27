<template>
    <div>
        <h4 class="center-align white-text" style="margin-bottom:40px;">
            Report
        </h4>
        <div class="row">
            <div class="col s6">
                <select name="clubs" v-model="clientId" @change="getReport" class="white">
                    <option value="">All</option>
                    <option :value="item.id" :key="index" v-for="(item, index) in clubs">{{item.name}}</option>
                </select>
            </div>
            <div class="col s6">
                <input type="text" class="datepicker white">
            </div>
        </div>
        <div class="row center-align">
            <spinner :colorClass="'default'" v-show="loader"></spinner>
        </div>
        <div class="card dark-card animated fadeInUp" v-for="(x, index) in reportDisplay" v-show="!loader" :key="index">
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
                    S:{{x.totalSearch}} | R:{{x.totalRequest}}
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
            reportDate:'',
            clientId:'',
            reportResponse: [],
            reportDisplay: []
        }
    },
    computed:{
        clubs(){
            return this.$store.state.clubs
        }
    },
    methods:{
        getReport(){
            const params = {clubId: this.clientId,date:this.reportDate}
            if(this.safe(this.reportDate)){
                this.loader = true
                axios.get('https://styleminions.co/api/bmr-report', {params})
                .then((res)=>{
                    this.reportResponse = res.data
                    this.buildReport()
                })
            }  
        },
        getSelectedDate(date){
            console.log(date)
            this.reportDate = moment(date).format('YYYY-MM-DD')
        },
        buildReport(){
            let clubs = this.clubs
            let clubMapping = new Map()
            for(let index in clubs){
                clubMapping.set(clubs[index].id, index)
                clubs[index].search = []
                clubs[index].request = []
                clubs[index].totalSearch = 0
                clubs[index].totalRequest = 0
            }
            
            this.reportResponse.forEach((item)=>{
                const index = clubMapping.get(item.clubId)
                switch(item.trackTask){
                    case 'search':
                        clubs[index].search.push(item)
                        clubs[index].totalSearch++
                        break;
                    case 'request':
                        clubs[index].request.push(item)
                        clubs[index].totalRequest++
                        break;
                }
            })
            console.log(clubMapping, clubs)
            this.reportDisplay =
                (!this.safe(this.clientId)) 
                    ? clubs.sort((a,b) => b.totalRequest - a.totalRequest)
                    : clubs.filter((item) => item.id === this.clientId)
            this.loader = false
        }
    },
    mounted: function(){
        //Setup for MaterializeCss select plugin on the browser
        let elems = document.querySelectorAll('select');
        let options = {}
        const today = new Date()
        const datePickerOptions = {
            format:'yyyy-mm-dd',
            defaultDate:today,
            setDefaultDate: true,
            maxDate:today,
            onSelect:this.getSelectedDate,
            onClose:this.getReport,
            autoClose: true
        };
        this.selectInstances = M.FormSelect.init(elems, options);
        //Setup datepicker
        const datepicker = document.querySelectorAll('.datepicker');
        const instances = M.Datepicker.init(datepicker, datePickerOptions);
    }
}
</script>