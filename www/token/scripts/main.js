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

const token = {
    template: '#token',
    mixins: [serviceProvider],
    data: function(){
        return {
           shares: '',
           items: [
            {price: '', marketCap: '', sharePercentage: 100, value: 0, title: '', titleInputDisplay: false,}
           ],
           moveOptionBucket: [],
           isMarketCap: false,
           tokenSupply: {
            toby: 420000000000000,
           },
           tokenName: 'toby',
           isModalDisplayed: false,
           imageUrl: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=98,h=95,fit=crop/Yg25V2x6JviO83we/satoby-YX4P9BvbrBtjDW3Y.png'
        }
    },
    mounted() {
        if('shares' in this.$route.query) {
            this.shares = this.$route.query.shares
        }

        if('plan' in this.$route.query) {
            this.items = JSON.parse(decodeURI(this.$route.query.plan))
        }

        if('mcap' in this.$route.query) {
            this.isMarketCap = this.$route.query.mcap === 'true'
        }

        this.$store.commit('SET_FOOTER_DISPLAY', false)
        const header = document.querySelector('header')
        const [nameLink, buttonLink] = header.children
        const shareElement = document.createElement('i');
        const settingsElement = document.createElement('i');
        const nameElement = document.createElement('a');
        const headerRigthSide = document.createElement('div');
        nameElement.textContent = this.isMarketCap ? 'Toby Exit Plan': 'Stock Exit Plan'
        nameElement.href = location.href
        nameElement.classList.add('main-text')
        nameLink.remove()
        buttonLink.remove()
        shareElement.classList.add('material-icons','cursor-pointer')
        shareElement.style.marginLeft = '16px'
        shareElement.textContent = 'share'
        shareElement.addEventListener('click', this.share)
        settingsElement.classList.add('material-icons','cursor-pointer')
        settingsElement.textContent = 'settings'
        settingsElement.addEventListener('click', () => {
            this.displayModal(true)
        })
        headerRigthSide.appendChild(settingsElement)
        headerRigthSide.appendChild(shareElement)
        header.appendChild(nameElement)
        header.appendChild(headerRigthSide)
    },
    computed: {
        currentTokenSupply() {
            return this.tokenSupply[this.tokenName]
        },
        optionValues() {
            return this.items.map((i) => ({
                value: !this.isMarketCap 
                    ? (i.price.replace(/,/g, '') * (1/100 * i.sharePercentage) * this.shares) 
                    : ((i.marketCap.replace(/,/g, '')/this.currentTokenSupply) * (1/100 * i.sharePercentage) * this.shares),
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
            urlParams.set('mcap', this.isMarketCap)
            urlParams.set('plan',  encodeURI(JSON.stringify(this.items)))
            return`${location.href}?${urlParams.toString()}`
        },
        totalSharePercentageBalance() {
            return 100 - this.total.sharePercentage
        },
        dynamicShares: {
            set(val) {
                this.shares =  val.replace(/,/g, '')
            },
            get() {
                return this.$options.filters.numberFormat(this.shares, 100)
            }
        }
    },
    methods: {
        addNewOption() {
            const lastPrice = this.items[this.items.length - 1].price
            const lastMarketCap = this.items[this.items.length - 1].marketCap
            this.items.push({price: lastPrice, marketCap: lastMarketCap, sharePercentage: '', value: 0, title: '', titleInputDisplay: false})
        },
        deleteOption(index) {
            return this.items.splice(index, 1);
        },
        prepareToMoveOption(index) {
            if (this.items.length === 1 || this.moveOptionBucket.length === 2 || this.moveOptionBucket.includes(index)) {
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
        displayTitle(item, status) {
            item.titleInputDisplay = status
        },
        displayModal(status) {
            this.isModalDisplayed = status
            if (status === false) {
                setTimeout(() => {
                    this.$store.commit('SET_FOOTER_DISPLAY', false)
                }, 300)
            }
        },
        updateHeaderNameText() {
            const header = document.querySelector('header')
            const [nameLink] = header.children
            nameLink.textContent = this.isMarketCap ? 'Toby Exit Plan': 'Stock Exit Plan'
        },
        setOptionMarketCap($event, item) {
            const value = $event.target.value.replace(/,/g, '')
            item.marketCap = this.$options.filters.numberFormat(value, 100)
        },
        setOptionPrice($event, item) {
            const value = $event.target.value.replace(/,/g, '')
            item.price = this.$options.filters.numberFormat(value, 100)
        },
        projectStockVision(codeInput, manualEntryPrice, manualExitPrice, isCrypto = false, entryPercentage, exitPercentage) {
            // Use sessionStorage to separate concern for a stock code browser session
            /** livecoinwatch.com */
            // MAKE SURE SITE IS IN $CAD BEFORE OBSERVING 
            // let ob = new MutationObserver(projectStockVision('toby2',5.95e-8, 6.1e-8, true))
            // ob.observe(document.querySelector('.coin-price-large .price'), {subtree: true,characterData: true, characterDataOldValue: true})
            /** nasdaq.com */
            // let ob = new MutationObserver(projectStockVision('tsla',undefined,undefined,undefined, 0.1, 0.3))
            // ob.observe(document.querySelector('nsdq-quote-header').shadowRoot.querySelector('div.nsdq-quote-header__pricing-information-saleprice'), {subtree: true,characterData: true, characterDataOldValue: true})
            // idaStockVision.priceStore.currentPosition.TSLA = {price: 396, date: new Date().toISOString(), position: true}; idaStockVision.positionIn.TSLA = true
            const code = codeInput.toUpperCase()
            const projectParameters = arguments
            const decimalConvert = (val) => {
                const subscript = String(val).match(/₀|₁|₂|₃|₄|₅|₆|₇|₈|₉/)
                const zeroString = '0'
                let numbersAfterZERO = ''
                const subEnum = {
                    '₀': 0,
                    '₁': 1,
                    '₂': 2,
                    '₃': 3,
                    '₄': 4,
                    '₅': 5,
                    '₆': 6,
                    '₇': 7,
                    '₈': 8,
                    '₉': 9,
                }
                if (subscript === null) {
                    return Number(val)
                }
                numbersAfterZERO = String(val).substring(subscript.index + 1)
                return Number(`0.${zeroString.repeat(subEnum[subscript[0]])}${numbersAfterZERO}`)
    
            }
            const sanitizePrice = (val) => {
                if (typeof val === 'string') {
                    return val.replace('$', '')
                }

                return val
            }
            const percentageDelta = (oldNumber, newNumber, includeSign = false) => {
                if ([oldNumber, newNumber].every((item) => typeof item !== 'number')){
                    return
                }
                const percentage = (newNumber - oldNumber)*100/oldNumber
                if (includeSign === true) {
                    return percentage
                }
                
                return Math.abs(percentage)
            }
            const percentageFinalAmount = (startAmount, percentageAmount, negative = false) => {
                const sign  = negative === true ? -1 : 1
                return startAmount*(1 + (sign * percentageAmount/100))
            }
            const applyEntryExitThresholdToAnchor = (anchor, entryThreshold, exitThreshold) => {
                if (anchor !== undefined && 'price' in anchor && 'type' in anchor) {
                    if (anchor.type === PriceAnalysis.PEAK) {
                        return percentageFinalAmount(anchor.price, exitThreshold, true)
                    }
                    if (anchor.type === PriceAnalysis.VALLEY) {
                        return percentageFinalAmount(anchor.price, entryThreshold)
                    }
                }

                return
            }
            const uploadTodaysPriceHistory = async (code = window.idaStockVision.code) => {
                // use setTimeout from within traderSetp to update at 8pm for non crypto and  11:59pm for crypto
                try {
                    const primaryCode = code.split('_')[0]
                    const priceStore = window.idaStockVision.priceStore
                    if (priceStore.highestPeakAndLowestValleyToday.length === 0) {
                        return
                    }
                    const payload = new URLSearchParams()
                    payload.append('code', code)
                    payload.append('primaryCode', primaryCode)
                    payload.append('peakValleyToday', JSON.stringify(priceStore.highestPeakAndLowestValleyToday))
                    const resp = await fetch(`${window.idaStockVision.serverUrl}/trader/history?${payload.toString()}`, {
                        method: 'POST',
                        mode: 'cors',
                    })
                } catch (error) {
                    console.log('Ida Trader Bot - UPLOAD TODAYS PRICE HISTORY', error)
                }
                
            }
            const setUploadPricesTimeout = (isCrypto, currentTimeoutDateInMiliseconds, callback) => {
                let isSameDate = false
                let currentTiemoutInDateObject
                const nowInMilliSeconds = Date.now()
                const nowInDateObject = new Date(nowInMilliSeconds)
                const uploadTime = isCrypto 
                    ? new Date(nowInMilliSeconds).setHours(23,59,59,0) 
                    : new Date(nowInMilliSeconds).setHours(16,59,59,0)
                const timeDifference = uploadTime - nowInMilliSeconds
                if (currentTimeoutDateInMiliseconds !== undefined) {
                    currentTiemoutInDateObject = new Date(currentTimeoutDateInMiliseconds)
                    isSameDate = nowInDateObject.getDate() === currentTiemoutInDateObject.getDate()
                }
                if (!isSameDate && timeDifference > 0) {
                    setTimeout(callback, timeDifference)
                    return uploadTime
                }

            }
            const statusHTTP = (code) => {
                const queryParams = new URLSearchParams()
                queryParams.append('code', code)
                return fetch(`${window.idaStockVision.serverUrl}/trader/status?${queryParams.toString()}`, {
                    method: 'GET',
                    mode: 'cors',
                })
            }
            const positionStatusPolling = async (code = window.idaStockVision.code, restartCounter = false) => {
                try {
                    if (restartCounter) {
                        clearTimeout(window.idaStockVision.statusTimeoutInstance)
                        window.idaStockVision.statusCounter = 0
                    }
                    const resp = await statusHTTP(code)
                    const data = await resp.json()
                    const codes = Object.keys(window.idaStockVision.positionIn)
                    const timeOutSeconds = idaStockVision.statusTimeoutList.at(window.idaStockVision.statusCounter)
                    codes.forEach((item) => {
                        if (item in data) {
                            const position = data[item].position === 'in' ? true : false
                            window.idaStockVision.positionIn[item] = position
                            window.idaStockVision.priceStore.currentPosition[item].position = position
                            window.idaStockVision.priceStore.currentPosition[item].date = data[item]?.date
                            window.idaStockVision.priceStore.currentPosition[item].price = data[item]?.price
                        }
                    })
                    if (timeOutSeconds !== undefined) {
                        window.idaStockVision.statusTimeoutInstance = setTimeout(window.idaStockVision.tools.positionStatusPolling, timeOutSeconds)
                        window.idaStockVision.statusCounter++
                    }
                } catch (error) {
                    console.log('Ida Trader Bot - POSITION STATUS POLLING', error)
                }
                
            }
            const watch = () => {
                try {
                    const origin = location.origin
                    const observeOptions = {subtree: true,characterData: true, characterDataOldValue: true}
                    let priceElement, priceHighAndLowRangeElement, priceLowRangeElement, priceHighRangeElement, highAndLowMutationObserver, lowMutationObserver, highMutationObserver
                    window.idaStockVision.mutationObservers[code] = new MutationObserver(projectStockVision(...projectParameters))
                    const storeHighLowRangeGeneral = (lowElementText, highElementText) => {
                        if (lowElementText !== undefined) {
                            window.idaStockVision.priceStore.marketHighLowRange.low = decimalConvert(sanitizePrice(lowElementText))
                        }
                        if (highElementText !== undefined) {
                            window.idaStockVision.priceStore.marketHighLowRange.high = decimalConvert(sanitizePrice(highElementText))
                        }
                    }
                    const storeJointHighLowRange = (elementText) => {
                        const value = elementText.split('-')
                        window.idaStockVision.priceStore.marketHighLowRange.low = decimalConvert(sanitizePrice(value[0]))                 
                        window.idaStockVision.priceStore.marketHighLowRange.high = decimalConvert(sanitizePrice(value[1]))
                    }
                    const setUpGeneralHighLowRangeMutations = () => {
                        if (priceLowRangeElement !== null && priceHighRangeElement !== null) {
                            storeHighLowRangeGeneral(priceLowRangeElement.innerText)
                            storeHighLowRangeGeneral(undefined, priceHighRangeElement.innerText)
                            lowMutationObserver = new MutationObserver((mutationArray, observerInstance) => {
                                const lastRecord = mutationArray[mutationArray.length - 1]
                                const targetValue = lastRecord.target.nodeValue
                                storeHighLowRangeGeneral(targetValue)                      
                            })
                            highMutationObserver = new MutationObserver((mutationArray, observerInstance) => {
                                const lastRecord = mutationArray[mutationArray.length - 1]
                                const targetValue = lastRecord.target.nodeValue
                                storeHighLowRangeGeneral(undefined, targetValue)                      
                            })
                            lowMutationObserver.observe(priceLowRangeElement, observeOptions)
                            highMutationObserver.observe(priceHighRangeElement, observeOptions)
                        }
                    }
                    switch(true) {
                        case origin.includes('nasdaq'):
                        case origin.includes('google'):
                            const websiteName = origin.includes('google') ? 'google' : 'nasdaq'
                            priceElement = window.idaStockVision.cssSelectors[websiteName].price()
                            priceHighAndLowRangeElement = window.idaStockVision.cssSelectors[websiteName].highLowRange()
                           if (priceHighAndLowRangeElement !== null) {
                               storeJointHighLowRange(priceHighAndLowRangeElement.innerText)
                               highAndLowMutationObserver = new MutationObserver((mutationArray, observerInstance) => {
                                    const lastRecord = mutationArray[mutationArray.length - 1]
                                    const targetValue = lastRecord.target.nodeValue
                                    storeJointHighLowRange(targetValue)                      
                               })
                               highAndLowMutationObserver.observe(priceHighAndLowRangeElement, observeOptions)
                           }
                           break
                        case origin.includes('cboe'):
                            priceElement = window.idaStockVision.cssSelectors.cboe.price()
                            priceLowRangeElement = window.idaStockVision.cssSelectors.cboe.lowRange()
                            priceHighRangeElement = window.idaStockVision.cssSelectors.cboe.highRange()
                            setUpGeneralHighLowRangeMutations()
                            break
                        case origin.includes('webull'):
                            priceElement = window.idaStockVision.cssSelectors.webull.price()
                            priceLowRangeElement = window.idaStockVision.cssSelectors.webull.lowRange()
                            priceHighRangeElement = window.idaStockVision.cssSelectors.webull.highRange()
                            setUpGeneralHighLowRangeMutations()
                            break
                        case origin.includes('livecoinwatch'):
                            priceElement = window.idaStockVision.cssSelectors.livecoinwatch.price()
                            break
                        default:
                            // add webull, tradingview, google finance
                            throw new Error('website css selectors do not exist')
                    }

                    if (priceElement === null || priceElement === undefined) {
                        throw new Error('can\'t find price')
                    }
                    window.idaStockVision.mutationObservers[code].observe(priceElement, observeOptions)
                } catch (error) {
                    console.log('Ida Trader Bot - WATCH STOCK', error)
                }
            }
            const destroyCode = (code) => {
                window.idaStockVision.mutationObservers[code.toUpperCase()].disconnect()
            }
            const traderSetUp = async (code) => {
                if (!('idaStockVision' in window)) {
                    window.idaStockVision = {
                        positionIn: {},
                        notificationInProgress: {},
                        lastNotificationSent: {},
                        mutationObservers: {},
                        consoleClearInstance: setInterval(()=>{console.clear()}, 1000*60*20),
                        // window.idaStockVision is deleted before function fires rendering it usless
                        windowCloseEventListener: window.addEventListener('beforeunload', uploadTodaysPriceHistory),
                        code: code,
                        statusTimeoutList: [60*1000,60*1000*3,60*1000*5,60*1000*10,60*1000*20,60*1000*20],
                        statusTimeoutInstance: undefined,
                        statusCounter: 0,
                        serverUrl: '',
                        notificationServerUrl: '',
                        priceStore: {
                            lastPrice: undefined,
                            previousLastPrice: undefined,
                            marketHighLowRange: {
                                low: undefined,
                                high: undefined
                            },
                            peakValleyHistory: [],
                            highestPeakAndLowestValleyToday: [],
                            currentPosition: {},
                            analysis: {},
                            uploadTodaysPriceTime: undefined,
                        },
                        tools: {
                            decimalConvert,
                            percentageDelta,
                            percentageFinalAmount,
                            uploadTodaysPriceHistory,
                            positionStatusPolling,
                            destroyCode,
                        },
                        server: {
                            development: 'http://localhost:9000',
                            developmentNotification: 'http://10.0.0.148:9000',
                            // production: 'https://tobyexitstrategy-d8c8b00cdf74.herokuapp.com'
                        },
                        cssSelectors: {
                            nasdaq: {
                                price: () => document.querySelector('nsdq-quote-header').shadowRoot.querySelector('div.nsdq-quote-header__pricing-information-saleprice'),
                                highLowRange: () => document.querySelector('nsdq-quote-header').shadowRoot.querySelector('div.header-info-day-range-info'),
                                fiftyTwoWeekHighLowRange: () => document.querySelector('nsdq-quote-header').shadowRoot.querySelector('div.header-info-range-wrapper span')
                            },
                            yahoo: {
                                // csp locked
                                price: () => document.querySelector("div.price > section > div > div:nth-child(1) > section > div.container > div:nth-child(1) > span"),
                                preMarketAndAfterHoursPrice: () => document.querySelector("div.price > section > div > div:nth-child(2) > section > div.container > div:nth-child(1) > span"),
                                highLowRange: () => document.querySelector("fin-streamer[data-field=regularMarketDayRange]"),
                            },
                            livecoinwatch: {
                                price: () => document.querySelector('.coin-price-large .price'),
                                highLowRange: () => null
                            },
                            cboe: {
                                price: () => document.querySelector('div.flex-container.zig-zag-lines tr:nth-child(1) td:nth-child(2)'),
                                lowRange: () => document.querySelector('div.flex-container.zig-zag-lines tr:nth-child(11) td:nth-child(2)'),
                                highRange: () => document.querySelector('div.flex-container.zig-zag-lines tr:nth-child(12) td:nth-child(2)'),
                            },
                            webull: {
                                // https only
                                price: () => document.querySelector("#app > section > div > div > div > div > div > div:nth-child(2) > div > div"),
                                preMarketAndAfterHoursPrice: document.querySelector("#app > section > div > div > div > div > div > div:nth-child(2) > div > div > span"),
                                lowRange: () => document.evaluate('//*[@id="app"]/section/div[1]/div/div[2]/div[2]/div/div[2]/div[2]/div[2]',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                                highRange: () => document.evaluate('//*[@id="app"]/section/div[1]/div/div[2]/div[2]/div/div[2]/div[1]/div[2]',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                            },
                            tradingview: {
                                // https only
                                price: () => document.evaluate('//*[@id="js-category-content"]/div[1]/div[1]/div/div/div/div[3]/div[1]/div/div[1]/span[1]',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                            },
                            google: {
                                // too slow compared to nasdaq
                                price: () => document.evaluate('//c-wiz[3]/div/div[4]/div/main/div[2]/div[1]/div[1]/c-wiz/div/div[1]/div/div[1]/div/div[1]/div/span/div/div',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                                preMarketAndAfterHoursPrice: document.evaluate('//c-wiz[3]/div/div[4]/div/main/div[2]/div[1]/div[1]/c-wiz/div/div[1]/div/div[2]/span[1]/span/div/div',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                                highLowRange: () => document.evaluate('//c-wiz[3]/div/div[4]/div/main/div[2]/div[2]/div/div[1]/div[3]/div',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                            },

                        }
                    }
                }

                if (!(code in window.idaStockVision.positionIn)) {
                    window.idaStockVision.positionIn[code] = false
                    window.idaStockVision.notificationInProgress[code] = false
                    window.idaStockVision.lastNotificationSent[code] = {}
                    window.idaStockVision.priceStore.currentPosition[code] = {
                        position: false,
                    }
                    window.idaStockVision.priceStore.analysis[code] = undefined
                    window.idaStockVision.tools[`watch_${code}`] = watch
                }
    
                try {
                    window.idaStockVision.serverUrl = 'production' in window.idaStockVision.server 
                        ? window.idaStockVision.server.production
                        : window.idaStockVision.server.development
                    window.idaStockVision.notificationServerUrl = 'production' in window.idaStockVision.server 
                        ? window.idaStockVision.server.production
                        : window.idaStockVision.server.developmentNotification
                    window.idaStockVision.notificationInProgress[code] = true
                    const primaryCode = code.split('_')[0]
                    const resp = await statusHTTP(code)
                    const data = await resp.json()
                    switch(resp.status) {
                        case 200:
                            window.idaStockVision.positionIn[code] = false
                            window.idaStockVision.priceStore.currentPosition[code].position = false
                            break
                        case 201:
                            window.idaStockVision.positionIn[code] = true
                            window.idaStockVision.priceStore.currentPosition[code].position = true
                            break
                        default:
                    }
                    if (code in data && data[code].date && data[code].price) {
                        window.idaStockVision.priceStore.currentPosition[code].date = data[code]?.date
                        window.idaStockVision.priceStore.currentPosition[code].price = data[code]?.price
                        if (isCrypto && window.idaStockVision.priceStore.currentPosition[code].position) {
                            window.idaStockVision.priceStore.currentPosition[code].date = undefined
                        }
                    }
                    if (
                        primaryCode in data && 
                        'peakValleyHistory' in data[primaryCode] && 
                        window.idaStockVision.priceStore.peakValleyHistory.length === 0
                    ) {
                        window.idaStockVision.priceStore.peakValleyHistory.push(...data[primaryCode].peakValleyHistory)
                    }
                    window.idaStockVision.notificationInProgress[code] = false
                } catch (error) {
                    console.log('Ida Trader Bot - STATUS ERROR', error)
                }
            }
            const sendNotification =  async (tokenOrStockCode, messageBody = 'manual confirmation', currentPrice, action, anchorPrice) => {
                const priceDifferencePercentage = window.idaStockVision.lastNotificationSent[tokenOrStockCode] 
                    ? percentageDelta(window.idaStockVision.lastNotificationSent[tokenOrStockCode].currentPrice, currentPrice) 
                    : 0
                const percentageThreshold = 5
                const notificationSubject = `${tokenOrStockCode} - Get [${action.toUpperCase()}] (${currentPrice})`
                const queryParams = new URLSearchParams()
                const sameActionAsLast = 'action' in window.idaStockVision.lastNotificationSent[tokenOrStockCode] 
                    ? window.idaStockVision.lastNotificationSent[tokenOrStockCode].action === action 
                    : false
                const percentageThresholdReached = priceDifferencePercentage >= percentageThreshold
                const sameAnchorPriceAsLastNotificationAnchorPrice = 'anchorPrice' in window.idaStockVision.lastNotificationSent[tokenOrStockCode]
                    ? anchorPrice === window.idaStockVision.lastNotificationSent[tokenOrStockCode].anchorPrice
                    : true
                let currentStatus
                switch (window.idaStockVision.positionIn[tokenOrStockCode]) {
                    case true:
                        currentStatus = 'in'
                        break
                    case false:
                        currentStatus = 'out'
                }
                const sameActionAsCurrentStatus = currentStatus === action

                if (window.idaStockVision.notificationInProgress[tokenOrStockCode] 
                    || sameActionAsCurrentStatus
                    || (sameActionAsLast && sameAnchorPriceAsLastNotificationAnchorPrice && !percentageThresholdReached)
                ) {
                    return
                }
    
                try {
                    window.idaStockVision.notificationInProgress[tokenOrStockCode] = true
                    queryParams.append('message', messageBody)
                    queryParams.append('subject', notificationSubject)
                    queryParams.append('code', tokenOrStockCode)
                    const resp = await fetch(`${window.idaStockVision.serverUrl}/trader/notify?${queryParams.toString()}`, {
                        method: 'POST',
                        mode: 'cors',
                    })
                    // const data = await resp.json()
                    window.idaStockVision.lastNotificationSent[tokenOrStockCode] = {
                        tokenOrStockCode, 
                        message: messageBody,
                        currentPrice,
                        action,
                        anchorPrice
                    }
                    window.idaStockVision.notificationInProgress[tokenOrStockCode] = false
                    new Notification(notificationSubject, {body: messageBody})
                    positionStatusPolling(tokenOrStockCode, true)
                } catch (error) {
                    console.log('Ida Trader Bot - NOTIFY ERROR', error)
                }
            }
            const updatePrices = (currentPrice, peakValleyDetected) => {
                try {
                    const priceStore = window.idaStockVision.priceStore
                    const {low, high} = priceStore.marketHighLowRange
                    const isHighLowRangeValid = [low, high].every((item) => typeof item === 'number' && item > 0)
                    // Reduce market noise from outlier price trades(pre-market & after market hours especially)
                    const isCurrentPriceWithinMarketRange = isHighLowRangeValid ? (currentPrice >= low && currentPrice <= high) : true

                    if (priceStore.lastPrice !== currentPrice && isCurrentPriceWithinMarketRange) {
                        priceStore.previousLastPrice = priceStore.lastPrice
                        priceStore.lastPrice = currentPrice
                    }
    
                    if (peakValleyDetected !== undefined) {
                        priceStore.peakValleyHistory.push(peakValleyDetected)
                    }
                } catch (error) {
                    console.log('Ida Trader Bot - UPDATE PRICES', error)
                }
            }
            /**
             * 
             * @param {number} currentPrice 
             * @param {number} lastPrice 
             * @param {number} previousLastPrice 
             * @returns {undefined | {type: string; date: string; price: number;}}
             */
            const peakValleyDetection = (currentPrice, lastPrice, previousLastPrice) => {
                const payload = {
                    date: new Date().toISOString(),
                    price: lastPrice
                }
                if (lastPrice !== undefined && previousLastPrice !== undefined) {
                    if (lastPrice >= previousLastPrice && lastPrice > currentPrice) {
                        payload.type = 'peak'
                        return payload
                    }
                    if (lastPrice <= previousLastPrice && lastPrice < currentPrice) {
                        payload.type = 'valley'
                        return payload
                    }
                }

                return
            }
            class PriceAnalysis {
                _peakValleyHistory;
                _currentPrice;
                _currentPosition;
                _isCrypto;
                static IN = true
                static OUT = false
                static PEAK = 'peak'
                static VALLEY = 'valley'

                constructor(history = [], currentPrice, currentPosition, isCrypto = false) {
                    try {
                        this._isCrypto = isCrypto
                        this._peakValleyHistory = Array.from(history)
                        this._currentPrice = {
                            price: currentPrice,
                            epochDate: Date.now()
                        }
                        this._currentPrice.date = new Date(this._currentPrice.epochDate).toISOString()
                        this._currentPosition = currentPosition
                        // this._currentPosition = {date: '2025-01-16T05:11:22.719Z', price: 5, position: PriceAnalysis.IN}
                        if (this.dateExistsForCurrrentPosition) {
                            this._currentPosition.epochDate = this.transformDateToEpochMiliseconds(this._currentPosition.date)
                        }
                    } catch (error) {
                        console.log('Ida Trader Bot - PRICE ANALYSIS CONSTRUCTOR', error)
                    }
                    

                }

                get peakValleyProgressionOrder() {
                    return this._peakValleyHistory.map((item) => {
                        item.epochDate = this.transformDateToEpochMiliseconds(item.date)
                        return item
                    })
                    .sort((a,b) => {
                        // ascending date
                        if (a.epochDate < b.epochDate) {
                            return -1
                        }
                        if (a.epochDate === b.epochDate) {
                            return 0
                        }
                        return 1
                    })
                }

                get todaysDateMidnight () {
                   const today = new Date()
                   return today.setHours(0,0,0)
                //    return today.toISOString()
                }

                get dateExistsForCurrrentPosition() {
                    return typeof this._currentPosition === 'object' && 'date' in this._currentPosition
                }

                get peakOnlyProgressionOrder() {
                    return this.peakValleyProgressionOrder.filter((item) => item.type === PriceAnalysis.PEAK)
                }

                get valleyOnlyProgressionOrder() {
                    return this.peakValleyProgressionOrder.filter((item) => item.type === PriceAnalysis.VALLEY)
                }

                get highestPeakToday() {
                    const peaks = this.peakOnlyProgressionOrder.filter((item) => item.epochDate > this.todaysDateMidnight)
                    if (peaks.length === 0) {
                        return undefined
                    }
                    const prices = peaks.map((item) => item.price)
                    // const dates = peaks.map((item) => item.epochDate)
                    const maxPrice = Math.max(...prices)
                    const maxPriceIndex = prices.lastIndexOf(maxPrice)
                    return peaks[maxPriceIndex]
                }

                get lowestValleyToday() {
                    const valleys = this.valleyOnlyProgressionOrder.filter((item) => item.epochDate > this.todaysDateMidnight)
                    if (valleys.length === 0) {
                        return undefined
                    }
                    const valleyPrices = valleys.map((peak) => peak.price)
                    const minPrice = Math.min(...valleyPrices)
                    const minPriceIndex = valleyPrices.lastIndexOf(minPrice)

                    return valleys.at(minPriceIndex)
                }

                get highestPeakAndLowestValleyToday() {
                    const list = []
                    this.lowestValleyToday !== undefined ? list.push(this.lowestValleyToday) : null
                    this.highestPeakToday !== undefined ? list.push(this.highestPeakToday) : null

                    return list
                }

                get closestPeakToToday() {
                    const peaksBeforeToday = this.peakOnlyProgressionOrder.filter((item) => item.epochDate < this.todaysDateMidnight)
                    if (peaksBeforeToday.length === 0) {
                        return undefined
                    }
                    return peaksBeforeToday.at(peaksBeforeToday.length - 1)
                }

                get closestHighestPeak() {
                    // Have a recent position info to make it very accurate regardless of implementation

                    return this.findOptimalClosestHighestPeak()
                    // if ([this.closestPeakToToday, this.highestPeakToday].every((value) => value === undefined)) {
                    //     return
                    // }

                    // if (this.closestPeakToToday === undefined) {
                    //     return this.highestPeakToday
                    // }
                    // if (this.highestPeakToday === undefined) {
                    //     return this.closestPeakToToday
                    // }

                    // if (this.closestPeakToToday.price > this.highestPeakToday.price) {
                    //     return this.closestPeakToToday
                    // }

                    // return this.highestPeakToday

                }

                get peakValleyBeforeToday() {
                    return this.peakValleyProgressionOrder.filter((item) => item.epochDate < this.todaysDateMidnight)
                }

                get peakValleyToday() {
                    return this.peakValleyProgressionOrder.filter((item) => item.epochDate > this.todaysDateMidnight)
                }

                get peakValleySizeManagement() {
                    if (this.peakValleyToday.length <= 100) {
                        return
                    }
                    const newPeakValleyHistory = Array.from(this.peakValleyBeforeToday).concat(this.highestPeakAndLowestValleyToday)
                                        
                    return newPeakValleyHistory
                }

                findAnchorPeak(recentPosition) {
                    // filter peaks between recentPosition & currentPrice dates
                    // search for highest peak
                    // from highest peak make sure negative slope between peak and current price
                    // from recentPosition price make sure positive slope between it and current price
                    // logic not met do nothing and keep watching
                    // Note current position date & price needed for this function to work
                    if (this._currentPosition.position !== PriceAnalysis.IN || !this.dateExistsForCurrrentPosition) {
                        return
                    }

                    const peaks = this.peakOnlyProgressionOrder
                        .filter((item) => (item.epochDate > this._currentPosition.epochDate && item.epochDate < this._currentPrice.epochDate))
                    const prices = peaks.map((item) => item.price)
                    const maxPrice = Math.max(...prices)
                    const maxPriceIndex = prices.lastIndexOf(maxPrice)
                    const maxPeak = peaks.at(maxPriceIndex)
                    const slopeOfCurrentPriceFromPeak = this.priceSlope(maxPeak, this._currentPrice)
                    const slopeOfCurrentPriceFromRecentPosition = this.priceSlope(this._currentPosition, this._currentPrice)
                    if (slopeOfCurrentPriceFromPeak !== undefined 
                        && slopeOfCurrentPriceFromRecentPosition !== undefined 
                        && slopeOfCurrentPriceFromPeak.negative 
                        && slopeOfCurrentPriceFromRecentPosition.positive
                    ) {
                        return maxPeak
                    }

                    return

                }

                findAnchorValley(recentPosition) {
                    // find closest highest peak
                    // from closest highest peak date search for deepest valley
                    // from deepest valley make sure positive slope between valley price and current price
                    // logic not met do nothing and keep watching
                                        
                    if (this._currentPosition.position !== PriceAnalysis.OUT || this.closestHighestPeak === undefined) {
                        return
                    }
                    const valleysFromClosestHighestPeak = this.valleyOnlyProgressionOrder.filter((item) => item.epochDate > this.closestHighestPeak.epochDate)
                    const prices = valleysFromClosestHighestPeak.map((item) => item.price)
                    const lowestPrice = Math.min(...prices)
                    const lowestPriceIndex = prices.lastIndexOf(lowestPrice)
                    const lowestValley = lowestPriceIndex !== -1 ? valleysFromClosestHighestPeak.at(lowestPriceIndex) : undefined
                    const slopeOfCurrentPriceFromLowestValley = this.priceSlope(lowestValley, this._currentPrice)
                    if (slopeOfCurrentPriceFromLowestValley !== undefined && slopeOfCurrentPriceFromLowestValley.positive) {
                        return lowestValley
                    }

                    return undefined

                }

                findAnchor() {
                    if (this._currentPosition.position === PriceAnalysis.IN) {
                        return this.findAnchorPeak()
                    }

                    return this.findAnchorValley()
                }

                transformDateToEpochMiliseconds(dateISOString) {
                    // Make sure that you append stock market closing hour and ISO format [T00:00:00]
                    // for non ISO format dates so parse method uses local timezone automatically
                    if (dateISOString !== undefined || dateISOString !== '') {
                        return Date.parse(dateISOString)
                    }

                    return undefined
                }

                priceSlope(anchorPrice, currentPrice) {
                    if ([anchorPrice, currentPrice].some((item) => item === undefined)) {
                        return
                    }
                    const priceDifference = currentPrice.price - anchorPrice.price
                    const dateDifference = currentPrice.epochDate - anchorPrice.epochDate
                    const slope = priceDifference/dateDifference
                    const direction = Math.sign(slope)

                    return {value: slope, positive: direction > 0, negative: direction < 0}
                }

                findOptimalClosestHighestPeak() {
                    // if recent/current position price exists limit lookback up to that date
                    // in the case of no recent position price, use up to 7 days
                    // Note: volatile stocks might need lower max days lookback and vice versa
                    // each max price for each past day range gets a point
                    // the max price with the highest point we use (in edge case of multiple highest point we use the first one)

                    const shiftDateFromWeekend = (dayToDeductFromInMiliSeconds, daysToDeduct, isCrypto) => {
                        // const dayToDeductFromInMiliSeconds = this.transformDateToEpochMiliseconds(dayToDeductFromString)
                        const twentyFourHoursInMiliSeconds = 1000*60*60*24
                        let correctionModifier = 0
                        let deductionDate = new Date(dayToDeductFromInMiliSeconds - (twentyFourHoursInMiliSeconds*daysToDeduct))
                        if (!isCrypto) {
                            switch(deductionDate.getDay()) {
                                case 0:
                                    //sunday
                                    correctionModifier = 2
                                    break
                                case 6:
                                    //saturday
                                    correctionModifier = 2
                                    break
                                default:
                            }
                        }

                        // Make sure that the next date shift feeds off the output of this function to be in proper order
                        return dayToDeductFromInMiliSeconds - (twentyFourHoursInMiliSeconds*(daysToDeduct + correctionModifier))
                    }
                    const today = new Date()
                    // const todayMidnightInISOString = new Date(this.todaysDateMidnight).toISOString()
                    // const twentyFourHoursInMiliSeconds = 1000*60*60*24
                    // Step back on days from the weekend when its a weekend for all
                    const oneDayAgo = shiftDateFromWeekend(this.todaysDateMidnight, 1, this._isCrypto)
                    const twoDaysAgo = shiftDateFromWeekend(oneDayAgo, 1, this._isCrypto)
                    const threeDaysAgo = shiftDateFromWeekend(twoDaysAgo, 1, this._isCrypto)
                    const fiveDaysAgo = shiftDateFromWeekend(threeDaysAgo, 2, this._isCrypto)
                    const sevenDaysAgo = shiftDateFromWeekend(fiveDaysAgo, 2, this._isCrypto)
                    const peakList = this.peakOnlyProgressionOrder
                    const daysAsList = [this.todaysDateMidnight,oneDayAgo,twoDaysAgo,threeDaysAgo,fiveDaysAgo,sevenDaysAgo]
                    const daysToProcess = daysAsList
                    // let daysToProcess = this.dateExistsForCurrrentPosition
                    //     ? daysAsList.filter((day) => day > this._currentPosition.epochDate)
                    //     : daysAsList
                    // if (this.dateExistsForCurrrentPosition && daysToProcess.lenth === 0) {
                    //     // For situations where trade position is done within the day
                    //     daysToProcess.push(this.todaysDateMidnight)
                    // }
                    let tracker = new Map()
                    // console.log(daysToProcess)
                    daysToProcess.forEach((day) => {
                        let basket = new Map()
                        peakList.filter((item) => item.epochDate > day)
                            .forEach((item) => basket.set(item.price, item.epochDate))
                        if (basket.size > 0) {
                            const prices = basket.keys().toArray()
                            const maxPrice = Math.max(...prices)
                            const peakDateToTrack = basket.get(maxPrice)
                            if (tracker.has(peakDateToTrack)) {
                                let value = tracker.get(peakDateToTrack)
                                value += 1
                                tracker.set(peakDateToTrack, value)
                                return
                            }
                            tracker.set(peakDateToTrack, 1)
                        }
                        
                    })
                    if (tracker.size > 0) {
                        const trackerDates = tracker.keys().toArray()
                        const trackerPoints = tracker.values().toArray()
                        const maxTrackerPoints = Math.max(...trackerPoints)
                        const maxTrackerPointsIndex = trackerPoints.indexOf(maxTrackerPoints)
                        const dateToUse = trackerDates.at(maxTrackerPointsIndex)
                        const peakToUse = peakList.find((peak) => peak.epochDate === dateToUse)
                        return peakToUse !== -1 ? peakToUse : undefined
                    }

                    return
                }
                
            }
            traderSetUp(code)

            return (mutationArray, observerInstance) => {
                // TO-DO have a disconnect method to cleanup setTimeouts for history upload
                const lastRecord = mutationArray[mutationArray.length - 1]
                const targetValue = lastRecord.target.nodeValue.replace('$','')
                const priceStore = window.idaStockVision.priceStore
                const currentPrice =  decimalConvert(targetValue)
                const confirmationLink = `${window.idaStockVision.notificationServerUrl}/trader/confirm?`
                const confirmationQueryParams = new URLSearchParams()
                let entryPrice = manualEntryPrice
                let exitPrice = manualExitPrice
                let analysis, anchor
                let anchorPrice = ''
                let notificationBody = ''
                const autoEntryExitMode = entryPrice === undefined && exitPrice === undefined
                if (autoEntryExitMode) {
                    const currentPosition = priceStore.currentPosition[code]
                    const peakValleyDetected = peakValleyDetection(currentPrice, priceStore.lastPrice, priceStore.previousLastPrice)
                    updatePrices(currentPrice, peakValleyDetected)
                    analysis = new PriceAnalysis(priceStore.peakValleyHistory, currentPrice, currentPosition)
                    priceStore.analysis[code] = analysis
                    entryPrice = applyEntryExitThresholdToAnchor(analysis.findAnchorValley(), entryPercentage, exitPercentage)
                    exitPrice = applyEntryExitThresholdToAnchor(analysis.findAnchorPeak(), entryPercentage, exitPercentage)
                    priceStore.peakValleyHistory = analysis.peakValleySizeManagement !== undefined 
                        ? analysis.peakValleySizeManagement
                        : priceStore.peakValleyHistory
                    priceStore.highestPeakAndLowestValleyToday = analysis.highestPeakAndLowestValleyToday
                    anchor = analysis.findAnchor()
                    anchorPrice = anchor !== undefined ? anchor.price : 'no-anchor'
                    const timeToUpload = setUploadPricesTimeout(isCrypto,priceStore.uploadTodaysPriceTime,uploadTodaysPriceHistory)
                    if (typeof timeToUpload === 'number') {
                        priceStore.uploadTodaysPriceTime = timeToUpload
                    }
                    if (anchor !== undefined){
                        notificationBody = notificationBody.concat(`Anchor Price: ${anchorPrice} \r\n`)
                        notificationBody = notificationBody.concat(`Anchor Type: ${anchor.type} \r\n`)
                        notificationBody = window.idaStockVision.positionIn[code] 
                        ? notificationBody.concat(`Gross Profit(%): ${percentageDelta(currentPosition.price, currentPrice, true)} \r\n`)
                        : notificationBody
                    }
                }
                const cryptoDecision = {
                    // No need for <= to logic since probability of exact match is very low
                    enter: currentPrice < entryPrice,
                    exit: currentPrice >= exitPrice,
                }
                const stockDecision = {
                    enter: currentPrice >= entryPrice,
                    exit: currentPrice <= exitPrice,
                }
                const enterDecision = isCrypto ? cryptoDecision.enter : stockDecision.enter
                const exitDecision = isCrypto ? cryptoDecision.exit : stockDecision.exit
                
                let color = 'red'
                let message = `[${code}] DO NOTHING AT ${currentPrice}[${anchorPrice}] - ${new Date().toString()}`
                confirmationQueryParams.append('code', code)
                confirmationQueryParams.append('price', currentPrice)

                if (entryPrice !== undefined && enterDecision) {
                    // No need for equals to logic since probabiloty of exact match is very low
                    message = `[${code}] SWAP IN AT ${currentPrice}[${anchorPrice}] - ${new Date().toString()}`
                    color = 'green'
                    confirmationQueryParams.append('position', 'in')
                    notificationBody = notificationBody.concat(`Action Link: ${confirmationLink}${confirmationQueryParams.toString()} \r\n`)
                    sendNotification(code, notificationBody, currentPrice, 'in', anchorPrice)
                    if (window.idaStockVision.positionIn[code]) {
                        message = `[${code}] YOU ARE IN ALREADY ${currentPrice}[${anchorPrice}] - ${new Date().toString()}`
                        color = 'blue'
                    }
                }
                if (exitPrice !== undefined && exitDecision) {
                    message = `[${code}] SWAP OUT AT ${currentPrice}[${anchorPrice}] - ${new Date().toString()}`
                    color = 'orange'
                    confirmationQueryParams.append('position', 'out')
                    notificationBody = notificationBody.concat(`Action Link: ${confirmationLink}${confirmationQueryParams.toString()} \r\n`)
                    sendNotification(code, notificationBody, currentPrice, 'out', anchorPrice)
                    if (!window.idaStockVision.positionIn[code]) {
                        message = `[${code}] YOU ARE OUT ALREADY ${currentPrice}[${anchorPrice}] - ${new Date().toString()}`
                        color = 'blue'
                    }
                }
                console.log(`%c ${message}`,`color:white;background-color:${color};padding:50px`)
            }
        }
    },
    filters: {
        numberFormat(val, fractionMax = 2) {
            const cleansedVal = typeof val === 'string' ? val.replace(/,/g, '') : val
            return new Intl.NumberFormat('en-US', {maximumFractionDigits: fractionMax}).format(cleansedVal)
        },
        cardTitleFormat(val) {
            return val === '' ? 'Tap here to update title' : val
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

Vue.directive('numlock', {
    bind: function(el,binding,vnode){
        el.onkeydown = function(event){
            const acceptableKeys = ['1','2','3','4','5','6','7','8','9','0','Backspace','.','ArrowLeft','ArrowRight']
            if (!acceptableKeys.includes(event.key)) {
                event.preventDefault()
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
  { path: '/', component: token }, 
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
// Vue.prototype.$APP_NAME = origin.includes('reporttenant') ? 'RT' : origin.includes('reportlandlord') ? 'RL' : 'CBT'
// Vue.prototype.$APP_EMAIL = `info@${window.location.hostname}`
// Vue.prototype.$APP_TENANT = origin.includes('reportlandlord') || (origin.includes('localhost') && pathname.includes('reportlandlord'))
// Vue.prototype.$APP_LANDLORD = !Vue.prototype.$APP_TENANT
// Vue.prototype.$APP_TARGET = Vue.prototype.$APP_TENANT ? 'tenant' : 'landlord'
// Vue.prototype.$APP_TARGET_OPPOSITION = Vue.prototype.$APP_TARGET === 'tenant' ? 'landlord' : 'tenant'
// Vue.prototype.$APP_TARGET_FANCY_NAME =  Vue.prototype.$APP_TENANT ? 'tenant' : 'rental investor'
// Vue.prototype.$APP_URL = {
//     tenant: 'https://reportlandlord.app',
//     landlord: 'https://reporttenant.com'
// }

var app = new Vue({
    template: '#main-app',
    router:router,
    store:store,
}).$mount('#app');