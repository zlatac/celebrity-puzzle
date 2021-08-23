import progress from './components/progress';
const serviceProvider = {
    data: function(){
        return{
            modalInstance:null,
            modalData:{},
            loader: false,
            toastInstance: null,
            noProfileUrl:'data:image/png;base64,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',
            logo:"https://drive.google.com/uc?id=1ctizeSjjAuaEKuOWPgIjau7A5LNcMA7Q",
            appLogoImage: 'data:image/jpeg;base64,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'
        }
    },
    computed:{
        isWindowBig(){
            return this.checkWindow()
        },
        deviceId(){
            if('deviceId' in localStorage){
                return localStorage.deviceId
            }else{
                return 'empty'
            }
        },
        isLocalhost(){
            return location.href.includes(':8000') || location.href.includes('localhost')
        },
        postUrl(){
            return this.isLocalhost ? 'http://localhost:8081': 'https://styleminions.co/api'
        }

    },
    mounted: function(){
        let modal = document.querySelector('.modal');
        let tooltip = document.querySelector('.tooltipped');
        let modalOptions = {}
        //if (this.$route.path.includes('game')) modalOptions.dismissible = false
        if (modal) this.modalInstance = M.Modal.init(modal,modalOptions);
        if (tooltip) M.Tooltip.init(tooltip);
                            
    },
    destroy:function(){
        this.modalInstance.destroy()
        
    },
    methods:{
        safe : function safe (a){
            if(a === undefined || a === null || a === ''){
                return false;
            }
            return true;
        },
        checkWindow: function(){
            if(window.innerWidth > 600 && window.innerWidth > 768){
                //768px is for tablet (ipad)
                return true;
            }
            return false;
	    },
        randomize : function(array) {
			//Algorithm to shuffle an array
			var input = array;

			for (var i = input.length-1; i >=0; i--) {

				var randomIndex = Math.floor(Math.random()*(i+1)); 
				var itemAtIndex = input[randomIndex]; 

				input[randomIndex] = input[i]; 
				input[i] = itemAtIndex;
			}
			return input;
        },
        toggleModal: function(modalData){
            this.modalData = modalData
            this.modalInstance.open();
        },
        generateDeviceId: function(skipredirect){
            //if skipredirect is not true redirect to dash page
            axios('/myipaddress')
            .then((res)=> {
                let ip = res.data
                let unixtime = moment().unix()
                let hash = generateHash(ip,unixtime)
                localStorage.deviceId = hash
            })
            .catch((error)=> {console.warn(new Error(error))})
            .finally(()=>{
                if(skipredirect !== true){
                    this.sendToCategory()
                    console.log('wow')
                } 
            
            })
            function generateHash(ip,time){
                //hash structure is [ip address + time + (ip-random)(time-random)(ip-random)]
                let address = ip.replace('.','')
                let stringtime = String(time)
                let hash = ''
                for(let i=0; i < 3; i++){
                    if(i !== 1){
                        hash += address[Math.floor(Math.random()*address.length)]
                    }else{
                        hash += stringtime[Math.floor(Math.random()*stringtime.length)]
                    }
                }
                return `${ip}-${time}-${hash}`
            }
        },
        clearInterval:function(intervalInstance){
            if(this.safe(intervalInstance)){
                clearInterval(intervalInstance)
            }            
        },
        closeModal(){
            this.modalInstance.close()
        },
        inputHighlight(){
            let input = document.querySelector('#search')
            input.focus()
            input.setSelectionRange(0, 9999)
        },
        webSocket(){
            if('io' in window){
                //var socket = io('https://mochanow.com');
                var socket = io();
                return socket;
            }
                    
        },
        trackAction(dataObject){
            dataObject.clubId = this.appName
            let payload = JSON.stringify(dataObject)
            axios.post(`https://styleminions.co/api/blessmyrequest?payload=${payload}`)
        },
        isMobileOrTablet(){
            const maxTabletWidth = 768
            return window.innerWidth <= maxTabletWidth
        },
        isIOS(){
            return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        },
        openDatePicker(event){
            event.preventDefault()
            const datePickerInstance = M.Datepicker.getInstance(event.target)
            datePickerInstance.open()
        },
        setDate(){
            const dateInputs = Object.values(document.querySelectorAll('.date-input'))
            const dateInputInstances = dateInputs.map((item) => M.Datepicker.getInstance(item))
            const instanceWithOpenDatePicker = dateInputInstances.filter(item => item.isOpen === true)
            if (instanceWithOpenDatePicker.length === 1) {
                const vueDataProperty = instanceWithOpenDatePicker[0].el.getAttribute('data-vm')
                this.$set(this,vueDataProperty, instanceWithOpenDatePicker.toString())
            }
        },
        instantiateDatePicker(dateOptions){
            let additionalOptions = {}
            const defaultOptions = {
                format: 'dd-mm-yyyy',
                onSelect: this.setDate
            }
            if (typeof dateOptions === 'object') {
                additionalOptions = {...dateOptions}
            }
            
            const dateInputs = document.querySelectorAll('.date-input')
            M.Datepicker.init(dateInputs, {...defaultOptions,...additionalOptions})
        }
    }
}

