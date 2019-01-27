<template>
    <div>
        <div class="background"></div>
        <div class="color-overlay"></div>
        <div class="center-align white-text" style="font-family: 'Oswald', cursive;">
            <div style="font-size: 40px;margin-top: 7%;font-weight: bold;letter-spacing: 3px;">
                <div>BLESSMYREQUEST</div>
                <img class="circle" style="margin-top: 50px;width:180px;height:180px;" :src="logo">
            </div>
            <spinner class="animated fadeIn" style="margin-top:100px" :colorClass="'white'"></spinner>
        </div>
    </div>
</template>
<script>
import serviceProvider from '../mixin.js'
export default {
    // dark theme: #101010
    // dark blue: #070b19
    // dark experiment:#252525
    mixins: [serviceProvider],
    created: function(){
        fetch(`https://styleminions.co/api/bmrclients`)
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
                this.$store.commit('clubs',res)
                setTimeout(()=>{
                    this.$router.push('/home');
                },2000)
            }else if(res === 'fail'){
    
            }                    
        })
    
    }
}
</script>