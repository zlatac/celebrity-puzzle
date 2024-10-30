import progress from './components/progress';
import incidents from './utils/incidents'
import damages from './utils/damages'
import pieChartColorList from './utils/pieChartColorList'
import { mixin } from 'lodash';

const serviceProvider = {
    data: function(){
        return{
            modalInstance:null,
            modalData:{},
            loader: false,
            errorShake: false,
            toastInstance: null,
            errorToastOptions: {
                html: '🥺 Something went wrong. Please try again later',
                classes: 'red darken-1'
            },
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
        },
        triggerErrorShake() {
            this.errorShake = true
            setTimeout(() => {
                this.errorShake = false
            }, 1000)
        },
        updateHtmlTitle(text) {
            const titleElement = document.querySelector('title')
            titleElement.innerHTML = text
        }
    }
}

const search = Vue.component('search', {
    // dark theme: #101010
    // dark blue: #070b19
    // dark experiment:#252525
    template:'#search',
    mixins: [serviceProvider],
    data: function(){
        return {
            searchInput: '',
            searchStartDate: '',
            searchEndDate: '',
            startDatePickerInstance: undefined,
            endDatePickerInstance: undefined,
            loading: false,
            showModal: false,
            submitted: false,
            sampleReport: false,
            chartType: 'pie',
            autocompleteInstance: undefined,
            incidentReport: [
                ['Incident Type', 'amount',],
                [this.$APP_TENANT ? 'Illegal Action' : 'No Payment',     4], //$500 - 750 - $999 | 2000 - 3000 - 3996
                ['Property Damage', 1], //$1000 - 1250 - $1499 | 1000 - 1250 - 1499
                ['Contract Breach',  3], // $1 - 250 - $499 | 3 - 750 - 1497 
                ['Other', 2], // $0                     | 3003 - 5000 - 6992
            ],
            monetaryLossReport: [
                ['monetary loss', 'amount'],
                [this.$APP_TENANT ? 'Illegal Action' : 'No Payment',     3000],
                ['Property Damage', 1250],
                ['Contract Breach', 750],
                ['Other', 0],
            ],
            incidentSearchTable: [],
            incidentLandlordExampleTable: [ 
                {report:{incident:{incidentType: 'no_payment', amount: 999, dateOfIncident: '2-1-2021', summary: ''},landlord:{fullname: 'John Doe'},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '7-1-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'property_damage', amount: 1499, dateOfIncident: '25-2-2021',summary: 'Shooting fireworks indoors caused fire damage'},landlord:{ fullname: 'John Doe'},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '12-3-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'other', amount: 0, dateOfIncident: '7-4-2021', summary: 'Noise complaints from neighbours at 3am on a monday'},landlord:{fullname: 'John Doe'},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '8-4-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'no_payment', amount: 999, dateOfIncident: '2-5-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{ leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '7-5-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'contract_breach', amount: 499, dateOfIncident: '14-5-2021', summary: 'pets not allowed',},landlord:{ fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}}, reportedAt: '16-5-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'other', amount: 0, dateOfIncident: '19-6-2021', summary: 'domestic violence that put other tenants at risk',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '21-6-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'contract_breach', amount: 499, dateOfIncident: '1-6-2021', summary: 'pets not allowed',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}}, reportedAt: '2-6-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'contract_breach', amount: 499, dateOfIncident: '20-6-2021', summary: 'pets not allowed',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}}, reportedAt: '22-6-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'no_payment', amount: 999, dateOfIncident: '2-7-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}}, reportedAt: '8 -7-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'no_payment', amount: 999, dateOfIncident: '2-10-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}}, reportedAt: '7-10-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                // {incidentType: '', amount: '', dateOfIncident: '', summary: '', fullname: '', reportedAt: ''},
            ],
            incidentTenantExampleTable: [ 
                {report:{incident:{incidentType: 'illegal_action', amount: 999, dateOfIncident: '2-1-2021', summary: ''},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}}, reportedAt: '7-1-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'property_damage', amount: 1499, dateOfIncident: '25-2-2021', summary: 'Water damage to personal property due to ignored maintenance',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '12-3-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'other', amount: 0, dateOfIncident: '7-4-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '8-4-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'illegal_action', amount: 999, dateOfIncident: '2-5-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '7-5-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'contract_breach', amount: 499, dateOfIncident: '14-5-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '16-5-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'other', amount: 0, dateOfIncident: '19-6-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '21-6-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'contract_breach', amount: 499, dateOfIncident: '1-6-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '2-6-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'contract_breach', amount: 499, dateOfIncident: '20-6-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '22-6-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'illegal_action', amount: 999, dateOfIncident: '2-7-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1/1/2021 - 31/12/2021'}},  reportedAt: '8 -7-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                {report:{incident:{incidentType: 'illegal_action', amount: 999, dateOfIncident: '2-10-2021', summary: '',},landlord:{fullname: 'John Doe',},rentInfo:{leaseDuration: '1-1-2021 - 31-12-2021'}},  reportedAt: '7-10-2021', address:' 11 Wall St, New York, NY 10005, United States'},
                // {type: '', amount: '', dateOfIncident: '', summary: '', fullname: '', reportedAt: ''},
            ],
            pieChartIncidentInstance: undefined,
            pieChartMonterayLossInstance: undefined,
        }
    },
    created: function(){
        const correctDateFormat = /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/
        const address = this.$route.params.address
        const startDate = this.$route.params.startDate
        const endDate = this.$route.params.endDate
        if (this.safe(address)) {
            this.searchInput = address

            if (this.safe(startDate) && correctDateFormat.test(startDate)) {
                this.searchStartDate = startDate
            }
            if (this.safe(endDate) && correctDateFormat.test(endDate)) {
                this.searchEndDate = endDate
            }
        } 

    },
    mounted: function(){
        const today = new Date()
        const minDate = new Date()
        const currentYear = today.getFullYear()
        const eigtheenYearsAgo = currentYear - 18
        const ninetyYearsAgo = currentYear - 90
        const startMaxDate = today
        const endMaxDate = moment().add(1, 'y').toDate()
        // today.setYear(eigtheenYearsAgo)
        minDate.setYear(ninetyYearsAgo)
        minDate.setMonth(0)
        minDate.setDate(1)

        const options = (maxDate, endYearRange, onSelect) => {
            return {
                format: 'dd-mm-yyyy',
                yearRange: [ninetyYearsAgo, endYearRange],
                maxDate: maxDate,
                minDate,
                defaultDate: today,
                onSelect: onSelect
            }
        }
        this.startDatePickerInstance = M.Datepicker.init(this.$refs.startDate, options(today, currentYear, this.setDateInput.bind(this, 'startDate')))
        this.endDatePickerInstance = M.Datepicker.init(this.$refs.endDate, options(endMaxDate, currentYear + 1, this.setDateInput.bind(this, 'endDate')))
        google.charts.load('current', {'packages':['corechart']});
        this.autocompleteInstance = M.Autocomplete.init(this.$refs.addressSearch, {
            data: {
                // mooose: null
            },
            onAutocomplete: (val) => {this.searchInput = val}
        })
        if (this.$route.path.includes('sample-report')) {
            // on first load dependency is not fully ready
            google.charts.setOnLoadCallback(this.shortCutReport)
        }
    },
    methods: {
        setDateInput(dateType){
            switch(dateType){
                case 'startDate':
                    this.searchStartDate = this.startDatePickerInstance.toString()
                    break
                case 'endDate':
                    this.searchEndDate = this.endDatePickerInstance.toString()
                    break
                default:
            }
        },
        openDatePicker(event, dateType){
            event.preventDefault()
            switch(dateType){
                case 'startDate':
                    this.startDatePickerInstance.open()
                    break
                case 'endDate':
                    this.endDatePickerInstance.open()
                    break
                default:
            }
        },
        async searchFreeReport(){
            this.submitted = false
            this.sampleReport = false
            const valid = await this.$refs.form.validate()
            if (valid && !this.loading) {
                // const correctDateFormat = /[0-9]{2}-[0-9]{2}-[0-9]{4}/.test(dateOfBirth)
                try {
                    this.loading = true
                    const startDate = moment(this.searchStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
                    const endDate = moment(this.searchEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
                    const url = new URL(`${this.postUrl}/cbt/search/${this.$APP_TARGET}/${this.searchInput}/${startDate}/${endDate}`)
                    const res = await fetch(url.href, {
                        method: 'GET',
                    })
                    const data = await res.json()
                    data.forEach((i) => {
                        try {
                            i.report = JSON.parse(i.report)
                        } catch (error) {
                            //report is probably not parseable to JSON
                            i.report = {}
                        }
                        
                        return
                    })
                    this.incidentSearchTable = data.filter((i) => Object.keys(i.report).length > 0)
                    // make http request to find individual
                    // setTimeout(()=>{
                    //     this.loading = false
                    //     this.showModal = true
                    // }, 1500)
                    this.loading = false
                    this.showModal = true
                } catch (error) {
                    console.error(new Error(error))
                    M.toast(this.errorToastOptions)
                    this.loading = false
                } finally {
                    //this.loading = false
                }
            } else {
                this.submitted = true
                this.triggerErrorShake()
            }
        },
        startPaymentProcess() {
            // initiate payment step
        },
        getPaidReport() {
            // use invoice id to retrieve report 
        },
        generateIncidentReport(reportList) {
            const options = {
                title: `Number Of Incidents: ${reportList.length}`,
                pieHole: 0.4,
                pieSliceTextStyle: {
                    color: reportList.length == 1 ? 'black' : undefined,
                },
                slices: pieChartColorList,
                titleTextStyle: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: 15,
                }          
            }
            const reportData = this.getAggregateIncidentType(reportList)
            const formatData = google.visualization.arrayToDataTable(reportData)
            this.pieChartIncidentInstance = new google.visualization.PieChart(this.$refs.incidentReport);
            this.pieChartIncidentInstance.draw(formatData, options)
        },
        generateMonetaryLossReport(reportList) {
            const reportData = this.getAggregateMonetaryLoss(reportList)
            const options = {
                // title: 'Monetary Loss: $3,003 - $6,992',
                title: `Financial Impact: ~$${reportData.totalSum.toLocaleString()}`,
                pieHole: 0.4,
                pieSliceTextStyle: {
                    color: reportList.length == 1 ? 'black' : undefined,
                },
                slices: pieChartColorList,
                tooltip: {
                    text: 'percentage'
                },
                titleTextStyle: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: 15,
                },
            }
            const formatData = google.visualization.arrayToDataTable(reportData.listOfSums)
            this.pieChartMonterayLossInstance = new google.visualization.PieChart(this.$refs.monetaryLossReport);
            this.pieChartMonterayLossInstance.draw(formatData, options)
        },
        initiateChartReport(reportList = this.incidentTable){
            if (reportList.length < 1) {
                return
            }
            this.generateIncidentReport(reportList)
            this.generateMonetaryLossReport(reportList)
        },
        closeReportModal(){
            this.showModal = false
            this.sampleReport = false
            this.chartType = 'pie'
        },
        showSampleReport(){
            if (!this.showModal) {
                this.showModal = true
            }
            this.initiateChartReport()
        },
        shortCutReport(){
            this.$store.commit('SET_FOOTER_DISPLAY', false)
            this.sampleReport = true
            this.showModal = true

        },
        view(chartType){
            switch(chartType){
                case 'pie':
                    this.chartType = 'pie'
                    break
                case 'list':
                    this.chartType = 'list'
                    break
                default:
            }
        },
        async autoCompleteSearch(){
            const oldSearchValue = this.searchInput
            if (this.isSearchingForAutocomplete || this.searchInput.trim().length < 4) {
                return
            }
            try {
                this.isSearchingForAutocomplete = true
                const url = new URL(`${this.postUrl}/cbt/address/${this.searchInput}`)
                const res = await fetch(url.href, {
                    method: 'GET',
                })
                const data = await res.json()
                // const data = ['45 drake street', '68 moncton avenue', '79 monctons drive', '1602-23 barrel yards blvd waterloo ON N2L 0E3']
                if (Array.isArray(data) && data.length > 0) {
                    const map = new Map()
                    data.forEach(i => {
                        map.set(i.address, '')
                    })
                    this.autocompleteInstance.updateData(Object.fromEntries(map))
                }
            } catch (error) {
                
            } finally {
                this.isSearchingForAutocomplete = false
                if (oldSearchValue !== this.searchInput) {
                    this.autoCompleteSearch()
                }
            }
            
        },
        getAggregateIncidentType(reports){
            const totals = reports.reduce((allIncidents, incident) => {
                const incidentTypeDisplayName = this.$options.filters.incidentType(incident.report.incident.incidentType)
                if (!(incidentTypeDisplayName in allIncidents)) {
                    allIncidents[incidentTypeDisplayName] = 1
                    return allIncidents
                }
                allIncidents[incidentTypeDisplayName]++

                return allIncidents

            }, {})

            return [['Incident Type', 'amount']].concat(Object.entries(totals))
        },
        getAggregateMonetaryLoss(reports){
            const damagesMap = this.$options.filters.damages(undefined, true)
            let sumOfEverything = 0
            const totals = reports.reduce((allIncidents, incident) => {
                const incidentTypeDisplayName = this.$options.filters.incidentType(incident.report.incident.incidentType)
                const reportValue = damagesMap.get(Number(incident.report.incident.amount)).reportValue
                if (!(incidentTypeDisplayName in allIncidents)) {
                    allIncidents[incidentTypeDisplayName] = reportValue
                    sumOfEverything += reportValue 
                    return allIncidents
                }
                allIncidents[incidentTypeDisplayName] += reportValue
                sumOfEverything += reportValue

                return allIncidents

            }, {})

            return {
                totalSum: sumOfEverything,
                listOfSums: [['monetary loss', 'amount']].concat(Object.entries(totals))
            }
        },
        shareReport(){
            if ('share' in navigator) {
                navigator.share({
                    title: this.$APP_LANDLORD ? 'Tenant Report' : 'Landlord Report',
                    text: `See this ${this.$APP_TARGET_OPPOSITION} report now`,
                    url: this.shareReportLink
                })
                .catch((error) => {
                    console.error(new Error(error))
                })
            }
        }
    },
    computed: {
       isPie() {
           return this.chartType === 'pie'
       }, 
       isList() {
           return this.chartType === 'list'
       },
       incidentTable() {
           if (this.sampleReport) {
                if (this.$APP_TENANT) {
                    return this.incidentTenantExampleTable
                }

                return this.incidentLandlordExampleTable
           }
           
           return this.incidentSearchTable
       },
       noReportsFound(){
           return this.incidentTable.length < 1
       },
       incidentReportTitle(){
           return this.noReportsFound ? 'No Reports Found' :'Reports Found'
       },
       shareReportLink(){
        const origin = window.location.origin
        const route = `/#/report/${this.searchInput}/${this.searchStartDate}/${this.searchEndDate}`
        return `${origin}${route}`
       }
    },
    filters: {
        incidentType(value) {
            const map = new Map()
            incidents.map((i) => {
                map.set(i.value, i.name)
            })
            return map.get(value)
        },
        damages(value, returnMapOnly = false) {
            const map = new Map()
            damages.map((i) => {
                map.set(i.value, !returnMapOnly ? i.name : i)
            })
            if (returnMapOnly) {
                return map
            }

            return map.get(Number(value))
        },
        formatReportDate(value){
            try {
                const dateSplited = value.split('-')
                dateSplited[2] = dateSplited[2].substring(2)
                return dateSplited.join('/')
            } catch (error) {
                return value
            }
            
        }
    }
});