const landing = Vue.component('landing', {
    // dark theme: #101010
    // dark blue: #070b19
    // dark experiment:#252525
    template:'#landing',
    mixins: [serviceProvider],
    mounted: function(){
        const today = new Date()
        const minDate = new Date()
        const currentYear = today.getFullYear()
        const eigtheenYearsAgo = currentYear - 18
        const ninetyYearsAgo = currentYear - 90
        today.setYear(eigtheenYearsAgo)
        minDate.setYear(ninetyYearsAgo)
        minDate.setMonth(0)
        minDate.setDate(1)

        const options = {
            format: 'dd-mm-yyyy',
            yearRange: [ninetyYearsAgo,eigtheenYearsAgo],
            maxDate: today,
            minDate,
            defaultDate: today,
            onSelect: this.setDateOfBirth
        }
        this.datePickerInstance = M.Datepicker.init(this.$refs.date, options)
    },
    data: function(){
        return {
            searchInput: '',
            searchDate: '',
            datePickerInstance: undefined,
            loading: false,
            showModal: false,
            showErrorDate: false,
        }
    },
    methods: {
        setDateOfBirth(){
            this.searchDate = this.datePickerInstance.toString()
            this.showErrorDate = false
        },
        openDatePicker(event){
            event.preventDefault()
            this.datePickerInstance.open()
        },
        searchFreeReport(){
            this.showErrorDate = false
            if (this.safe(this.searchInput) && !this.loading) {
                const dateOfBirth = this.searchDate
                const correctDateFormat = /[0-9]{2}-[0-9]{2}-[0-9]{4}/.test(dateOfBirth)
                if (this.safe(dateOfBirth) && correctDateFormat) {
                    try {
                        this.loading = true
                        // make http request to find individual
                        setTimeout(()=>{
                            this.showModal = true
                            this.loading = false
                        }, 1500)
                        //this.showModal = true
                    } catch (error) {
                        console.error(new Error(error))
                    } finally {
                        //this.loading = false
                    }
                } else {
                    this.showErrorDate = true
                }
            }
        },
        startPaymentProcess() {
            // initiate payment step
        },
        getPaidReport() {
            // use invoice id to retrieve report 
        }
    }
});

const tenantInfo = {
    template:'#tenant-info',
    mixins: [serviceProvider],
    data: function(){
        return {
            name: '',
            dateOfBirth: '',
            submitted: false,
        }
    },
    mounted: function(){
        const today = new Date()
        const minDate = new Date()
        const currentYear = today.getFullYear()
        const eigtheenYearsAgo = currentYear - 18
        const ninetyYearsAgo = currentYear - 90
        today.setYear(eigtheenYearsAgo)
        minDate.setYear(ninetyYearsAgo)
        minDate.setMonth(0)
        minDate.setDate(1)
        const dateOptions = {
            yearRange: [ninetyYearsAgo,eigtheenYearsAgo],
            minDate,
            maxDate: today,
            defaultDate: today,
        }
        this.instantiateDatePicker(dateOptions)
    },
    computed: {
        tenant(){
            const name = this.name
            const dateOfBirth = this.dateOfBirth
            return {name, dateOfBirth}
        }
    },
    methods: {
        async submit(){
            this.submitted =  false
            const valid = await this.$refs.form.validate()
            if (valid) {
                this.$emit('next', {tenant: this.tenant})
            } else {
                this.submitted = true
            }
        }
    }
};
const landlordInfo = {
    template:'#landlord-info',
    mixins: [serviceProvider],
    data: function(){
        return {
            fullname: '',
            email: '',
            confirmEmail: '',
            submitted: false,
        }
    },
    computed: {
        landlord(){
            const fullname = this.fullname
            const email = this.email
            return {fullname, email}
        }
    },
    methods: {
        async submit(){
            this.submitted =  false
            const valid = await this.$refs.form.validate()
            if (valid) {
                this.$emit('next', {landlord: this.landlord})
            } else {
                this.submitted = true
            }
        }
    }
};
const incident = {
    template:'#incident',
    mixins: [serviceProvider],
    data: function(){
        return {
            summary: '',
            amount: '',
            incidentType: '',
            dateOfIncident: '',
            tooltip: "This information is used to assess the legitimacy of your report",
            files: {
                proofImages: [],
                leaseAgreement: [],
                propertyTaxBill: [],
            },
            submitted: false,
        }
    },
    computed: {
        incident(){
            const summary = this.summary
            const amount = this.amount
            const incidentType = this.incidentType
            const dateOfIncident = this.dateOfIncident
            const files = this.files
            return {summary, amount, incidentType, dateOfIncident, files}
        }
    },
    mounted: function(){
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
        new M.CharacterCounter(this.$refs.summary)

        const today = new Date()
        const minDate = new Date()
        const currentYear = today.getFullYear()
        minDate.setMonth(0)
        minDate.setDate(1)
        const dateOptions = {
            yearRange: [currentYear,currentYear],
            minDate,
            maxDate: today,
            defaultDate: today,
        }
        this.instantiateDatePicker(dateOptions)
    },
    methods: {
        async submit(){
            this.submitted =  false
            const valid = await this.$refs.form.validate()
            if (valid) {
                this.getAllFiles()
                this.$emit('next', {incident: this.incident})
            } else {
                this.submitted = true
            }
        },
        getAllFiles(){
            this.files.proofImages = this.$refs.proofImages.value
            this.files.leaseAgreement = this.$refs.leaseAgreement.value
            this.files.propertyTaxBill = this.$refs.propertyTaxBill.value
        }
    }
};

const pay = {
    template: `
    <form id="payment-form" @submit.prevent="submit">
        <h3>Review Fee <i class="material-icons tooltipped" data-position="top" :data-tooltip="tooltip">help</i></h3>
        <div class="input-field">
            <input
                id="card-payment-name"
                type="text"
                required
                v-model="cardName">
            <label for="card-payment-name">Name of Cardholder</label>
        </div>
        <div id="card-element" ref="pay">
        <!-- Elements will create input elements here -->
        </div>
    
        <!-- We'll put the error messages in this element -->
        <div id="card-errors" class="error" role="alert" style="margin-top: 7px;">{{errorMessage}}</div>
    
        <button id="submit" class="btn navigate-alone" style="margin-top: 7px;" :class="{'disabled': submitted}">
            <span v-show="!submitted">Pay - $29.99</span>
            <spinner color-class="white" v-show="submitted"></spinner>
        </button>
    </form>
    `,
    props: ['submit-call'],
    mixins: [serviceProvider],
    data: function(){
        return {
            paySecret: '',
            payInstance: undefined,
            card: undefined,
            stripe: undefined,
            cardName: '',
            errorMessage: '',
            submitted: false,
            submissionId: 0,
            tooltip: "This fee is to review & confirm the legitimacy of your report based on the information you've provided",
        }
    },
    async mounted(){
        this.setupElements()
        this.mountPayment()
    },
    methods: {
        setupElements(){
            this.stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
            this.payInstance = this.stripe.elements()
        },
        mountPayment(){
            const style = {
                base: {
                    color: "#32325d",
                }
            };
              
            this.card = this.payInstance.create("card", {style});
            this.card.mount(this.$refs.pay);
            this.card.on('change', ({error}) => {
                if (error) {
                    this.errorMessage = error.message
                } else {
                    this.errorMessage = ''
                }
            })
        },
        async getClientSecret(){
            const response = await fetch('/paySecret');
            const data = await response.json();
            this.paySecret = data.client_secret
        },
        async submit(){
            if (!this.submitted) {
                try {
                    this.submitted = true
                    // First get transaction id
                    await this.getClientSecret()
                    // submit form data with transaction id
                    this.submissionId = await this.submitCall(this.paySecret)
                    // finalize payment
                    const result = await this.stripe.confirmCardPayment(this.paySecret, {
                        payment_method: {
                            card: this.card,
                            billing_details: {
                                name: this.cardName
                            }
                        }
                    })
                    if (result.error) {
                        this.errorMessage = result.error.message
                        return
                    } else if(result.paymentIntent.status === 'succeeded') {
                        await this.confirmSuccessfulPayment()
                        // Show success message and hide pay elements
                        this.$emit('paySuccess')
                    }
                } catch(e) {

                } finally {
                    this.submitted = false
                }
            }
            
        },
        async confirmSuccessfulPayment(){
            await fetch(`${this.postUrl}/cbt/${this.submissionId}/${this.paySecret}`, {
                method: 'POST',
            })
        }
    }
}