const rentInfo = {
    template:'#rent-info',
    mixins: [serviceProvider],
    data: function(){
        return {
            street: '',
            unitNumber: '',
            city: '',
            country: '',
            postalOrZipCode: '',
            submitted: false,
        }
    },
    mounted: function(){
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    },
    computed: {
        rentInfo(){
            const street = this.street
            const unitNumber = this.unitNumber
            const city = this.city
            const country = this.country
            const postalOrZipCode = this.postalOrZipCode.trim()
                .replace(' ', '')
                .toUpperCase()
            
            return {street, unitNumber, city, country, postalOrZipCode}
        }
    },
    methods: {
        async submit(){
            this.submitted =  false
            const valid = await this.$refs.form.validate()
            if (valid) {
                this.$emit('next', {rentInfo: this.rentInfo})
            } else {
                this.submitted = true
                this.triggerErrorShake()
            }
        }
    }
};

const tenantInfo = {
    template:'#tenant-info',
    mixins: [serviceProvider],
    data: function(){
        return {
            name: '',
            email: '',
            confirmEmail: '',
            // dateOfBirth: '',
            // rentAddress: '',
            // rentunitNumber: '',
            // rentCountry: '',
            // rentPostalCode: '',
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
            const email = this.email
            // const dateOfBirth = this.dateOfBirth
            return {name, email}
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
                this.triggerErrorShake()
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
                this.triggerErrorShake()
            }
        }
    }
};