const paySuccess = {
    template: '#pay-success',
    props: ['report-filed'],

}

const reportTenant = Vue.component('report-tenant', {
    template:'#report-tenant',
    mixins: [serviceProvider],
    components: {
        'tenant-info': tenantInfo,
        'landlord-info': landlordInfo,
        'incident': incident,
        'pay': pay,
        'pay-success': paySuccess
    },
    data: function(){
        return {
            step: 1,
            steps: [
                'tenant-info',
                'landlord-info',
                'incident',
                'pay',
            ],
            showProgressStep: true,
            showPaySuccess: false,
            animateForward: false, 
            animateBackward: false, 
            reportFiled: {
                // Must be in order of steps data property
                tenant: {},
                landlord: {},
                incident: {}
            }
        }
    },
    computed: {
        formStep(){
            if (this.showPaySuccess) {
                return 'pay-success'
            }
            return this.steps[this.step - 1]
        }
    },
    methods: {
       goForward(payload){
           this.updateReportFilled(payload)
           if (this.step !== this.steps.length) {
               this.step++
               this.animateBackward = false
               this.animateForward = true
           }
       },
       goBackward(){
            if (this.step > 1) {
                this.step--
                this.animateForward = false
                this.animateBackward = true
            }
       },
       updateReportFilled(payload){
           const key = Object.keys(this.reportFiled)[this.step - 1]
            if (key in payload) {
                this.reportFiled[key] = payload[key]
            }
       },
       // Called inside payment component
       async submitReportFilled(transactionId){
           const formData = new FormData()
           let incident, files
           ({files, ...incident} = this.reportFiled.incident)
           formData.append('tenant', JSON.stringify(this.reportFiled.tenant))
           formData.append('landlord', JSON.stringify(this.reportFiled.landlord))
           formData.append('incident', JSON.stringify(incident))
           if (this.safe(files.propertyTaxBill[0])) {
               formData.append('propertyTaxBill', files.propertyTaxBill[0])
           }
           formData.append('leaseAgreement', files.leaseAgreement[0])
           files.proofImages.forEach((item) => {
            formData.append('proofImages[]', item)
           })
           formData.append('transactionId', transactionId)
           //formData.append('proofImages[]', files.proofImages)

           const resp = await fetch(`${this.postUrl}/cbt`, {
                method: 'POST',
                body: formData,
           })

           const data = await resp.json()
           if (resp.status === 200 && data) {
            return Promise.resolve(data)
           }
           
           console.log(data)
       },
       paySuccess(){
           this.step = 5
           this.showProgressStep = false
           this.showPaySuccess = true
       }   
    }
});

const terms = Vue.component('terms', {
    template:'#terms',
});

Vue.component('modal',{
    props:['modalPage'],
    template:'#comp-modal',
    mixins: [serviceProvider],
    methods: {
        submitModal(){
            this.$emit('submit',this.inputProfile)
            this.inputProfile = ''
        },
        closeModal(){
            this.$emit('close')
            this.inputProfile = ''
        }
    }
})