const incident = {
    template:'#incident',
    mixins: [serviceProvider],
    props: ['navigation-progress'],
    data: function(){
        return {
            summary: '',
            amount: '',
            incidentType: '',
            incidentList: incidents,
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
        },
        displayIncidents(){
            return this.incidentList.filter(i => i[this.$APP_TARGET])
                .sort((a,b) => {
                    if (a.name > b.name) return 1
                    if (a.name < b.name) return -1

                    return 0
                })
        }
    },
    mounted: function(){
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
        new M.CharacterCounter(this.$refs.summary)

        const today = new Date()
        const minDate = new Date()
        const currentYear = today.getFullYear()
        const minimumYear = currentYear - 2
        minDate.setMonth(0)
        minDate.setDate(1)
        minDate.setFullYear(minimumYear)
        const dateOptions = {
            yearRange: [minimumYear,currentYear],
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
                this.submitted = true
                this.getAllFiles()
                this.$emit('next', {incident: this.incident})
            } else {
                this.submitted = true
                this.triggerErrorShake()
            }
        },
        getAllFiles(){
            this.files.proofImages = this.$refs.proofImages.value
            this.files.leaseAgreement = this.$refs.leaseAgreement.value
            // this.files.propertyTaxBill = this.$refs.propertyTaxBill.value
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
            <span v-show="!submitted">Pay - $9.99</span>
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
            let stripeResult = {}
            if (!this.submitted) {
                try {
                    this.submitted = true
                    this.errorMessage = ''
                    // First get transaction id
                    await this.getClientSecret()
                    // submit form data with transaction id
                    this.submissionId = await this.submitCall(this.paySecret)
                    // finalize payment
                    stripeResult = await this.stripe.confirmCardPayment(this.paySecret, {
                        payment_method: {
                            card: this.card,
                            billing_details: {
                                name: this.cardName
                            }
                        }
                    })
                    if (stripeResult.error) {
                        this.errorMessage = stripeResult.error.message
                        return
                    } else if(stripeResult.paymentIntent.status === 'succeeded') {
                        await this.confirmSuccessfulPayment()
                        // Show success message and hide pay elements
                        this.$emit('paySuccess')
                    }
                } catch(e) {
                    if ('paymentIntent' in stripeResult && stripeResult.paymentIntent.status === 'succeeded') {
                        this.$emit('paySuccess')
                    }
                    this.errorMessage = 'Something went wrong on our end. Please try again later'
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
    computed: {
        displayEmail(){
            if (this.$APP_LANDLORD) {
                return this.reportFiled.landlord.email
            }

            return this.reportFiled.tenant.email
        }
    }

}

const reportTenant = Vue.component('report-tenant', {
    template:'#report-tenant',
    mixins: [serviceProvider],
    components: {
        'rent-info': rentInfo,
        'tenant-info': tenantInfo,
        'landlord-info': landlordInfo,
        'incident': incident,
        'pay': pay,
        'pay-success': paySuccess
    },
    data: function(){
        return {
            step: 1,
            stepList: [
                'rent-info',
                'landlord-info',
                'incident',
                'pay',
            ],
            stepsConstants: {
                'rent-info': 'rentInfo',
                'tenant-info': 'tenant',
                'landlord-info': 'landlord',
                'incident': 'incident',
                'pay': 'pay',
            },
            showProgressStep: true,
            showPaySuccess: false,
            stepNaviagtionProgress: false,
            animateForward: false, 
            animateBackward: false,
            payDate: moment('21-06-2026','dd-mm-YYYY'),
            reportFiled: {
                rentInfo: {},
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
        },
        todayIsBeforePayDate(){
            return moment().isBefore(this.payDate)
        },
        steps(){
            let stepList = this.stepList
            if (this.todayIsBeforePayDate) {
                stepList = stepList.slice(0, this.stepList.length - 1)
            }
            if (this.$APP_TENANT) {
                const [firstItem, ...otherItems] = stepList
                stepList =  Array.of(firstItem, 'tenant-info', ...otherItems)
            }
            
            return stepList
        }
    },
    methods: {
       async goForward(payload){
           this.updateReportFilled(payload)
           if (!this.stepNaviagtionProgress && this.step === this.steps.length && this.todayIsBeforePayDate) {
               try {
                this.stepNaviagtionProgress = true
                const email = this.$APP_LANDLORD ? this.reportFiled.landlord.email : this.reportFiled.tenant.email
                await this.submitReportFilled(email)
                this.paySuccess()
               } catch (error) {
                   console.error(new Error(error))
                   M.toast(this.errorToastOptions)
               } finally {
                    this.stepNaviagtionProgress = false
                    return
               }
           }
           if (this.step !== this.steps.length) {
               this.stepNaviagtionProgress = true
               this.step++
               this.animateBackward = false
               this.animateForward = true
               this.stepNaviagtionProgress = false
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
           const key = this.stepsConstants[this.$refs.currentComponent.$vnode.componentOptions.tag]
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
           formData.append('rentInfo', JSON.stringify(this.reportFiled.rentInfo))
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
           formData.append('reporter', this.$APP_TARGET)
           //formData.append('proofImages[]', files.proofImages)

           const resp = await fetch(`${this.postUrl}/cbt`, {
                method: 'POST',
                body: formData,
           })

           const data = await resp.json()
           if (resp.status === 200 && data) {
            return Promise.resolve(data)
           }
       },
       paySuccess(){
           this.step = 5
           this.showProgressStep = false
           this.showPaySuccess = true
       }   
    }
});

const aboutUs = {
    template: '#about-us',
}

const home = {
    template: '#home',
    data: function(){
        return {
            incidentList: incidents,
        }
    }
}

const faq = {
    template: '#faq',
    data: function(){
        return {
            collapsibleInstance: undefined,
            collapsibleOptions: {
                accordion: true
            }
        }
    },
    mounted(){
        this.collapsibleInstance = M.Collapsible.init(this.$refs.collapse, this.collapsibleOptions)
    }
}

const terms = Vue.component('terms', {
    template:'#terms',
});

const token = {
    template: '#token',
    mixins: [serviceProvider],
    data: function(){
        return {
           shares: 0,
           items: [
            {price: 0, sharePercentage: 100, value: 0}
           ],
           moveOptionBucket: [],
        }
    },
    mounted() {
        this.$store.commit('SET_FOOTER_DISPLAY', false)
        const header = document.querySelector('header')
        const [nameLink, buttonLink] = header.children
        const shareElement = document.createElement('i');
        const nameElement = document.createElement('a');
        nameElement.textContent = 'Stock Exit Plan'
        nameElement.href = location.href
        nameElement.classList.add('main-text')
        nameLink.remove()
        buttonLink.remove()
        shareElement.classList.add('material-icons','cursor-pointer')
        shareElement.textContent = 'share'
        shareElement.addEventListener('click', this.share)
        header.appendChild(nameElement)
        header.appendChild(shareElement)

        if('shares' in this.$route.query) {
            this.shares = this.$route.query.shares
        }

        if('plan' in this.$route.query) {
            this.items = JSON.parse(decodeURI(this.$route.query.plan))
        }

        this.updateHtmlTitle('Stock Exit Plan')
    },
    computed: {
        optionValues() {
            return this.items.map((i) => ({
                value: (i.price * (1/100 * i.sharePercentage) * this.shares),
                sharePercentage: Number(i.sharePercentage),
            }));
        },
        total() {
            let income = 0
            let sharePercentage = 0
            this.optionValues.forEach((i) => {
                income += Number(i.value)
                sharePercentage += Number(i.sharePercentage)
            })
            return {income, sharePercentage}
        },
        shareLink() {
            const urlParams = new URLSearchParams()
            urlParams.set('shares', this.shares)
            urlParams.set('plan',  encodeURI(JSON.stringify(this.items)))
            return`${location.href}?${urlParams.toString()}`
        }
    },
    methods: {
        addNewOption() {
            const lastPrice = this.items[this.items.length - 1].price
            this.items.push({price: lastPrice, sharePercentage: '', value: 0})
        },
        deleteOption(index) {
            return this.items.splice(index, 1);
        },
        prepareToMoveOption(index) {
            if (this.moveOptionBucket.length === 2 || this.moveOptionBucket.includes(index)) {
                return
            }
            this.moveOptionBucket.push(index)
            if (this.moveOptionBucket.length === 2) {
                this.moveOption()
            }
        },
        moveOption() {
            const removedItem = this.deleteOption(this.moveOptionBucket[0])
            this.items.splice(this.moveOptionBucket[1], 0, ...removedItem)
            this.moveOptionBucket = []
        },
        share() {
            if ('share' in navigator) {
                navigator.share({
                    title: 'Stock Exit Plan',
                    text: '',
                    url: this.shareLink
                })
                .catch((error) => {
                    console.error(new Error(error))
                })
            }
        },
    },
    filters: {
        numberFormat(val) {
            return new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Number(val))
        }
    }
}

Vue.component('collapse', {
    template: `
    <ul class="collapsible" :class="classes" ref="collapseComponent">
      <slot></slot>
    </ul>
    `,
    props: ['classes', 'accordion'],
    data: function(){
        return {
            collapsibleInstance: undefined,
        }
    },
    computed: {
        collapsibleOptions(){
            return {
                accordion: this.accordion || false
            }
        }
    },
    mounted(){
        this.collapsibleInstance = M.Collapsible.init(this.$refs.collapseComponent, this.collapsibleOptions)
    }
});

Vue.component('collapse-item', {
    props: ['header-class', 'more-icon', 'classes'],
    template: `
    <li :class="classes">
        <div class="collapsible-header" :class="headerClass">
            <slot name="header"></slot>
            <i v-show="moreIcon" class="more-icon grey-text text-lighten-1 material-icons" style="position: absolute;right: -7px;top: 0;margin: 0;"></i>
        </div>
        <div class="collapsible-body">
            <slot name="body"></slot>
        </div>
    </li>
    `,
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
    props:['colorClass', 'size'],
    template:`
        <div class="preloader-wrapper small active" :style="sizeStyle">
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
    `,
    computed: {
        sizeStyle(){
            return `width:${this.size}px; height:${this.size}px`
        }
    }
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
        <div class="close-body cursor-pointer" @click="closeSlideModal">
            <i class="material-icons animated fadeInUp">cancel</i>
        </div>
        <div class="dj-modal-body animated slideInUp">
            <slot></slot>
        </div>
    </div>
    `,
    props:['show'],
    mounted(){
        this.$emit('slideMounted')
    },
    methods: {
        closeSlideModal() {
            this.$emit('close')
            this.$store.commit('SET_FOOTER_DISPLAY', true)
        }
    }

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

Vue.filter('capitalize', function (value) { 
    if(value && typeof value === 'string'){
        return `${value[0].toUpperCase()}${value.substring(1)}`
    }
    return value
});

const store = new Vuex.Store({
    //state management in VUE
    state:{
        url: serviceProvider.data().noProfileUrl,
        footerDispaly: true,
    },
    mutations:{
        url(state, data){
            state.url = data;
        },
        SET_FOOTER_DISPLAY(state, data){
            state.footerDispaly = data;
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
VeeValidate.extend('zip_code', {
    validate(value, args) {
        const sanitizedValue = value.trim().replace(' ', '')
        const postalcode = /^[a-zA-Z][0-9][a-zA-Z][0-9][a-zA-Z][0-9]$/
        const zipcode = /^[0-9]{5}(-[0-9]{4})?$/
        const ukPostalCode = /^[A-z0-9]{2,4}[0-9][A-z][A-z]$/ //https://ideal-postcodes.co.uk/guides/uk-postcode-format
        const countryCode = args.country
        switch(countryCode){
            case 'US':
                if (zipcode.test(sanitizedValue)) {
                    return true
                }
                return 'Zip code is invalid'
                break
            case 'CA':
                if (postalcode.test(sanitizedValue)) {
                    return true
                }
                return 'Postal code is invalid' 
                break
            case 'UK':
                if (ukPostalCode.test(sanitizedValue)) {
                    return true
                }
                return 'Postal code is invalid' 
                break
            default:
                return (
                    (zipcode.test(sanitizedValue)) ||
                    (postalcode.test(sanitizedValue)) ||
                    (ukPostalCode.test(sanitizedValue))
                )
        }
    },
    params: ['country'],
})

Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

const routes = [
  { path: '/', component: home },
  { path: '/report/:address/:startDate?/:endDate?', component: search },
//   { path: '/terms', component: terms },
  { path: '/about', component: aboutUs },
  { path: '/faq', component: faq },
  { path: '/search', component: search },
  { path: '/sample-report', component: search },
  { path: '/report-tenant', component: reportTenant },
  { path: '/report-landlord', component: reportTenant },
  { path: '/token', component: token },
  { path: '*', redirect: '/' }, // wild card situations since the shared url could be modified by users
];
const router = new VueRouter({
  routes, // short for `routes: routes`
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

const origin = window.location.origin
const pathname = window.location.pathname

// Global variables
Vue.prototype.$APP_NAME = origin.includes('reporttenant') ? 'RT' : origin.includes('reportlandlord') ? 'RL' : 'CBT'
Vue.prototype.$APP_EMAIL = `info@${window.location.hostname}`
Vue.prototype.$APP_TENANT = origin.includes('reportlandlord') || (origin.includes('localhost') && pathname.includes('reportlandlord'))
Vue.prototype.$APP_LANDLORD = !Vue.prototype.$APP_TENANT
Vue.prototype.$APP_TARGET = Vue.prototype.$APP_TENANT ? 'tenant' : 'landlord'
Vue.prototype.$APP_TARGET_OPPOSITION = Vue.prototype.$APP_TARGET === 'tenant' ? 'landlord' : 'tenant'
Vue.prototype.$APP_TARGET_FANCY_NAME =  Vue.prototype.$APP_TENANT ? 'tenant' : 'rental investor'
Vue.prototype.$APP_URL = {
    tenant: 'https://reportlandlord.app',
    landlord: 'https://reporttenant.com'
}

var app = new Vue({
    template: '#main-app',
    router:router,
    store:store,
    created() {
        if (this.$APP_TENANT) {
            serviceProvider.methods.updateHtmlTitle(`Search/Report ${this.$APP_TARGET_OPPOSITION}`)
        }
    }
}).$mount('#app');