Vue.component('champion',{
    props:['index','url'],
    template:`
        <div style="position: relative;">
            <img :src="url" alt="" class="circle responsive-img img-lead" v-imgfallback>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3 animated tada infinite" v-if="index === 0"><i class="fa fa-trophy gold"></i></span>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 1"><i class="fa fa-trophy silver"></i></span>
            <span class="btn btn-small btn-floating lead-champ-fab pulse z-depth-3" v-if="index === 2"><i class="fa fa-trophy bronze"></i></span>
            <span class="btn btn-small btn-floating lead-fab z-depth-3" v-if="index > 2">{{index + 1}}</span>
        </div>
    `
});
Vue.component('spinner',{
    props:['colorClass'],
    template:`
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
    bind: function(el,binding,vnode){
        el.onfocus = function(){
            vnode.context.isSearchFocused = true
            if(el.value !== ''){
                el.setSelectionRange(0, 9999)
            } 
            //console.log('i am focused')
        }
        el.onkeyup = function(event){
            if(event.keyCode === 13){ //code for submit 
                el.blur()
            }
            //console.log('am submitted',event) 
        }
        el.onblur = function(){
            vnode.context.isSearchFocused = false
            console.log('not in focus anymore')
            //vnode.context.toggleSearch()

        }
    },
    componentUpdated: function(el,binding,vnode,oldVnode){
        //console.log('a change happened for the directive',vnode)
        if(binding.value !== binding.oldValue){
            console.log('now i have a reason to do stuff')
            if(binding.value === true){
                el.focus()
            }
            if(binding.value === false){
                el.blur()
            }
        }
    }
});

Vue.component('badge', {
    template: `
    <div class="component">
        <div class="dj-chip chip animated fadeInRight" @click="show = true">
        <img :src="imageUrl" :alt="badgeName">
        {{badgeName}}
        </div>
        <slide-modal :show="show" @close="hideSlideModal">
            <slot></slot>
        </slide-modal>
    </div>
    `,
    mixins: [serviceProvider],
    props: ['name'],
    data: function(){
        return {
            show: false,
        }
    },
    computed: {
        imageUrl(){
            const routeId = this.$route.params.id
            if(routeId === this.$store.state.badge.appName){
                return this.$store.state.badge.image
            }
            
            return this.noProfileUrl
        },
        badgeName(){
            if (this.safe(this.name)){
                return this.name
            }
            return 'Host'
        }
    },
    methods: {
        hideSlideModal(){
            this.show = false
            this.$emit('close-badge')
        }
    }

});
Vue.component('slide-modal', {
    template: `
    <div class="dj-modal-container" v-if="show">
        <div class="close-body" @click="$emit('close')">
            <i class="material-icons animated fadeInUp">cancel</i>
        </div>
        <div class="dj-modal-body animated slideInUp">
            <slot></slot>
        </div>
    </div>
    `,
    props:['show'],

});
Vue.directive('imgfallback', {
    bind: function(el,binding,vnode){
        let fallback = serviceProvider.data().noProfileUrl;
        //let fallback = vnode.context.$parent.noProfileUrl
        el.onerror = function(){
            if(el.src !== fallback){
                el.src = fallback
                //console.log(vnode)
            }
        }
    }
});

Vue.filter('number', function (value) {
  value = Number(value)
  return Math.round(value)
});

Vue.filter('truncate', function (value) {
    if(value && value.length > 20){
        return value.slice(0,20)
    }
    return value
});

const store = new Vuex.Store({
    //state management in VUE
    state:{
        url: serviceProvider.data().noProfileUrl,
    },
    mutations:{
        url(state, data){
            state.url = data;
        }
    }
})

const validateDictionary = {
    en: {
        messages:{
            ext: (fieldName, params, data) => {
                const list = Object.entries(params) //[[0,v],[1,v]]
                    .filter(i => Number(i[0]) >= 0)
                    .map(i => i[1])
                const moreThanOneFile = list.length > 1
                const plural = moreThanOneFile ? 's' : ''
                const allExtenstions = list.join(', ').toUpperCase()
                return `File${plural} must be (${allExtenstions})`
            },
            size: (fieldName, params) => {
                const fileSizeInMegaBytes = params.size/1000
                return `File size must be less than ${fileSizeInMegaBytes}MB`
            }
        }
    }
}
VeeValidate.localize(validateDictionary)
VeeValidate.extend('email', VeeValidate.Rules.email)
VeeValidate.extend('confirmed', VeeValidate.Rules.confirmed)
VeeValidate.extend('required', VeeValidate.Rules.required)
VeeValidate.extend('is_not', VeeValidate.Rules.is_not)
VeeValidate.extend('ext', VeeValidate.Rules.ext)
VeeValidate.extend('size', VeeValidate.Rules.size)
VeeValidate.extend('length', VeeValidate.Rules.length)
VeeValidate.extend('image', VeeValidate.Rules.image)
VeeValidate.extend('max', VeeValidate.Rules.max)
VeeValidate.extend('file_max', {
    validate(value, args) {
        const length = value.length;
        if (length <= args.max) {
            return true
        }
    
        return `Max # of files is ${args.max}. You added ${length}`;
      },
      params: ['max'],
})

Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

const routes = [
  { path: '/', component: landing },
  //{ path: '/terms', component: terms },
  { path: '/report-tenant', component: reportTenant },
  { path: '*', redirect: '/' }, // wild card situations since the shared url could be modified by users
];
const router = new VueRouter({
  routes // short for `routes: routes`
});

var app = new Vue({
    router:router,
    store:store
}).$mount('#myapp');