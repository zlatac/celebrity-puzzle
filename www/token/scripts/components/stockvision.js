//@ts-check
/**
 * @typedef { import("globals") }
 * @typedef { import("token").IPriceHistory } PriceHistory
 * @typedef { import("token").IPrice } Price
 * @typedef { import("token").ICurrentPrice } CurrentPrice
 * @typedef { import("token").IPosition } Position
 * @typedef { import("token").INTERVAL_FLAGS } IntervalFlags
 * @typedef { import("token").TRADING_FLAGS } TradingFlags
 * @typedef { import("token").ITradingIntervalInspection } TradingIntervalInspection
 * @typedef { import("token").IPrecisionIntervalInspection } PrecisionIntervalInspection
 * @typedef { import("token").PriceAnalysis } IPriceAnalysis
 * 
 * @typedef { import("token").ITradeCheckResponse } TradeCheckResponse
 * @typedef { import("token").ICboeQuoteResponse } CboeQuoteResponse
 * @typedef { import("token").IQuestradeSubmitResponse |  import("token").IQuestradeSubmitErrorResponse} QuestradeSubmitResponse
 * @typedef { import("token").IQuestradeOrdersResponse } QuestradeOrdersResponse
 * @typedef { import("token").IQuestradeOrder } QuestradeOrder
 */

/**
 * projectStockVision
 * @param {string} codeInput 
 * @param {number | undefined} manualEntryPrice 
 * @param {number | undefined} manualExitPrice 
 * @param {boolean} isCrypto 
 * @param {number} entryPercentage 
 * @param {number} exitPercentage 
 * @param {IntervalFlags} tradingInterval 
 * @param {IntervalFlags} precisionInterval 
 * @returns {MutationCallback}
 */
let projectStockVision = function (codeInput, manualEntryPrice, manualExitPrice, isCrypto = false, entryPercentage, exitPercentage, tradingInterval = '1hour', precisionInterval = '5min') {
    // Use sessionStorage to separate concern for a stock code browser session
    // Use localStorage to share data between multiple tabs/windows of the same domain
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
    /** @type {IPriceAnalysis} */
    class PriceAnalysis {
        _peakValleyHistory;
        _currentPrice;
        _currentPosition;
        /** @type {boolean} _isCrypto */
        _isCrypto;
        /** @type {IntervalFlags} _priceTradingInterval */
        _priceTradingInterval;
        /** @type {number} _twentyFourHoursInMiliSeconds */
        _twentyFourHoursInMiliSeconds = 1000*60*60*24
        /** @type {true} IN */
        static IN = true
        /** @type {false} OUT */
        static OUT = false
        /** @type {'peak'} PEAK */
        static PEAK = 'peak'
        /** @type {'valley'} VALLEY */
        static VALLEY = 'valley'
        /** @type {'stockvision'} PROJECT_NAME */
        static PROJECT_NAME = 'stockvision'
        /** @type {{[key: string]: IntervalFlags}} TRADING_INTERVAL */
        static TRADING_INTERVAL = {
            oneMinute: '1min',
            twoMinute: '2min',
            threeMinute: '3min',
            fiveMinute: '5min',
            sevenMinute: '7min',
            tenMinute: '10min',
            fifteenMinute: '15min',
            twentySevenMinute: '27min',
            thirtyMinute: '30min',
            fourtyFiveMinute: '45min',
            oneHour: '1hour',
            none: 'none'
        }
        static ONE_MINUTE_IN_MILLISECONDS = 1000*60
        /** @type {{[key: string]: number}} TRADING_INTERVAL_SECONDS */
        static TRADING_INTERVAL_SECONDS = {
            [PriceAnalysis.TRADING_INTERVAL.oneMinute]: 1 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.twoMinute]: 2 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.threeMinute]: 3 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.fiveMinute]: 5 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.sevenMinute]: 7 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.tenMinute]: 10 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.fifteenMinute]: 15 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.twentySevenMinute]: 27 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.thirtyMinute]: 30 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.fourtyFiveMinute]: 45 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
            [PriceAnalysis.TRADING_INTERVAL.oneHour]: 60 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS,
        }

        static EVENT_NAMES = {
            destroyCode: `${PriceAnalysis.PROJECT_NAME}_destroyCode`,
            setFutureInterval: `${PriceAnalysis.PROJECT_NAME}_setFutureInterval`
        }

        /** @type {{[key: string]: TradingFlags}} TRADING_FLAGS */
        static TRADING_FLAGS = {
            REGULAR: 'regular',
            PRECISION: 'precision',
        }

        static entryExitPricePrecisionThreshold = 0.12

        /**
         * 
         * @param {PriceHistory[]} history 
         * @param {CurrentPrice} currentPrice 
         * @param {Position} currentPosition 
         * @param {boolean} isCrypto 
         * @param {number} entryThreshold 
         * @param {number} exitThreshold 
         * @param {IntervalFlags} priceTradingInterval 
         * @param {IntervalFlags} pricePrecisionInterval 
         */
        constructor(history = [], currentPrice, currentPosition, isCrypto = false, entryThreshold, exitThreshold, priceTradingInterval, pricePrecisionInterval) {
            try {
                const now = Date.now()
                this._isCrypto = isCrypto
                this._entryThreshold = entryThreshold
                this._exitThreshold = exitThreshold
                this._peakValleyHistory = Array.from(history)
                // this._currentPrice = {
                //     price: currentPrice,
                //     epochDate: now,
                //     date: new Date(now).toISOString()
                // }
                this._currentPrice = currentPrice
                // this._currentPrice.date = new Date(this._currentPrice.epochDate).toISOString()
                this._currentPosition = currentPosition
                this._priceTradingInterval = priceTradingInterval
                // this._currentPosition = {date: '2025-01-16T05:11:22.719Z', price: 5, position: PriceAnalysis.IN}
                if (this.dateExistsForCurrrentPosition) {
                    this._currentPosition.epochDate = this.transformDateToEpochMiliseconds(this._currentPosition.date)
                }
            } catch (error) {
                console.log('Ida Trader Bot - PRICE ANALYSIS CONSTRUCTOR', error)
            }
            

        }

        /** @returns {PriceHistory[]} peakValleyProgressionOrder */
        get peakValleyProgressionOrder() {
            return this._peakValleyHistory.map((item) => {
                if (!('epochDate' in item)) {
                    // Needed for manual addition of price histories without epochDate
                    item.epochDate = this.transformDateToEpochMiliseconds(item.date)
                }
                return item
            })
            .filter((item) => {
                if (PriceAnalysis.TRADING_INTERVAL_SECONDS[this._priceTradingInterval] === undefined) {
                    return true
                }
                const flagsEmpty = item.flags.length === 0

                return item.flags.includes(this._priceTradingInterval) || flagsEmpty && item.epochDate < this.todaysDateMidnight
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

        /** @returns {PriceHistory[]} */
        get peakOnlyProgressionOrder() {
            return this.peakValleyProgressionOrder.filter((item) => item.type === PriceAnalysis.PEAK)
        }

        /** @returns {PriceHistory[]} */
        get valleyOnlyProgressionOrder() {
            return this.peakValleyProgressionOrder.filter((item) => item.type === PriceAnalysis.VALLEY)
        }

        /**
         * @returns {PriceHistory | undefined}
         */
        get highestPeakToday() {
            const peaks = this.peakOnlyProgressionOrder.filter((item) => item.epochDate > this.todaysDateMidnight)
            if (peaks.length === 0) {
                return undefined
            }
            const prices = peaks.map((item) => item.price)
            const maxPrice = Math.max(...prices)
            const maxPriceIndex = prices.lastIndexOf(maxPrice)
            return peaks[maxPriceIndex]
        }

        /** @returns {PriceHistory | undefined} */
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

        /** @returns {PriceHistory[]} */
        get highestPeakAndLowestValleyToday() {
            const list = []
            this.lowestValleyToday !== undefined ? list.push(this.lowestValleyToday) : null
            this.highestPeakToday !== undefined ? list.push(this.highestPeakToday) : null

            return list
        }

        /** @returns {PriceHistory | undefined} */
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

        get todaysPeakValleySnapshot() {
            // since peak and valley alternate in pattern they will always be side by side in progression order
            const openPeakValley = this.peakValleyToday.slice(0,2)
            const closePeakValley = this.peakValleyToday.slice(-2,undefined)
            /* Nice to have the deepest valley before the end of the day when the lowest valley
                of the day comes before the highest peak of the day (steep slope price increase edge case) */
            const lowestValleyAfterHighestPeakToday = []
            if (this.highestPeakToday !== undefined 
                && this.lowestValleyToday !== undefined
                && this.highestPeakToday.epochDate > this.lowestValleyToday.epochDate
            ) {
                const valleysAfterHighestPeakToday = this.valleyOnlyProgressionOrder
                    .filter((item) => item.epochDate > this.highestPeakToday.epochDate)
                if (valleysAfterHighestPeakToday.length > 0) {
                    const valleyPrices = valleysAfterHighestPeakToday.map((valley) => valley.price)
                    const minPrice = Math.min(...valleyPrices)
                    const minPriceIndex = valleyPrices.lastIndexOf(minPrice)

                    lowestValleyAfterHighestPeakToday.push(valleysAfterHighestPeakToday.at(minPriceIndex))
                }
            }

            return Array.from(this.highestPeakAndLowestValleyToday).concat(openPeakValley,lowestValleyAfterHighestPeakToday,closePeakValley)
        }

        /** @returns {undefined} */
        get peakValleySizeManagement() {
            return undefined
        }

        // get squashTodaysPeakValleyHistory() {
        //     const newPeakValleyHistory = Array.from(this.peakValleyBeforeToday).concat(this.todaysPeakValleySnapshot)
                                
        //     return newPeakValleyHistory
        // }

        get isCurrentPositionStuck() {
            const isStuckMaxPeak = this.findAnchorPeak(true)
            if (this._currentPosition === undefined
                || this._currentPrice === undefined
                || this._exitThreshold === undefined
                || this._currentPosition.position !== PriceAnalysis.IN 
                || !this.dateExistsForCurrrentPosition
                || typeof this._currentPosition.price !== 'number'
                || isStuckMaxPeak === undefined
            ) {
                return false
            }
            
            const stuckThreshold = 1 // 100%
            const stuckFromExitThreshold = this._exitThreshold*stuckThreshold
            const stuckFromExitThresholdPrice = PriceAnalysis.percentageFinalAmount(isStuckMaxPeak.price, stuckFromExitThreshold, true)
            const isCurrentPriceLessThanStuckFromExitThresholdPrice = this._currentPrice.price <= stuckFromExitThresholdPrice
            // Goal is to have the right amount of loss threshold to give us enough room for having more long term wins than losses
            const positionIsStuck = isCurrentPriceLessThanStuckFromExitThresholdPrice
            
            return positionIsStuck

        }

        /** 
         * @param {boolean} isStuckCheck
         * @returns {PriceHistory | undefined}
         */
        findAnchorPeak(isStuckCheck = false) {
            // filter peaks between recentPosition & currentPrice dates
            // search for highest peak
            // from highest peak make sure negative slope between peak and current price
            // from recentPosition price make sure positive slope between it and current price
            // logic not met do nothing and keep watching
            // Note current position date & price needed for this function to work
            if (this._currentPosition === undefined || this._currentPosition.position !== PriceAnalysis.IN || !this.dateExistsForCurrrentPosition) {
                return
            }

            const peaks = this.peakOnlyProgressionOrder
                .filter((item) => (item.epochDate >= this._currentPosition.epochDate && item.epochDate < this._currentPrice.epochDate))
            const prices = peaks.map((item) => item.price)
            const maxPrice = Math.max(...prices)
            const maxPriceIndex = prices.lastIndexOf(maxPrice)
            const maxPeak = peaks.at(maxPriceIndex)
            const slopeOfCurrentPriceFromPeak = this.priceSlope(maxPeak, this._currentPrice)
            const slopeOfCurrentPriceFromRecentPosition = this.priceSlope(this._currentPosition, this._currentPrice)
            if (isStuckCheck === true 
                && slopeOfCurrentPriceFromPeak !== undefined 
                && slopeOfCurrentPriceFromRecentPosition !== undefined 
                // we do not want precision interval getting us into a stuck state prematurely
                && this._currentPrice.flags.includes(PriceAnalysis.TRADING_FLAGS.REGULAR)
                && slopeOfCurrentPriceFromPeak.negative 
                && slopeOfCurrentPriceFromRecentPosition.negative
            ) {
                return maxPeak
            }

            if (isStuckCheck === false 
                && slopeOfCurrentPriceFromPeak !== undefined 
                && slopeOfCurrentPriceFromRecentPosition !== undefined 
                && slopeOfCurrentPriceFromPeak.negative 
                && slopeOfCurrentPriceFromRecentPosition.positive
            ) {
                return maxPeak
            }

            return

        }

        /** @returns {PriceHistory | undefined} */
        findAnchorValley() {
            // find closest highest peak
            // from closest highest peak date search for deepest valley
            // from deepest valley make sure positive slope between valley price and current price
            // logic not met do nothing and keep watching
                                
            if (this._currentPosition === undefined || this._currentPosition.position !== PriceAnalysis.OUT || this.closestHighestPeak === undefined) {
                return
            }
            const currentPositionDate = this.dateExistsForCurrrentPosition ? this._currentPosition.epochDate : this.closestHighestPeak.epochDate
            const valleysFromClosestHighestPeak = this.valleyOnlyProgressionOrder.filter((item) => {
                return (item.epochDate > this.closestHighestPeak.epochDate) && (item.epochDate >= currentPositionDate)
            })
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

        /** @returns {PriceHistory | undefined} */
        findAnchor() {
            if (this._currentPosition.position === PriceAnalysis.IN) {
                return this.findAnchorPeak()
            }

            return this.findAnchorValley()
        }

        /** @param {string} dateISOString 
        *   @returns {number | undefined}
        */
        transformDateToEpochMiliseconds(dateISOString) {
            // Make sure that you append stock market closing hour and ISO format [T00:00:00]
            // for non ISO format dates so parse method uses local timezone automatically
            if (dateISOString !== undefined || dateISOString !== '') {
                return Date.parse(dateISOString)
            }

            return undefined
        }

        /**
         * 
         * @param {Price} anchorPrice 
         * @param {Price} currentPrice 
         * @returns {{value: number; positive: boolean; negative: boolean;} | undefined}
         */
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

        /** @returns {PriceHistory | undefined} */
        findOptimalClosestHighestPeak() {
            // ignoring the current day look back from previous days to midnight of current day
            // use up to 10 business days
            // Note: volatile stocks might need lower max days lookback and vice versa
            // each max price for each past day range gets a point
            // the max price with the highest point we use (in edge case of multiple highest point we use the first one)

            /**
             * 
             * @param {number} dayToDeductFromInMiliSeconds 
             * @param {number} daysToDeduct 
             * @param {boolean} isCrypto 
             * @returns {number}
             */
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

            const businessDaysToLookBackTo = 9 // 10 business days => 2 weeks
            const daysAsList = [this.todaysDateMidnight]
            for (let i=0; i < businessDaysToLookBackTo; i++) {
                const yesterday =  shiftDateFromWeekend(daysAsList[i], 1, this._isCrypto)
                daysAsList.push(yesterday)
            }
            const peakList = this.peakOnlyProgressionOrder
            const todaysPeakIsCurrentPrice = this.highestPeakToday
                ? Math.floor(this._currentPrice.price) === Math.floor(this.highestPeakToday.price)
                : false
            const daysToProcess = daysAsList
            if (true) {
                // remove today for more accurate valley anchor in edge case
                daysToProcess.splice(0,1)
            }
            
            let tracker = new Map()
            // console.log(daysToProcess)
            daysToProcess.forEach((day, index) => {
                let basket = new Map()
                // Ignore today peaks to take advantage of steap slope increase in price
                peakList.filter((item) => item.epochDate > day && item.epochDate < this.todaysDateMidnight)
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
                return peakToUse
            }

            return
        }

        /**
         * 
         * @param {number} sampleSize 
         * @returns {number}
         */
        dayTradingAveragePrice(sampleSize = 200) {
            // we ignore 9:30 - 10:30am because of initial noise of the day
            // depending on the volume of the stock we might see really small sampleSize peaks & valleys
            const dateToIgnore = new Date(this.todaysDateMidnight).setHours(10,30,0,0)
            const priceHistoryFromIgnoredDate = this._peakValleyHistory.filter((item) => item.epochDate > dateToIgnore)

            if (priceHistoryFromIgnoredDate.length < sampleSize) {
                return
            }

            const firstTwoHundredPriceHistory = priceHistoryFromIgnoredDate.slice(0, sampleSize)
            const totalSum = firstTwoHundredPriceHistory.reduce((previousValue, currentValue) => {
                return previousValue + currentValue.price
            }, 0)

            return totalSum/firstTwoHundredPriceHistory.length
        }

        /**
         * 
         * @param {number} epochDate 
         * @param {number} daysNumber 
         * @param {boolean} skipWeekend 
         * @returns {number}
         */
        static addBusinessDaysToEpochDate(epochDate, daysNumber, skipWeekend = true) {
            const date = new Date(epochDate)
            const saturday = 6
            const friday = 5
            const sunday = 0
            const weekendDays = [saturday,sunday]
            const triggerDays = [friday,saturday]
            const dateDayIsWeekend = weekendDays.includes(date.getDay())
            const twentyFourHoursInMiliSeconds = 1000*60*60*24
            let dateForSkipWeekend = epochDate
            if (skipWeekend === false) {
                return epochDate + (twentyFourHoursInMiliSeconds * daysNumber)
            }
            if (skipWeekend === true) {
                for (let i=0; i < daysNumber; i++) {
                    const dateInstance = new Date(dateForSkipWeekend)
                    const day = dateInstance.getDay()
                    const triggerSkip = triggerDays.includes(dateInstance.getDay())
                    const extendDaysBy = day === friday ? 2 : 1
                    if (triggerSkip) {
                        dateForSkipWeekend += twentyFourHoursInMiliSeconds * extendDaysBy
                    }
                    dateForSkipWeekend += twentyFourHoursInMiliSeconds
                }
                return dateForSkipWeekend
            }

        }

        /**
         * 
         * @param {number} startAmount 
         * @param {number} percentageAmount 
         * @param {boolean} negative 
         * @returns {number}
         */
        static percentageFinalAmount(startAmount, percentageAmount, negative = false) {
            const sign  = negative === true ? -1 : 1
            return startAmount*(1 + (sign * percentageAmount/100))
        }

        /**
         * 
         * @param {string | number | Date} dateObjectOrString 
         * @returns 
         */
        static hourMinuteStringFormat(dateObjectOrString) {
            const date = dateObjectOrString instanceof Date ?  dateObjectOrString : new Date(dateObjectOrString)
            return `${date.getHours()}:${date.getMinutes()}`
        }

        /**
         * 
         * @param {boolean} isCrypto 
         * @returns {number[]}
         */
        static tradingStartTime (isCrypto = false) {
            // Hour, Minute, Seconds
            // Add 1 minute to the minute time to have the close price of that minute
            return isCrypto 
                ? [0, 0 + 1, 0] 
                : [9, 30 + 1, 0]
        }
        
        /**
         * 
         * @param {boolean} isCrypto 
         * @returns {number[]}
         */
        static tradingEndTime (isCrypto = false) {
            // Hour, Minute, Seconds
            return isCrypto 
                ? [23, 58, 0] 
                : [15, 59, 59]
        }

        /**
         * 
         * @param {boolean} isCrypto 
         * @returns {number[]}
         */
        static tradingHistoryUploadTime (isCrypto = false) {
            // Hour, Minute, Seconds
            return isCrypto 
                ? PriceAnalysis.tradingEndTime(true)
                : [16, 10, 0] // buffer needed for timezone
        }

       /**
        * 
        * @param {string} code 
        * @returns {string}
        */
        static primaryCode(code) {
            return code.split('_')[0]
        }
        
    }
    /**
     * 
     * @param {string} val 
     * @returns {number}
     */
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
    /**
     * 
     * @param {string} val 
     * @returns {string}
     */
    const sanitizePrice = (val) => {
        if (typeof val === 'string') {
            return val.replace('$', '')
        }

        return val
    }
    /**
     * 
     * @param {number} oldNumber 
     * @param {number} newNumber 
     * @param {boolean} includeSign 
     * @returns {number | undefined}
     */
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

    const numberIsWithinOneDirectionalRange = (first, second, percentageLimit, directionPositive = true) => {
        const delta = Number(percentageDelta(first, second, true).toFixed(2))
        const absolutePercentageLimit = Math.abs(percentageLimit)

        if (!directionPositive) {
            return delta <= 0 && delta >= -1 * absolutePercentageLimit
        }

        return delta >= 0 && delta <= absolutePercentageLimit
    }

    /**
     * 
     * @param {PriceHistory | undefined} anchor 
     * @param {number} entryThreshold 
     * @param {number} exitThreshold 
     * @returns {number | undefined}
     */
    const applyEntryExitThresholdToAnchor = (anchor, entryThreshold, exitThreshold) => {
        if (anchor !== undefined && 'price' in anchor && 'type' in anchor) {
            if (anchor.type === PriceAnalysis.PEAK) {
                return PriceAnalysis.percentageFinalAmount(anchor.price, exitThreshold, true)
            }
            if (anchor.type === PriceAnalysis.VALLEY) {
                return PriceAnalysis.percentageFinalAmount(anchor.price, entryThreshold)
            }
        }

        return
    }
    /**
     * 
     * @param {string} code 
     * @param {boolean} squashTodaysHistory 
     * @returns {Promise<void>}
     */
    const uploadTodaysPriceHistory = async (code = window.idaStockVision.code, squashTodaysHistory = true) => {
        try {
            const primaryCode = code.split('_')[0]
            const priceStore = window.idaStockVision.priceStore
            // const settings = window.idaStockVision.settings
            // const startTime = window.idaStockVision.tradingStartTime
            let snapShotBasket = []
            const allCodesPeakValleySnapshots = Object.values(priceStore.todaysPeakValleySnapshot).flat()
            const uniquePeakValleySnapshots = allCodesPeakValleySnapshots.flatMap((item) => {
                const itemExists = snapShotBasket.includes(item)
                if (!itemExists) {
                    snapShotBasket.push(item)
                }
                return itemExists ? [] : item
            })
            if (uniquePeakValleySnapshots.length === 0) {
                return
            }
            const payload = new URLSearchParams()
            payload.append('code', code)
            payload.append('primaryCode', primaryCode)
            payload.append('peakValleyToday', JSON.stringify(uniquePeakValleySnapshots))
            const resp = await fetch(`${window.idaStockVision.serverUrl}/trader/history?${payload.toString()}`, {
                method: 'POST',
                mode: 'cors',
            })
            if (squashTodaysHistory) {
                const squashTodaysPeakValleyHistoryForAllCodes = 
                    Array.from(priceStore.analysis[code].peakValleyBeforeToday).concat(uniquePeakValleySnapshots)
                priceStore.peakValleyHistory = squashTodaysPeakValleyHistoryForAllCodes
                // Make sure that lastPrice does not become a peak or valley in the next trading session
                priceStore.lastPrice = undefined
                priceStore.previousLastPrice = undefined
                // TO-DO run for all codes since this is setup only one time regardless of multiple codes initialized
                window.dispatchEvent(new Event(PriceAnalysis.EVENT_NAMES.setFutureInterval))
            }
        } catch (error) {
            console.log('Ida Trader Bot - UPLOAD TODAYS PRICE HISTORY', error)
        }
        
    }
    /**
     * 
     * @param {boolean} isCrypto 
     * @param {number} currentTimeoutDateInMiliseconds 
     * @param {Function} callback 
     * @returns {number | undefined}
     */
    const setUploadPricesTimeout = (isCrypto, currentTimeoutDateInMiliseconds, callback) => {
        // will be initialized by the first code but other codes can continue when the first code is destroyed
        let isSameDate = false
        let currentTiemoutInDateObject
        const nowInMilliSeconds = Date.now()
        const nowInDateObject = new Date(nowInMilliSeconds)
        const [endHour, endMinute, endSecond] = PriceAnalysis.tradingHistoryUploadTime(isCrypto)
        const uploadTime =  new Date(nowInMilliSeconds).setHours(endHour, endMinute, endSecond,0) 
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
    /**
     * @param {string} code
     * @returns {Promise<Response>}
     */
    const statusHTTP = (code) => {
        const queryParams = new URLSearchParams()
        queryParams.append('code', code)
        return fetch(`${window.idaStockVision.serverUrl}/trader/status?${queryParams.toString()}`, {
            method: 'GET',
            mode: 'cors',
        })
    }
    /**
     * 
     * @param {string} code 
     * @param {boolean} restartCounter 
     * @returns {Promise<void>}
     */
    const positionStatusPolling = async (code = window.idaStockVision.code, restartCounter = false) => {
        try {
            if (restartCounter) {
                clearTimeout(window.idaStockVision.statusTimeoutInstance)
                window.idaStockVision.statusCounter = 0
            }
            const resp = await statusHTTP(code)
            const data = await resp.json()
            const codes = Object.keys(window.idaStockVision.positionIn)
            const timeOutSeconds = window.idaStockVision.statusTimeoutList.at(window.idaStockVision.statusCounter)
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
    /**
      * 
      * @param {string} code 
      */
    const destroyCode = (code) => {
        const codeUpperCase = code.toUpperCase()
        window.dispatchEvent(new CustomEvent(PriceAnalysis.EVENT_NAMES.destroyCode, {detail: {code: codeUpperCase}}))
        // window.idaStockVision.mutationObservers[codeUpperCase].disconnect()
        // delete window.idaStockVision.positionIn[codeUpperCase]
        // clearInterval(window.idaStockVision.intervalInspectorInstance[codeUpperCase])
        // clearTimeout(window.idaStockVision.timeoutInspectorInstance[codeUpperCase])
    }
    /**
      * 
      * @param {string} code 
      */
    const pauseWatchCode = (code) => {
        const codeUpperCase = code.toUpperCase()
        window.idaStockVision.mutationObservers[codeUpperCase].disconnect()
    }
    /**
      * 
      * @param {string} code 
      */
    const traderSetUp = async (code) => {
        if (!('idaStockVision' in window)) {
            window.idaStockVision = {
                positionIn: {},
                notificationInProgress: {},
                lastNotificationSent: {},
                mutationObservers: {},
                consoleClearInstance: setInterval(()=>{console.clear()}, 1000*60*20),
                // window.idaStockVision is deleted before function fires rendering it usless
                // windowCloseEventListener: window.addEventListener('beforeunload', () => {uploadTodaysPriceHistory(undefined,false)}),
                code: code,
                statusTimeoutList: [60*1000,60*1000*3,60*1000*5,60*1000*10,60*1000*20,60*1000*20,60*1000*60,60*1000*60,60*1000*60,60*1000*60,60*1000*60,60*1000*60],
                statusTimeoutInstance: undefined,
                statusCounter: 0,
                intervalInspectorInstance: {},
                timeoutInspectorInstance: {},
                serverUrl: '',
                notificationServerUrl: '',
                tradingStartTime: PriceAnalysis.tradingStartTime(isCrypto),
                tradingEndTime: PriceAnalysis.tradingEndTime(isCrypto),
                priceStore: {
                    lastPrice: undefined,
                    previousLastPrice: undefined,
                    marketHighLowRange: {
                        low: undefined,
                        high: undefined
                    },
                    peakValleyHistory: [],
                    highestPeakAndLowestValleyToday: {},
                    todaysPeakValleySnapshot: {},
                    currentPosition: {},
                    analysis: {},
                    priceTimeIntervalsToday: {},
                    precisionTimeIntervalsToday: {},
                    uploadTodaysPriceTime: undefined,
                },
                tools: {
                    decimalConvert,
                    percentageDelta,
                    percentageFinalAmount: PriceAnalysis.percentageFinalAmount,
                    uploadTodaysPriceHistory,
                    positionStatusPolling,
                    destroyCode,
                    pauseWatchCode,
                },
                settings: {},
                server: {
                    // development: 'http://localhost:9000',
                    // developmentNotification: 'http://10.0.0.148:9000',
                    production: 'https://styleminions.co/ninja', // [cs]
                    localServer: 'http://localhost:9000', // [ls]
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
                        price: () => document.querySelector('#singleSecurityQuote > div > div > div > div> div:nth-child(2) > h2'),
                        lowRange: () => document.querySelector('#singleSecurityQuote > div > div > div > div > div:nth-child(4) > h3'),
                        highRange: () => document.querySelector('#singleSecurityQuote > div > div > div > div > div:nth-child(3) > h3'),
                    },
                    tmx: {
                        // no websocket update
                        price: () => document.evaluate('//*[@id="js-category-content"]/div[1]/div[1]/div/div/div/div[3]/div[1]/div/div[1]/span[1]',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                        lowRange: () => document.querySelector('div[data-testid=dayHighLow-value] span:last-child'),
                        highRange: () => document.querySelector('div[data-testid=dayHighLow-value] span:first-child'),
                    },
                    webull: {
                        // https only
                        price: () => document.querySelector("#app > section > div > div > div > div > div > div:nth-child(2) > div > div"),
                        preMarketAndAfterHoursPrice: () => document.querySelector("#app > section > div > div > div > div > div > div:nth-child(2) > div > div > span"),
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

                },
                constants: {}
            }
        }

        if (!(code in window.idaStockVision.positionIn)) {
            const codeStartTime = window.idaStockVision.tradingStartTime
            window.idaStockVision.positionIn[code] = false
            window.idaStockVision.notificationInProgress[code] = false
            window.idaStockVision.lastNotificationSent[code] = {}
            window.idaStockVision.priceStore.currentPosition[code] = 
                /** @type {Position}*/ 
                ({
                    position: false,
                })
            window.idaStockVision.priceStore.analysis[code] = undefined
            window.idaStockVision.priceStore.todaysPeakValleySnapshot[code] = []
            window.idaStockVision.priceStore.highestPeakAndLowestValleyToday[code] = []
            window.idaStockVision.intervalInspectorInstance[code] = undefined
            window.idaStockVision.timeoutInspectorInstance[code] = undefined
            window.idaStockVision.tools[`watch_${code}`] = watch
            window.idaStockVision.settings[code] = {
                tradingInterval,
                precisionInterval,
                experiment: false,
            }
            setTradingTimeInterval(code, PriceAnalysis.TRADING_INTERVAL_SECONDS[tradingInterval], PriceAnalysis.TRADING_INTERVAL_SECONDS[precisionInterval], codeStartTime[0], codeStartTime[1], codeStartTime[2])
            const setFutureIntervalListener = () => {
                setTradingTimeInterval(code, PriceAnalysis.TRADING_INTERVAL_SECONDS[tradingInterval], PriceAnalysis.TRADING_INTERVAL_SECONDS[precisionInterval], codeStartTime[0], codeStartTime[1], codeStartTime[2], true)
            }
            window.addEventListener(PriceAnalysis.EVENT_NAMES.setFutureInterval, setFutureIntervalListener)
            window.addEventListener(PriceAnalysis.EVENT_NAMES.destroyCode, (/** @type{CustomEvent} */customEvent) => {
                const eventCode = customEvent.detail.code
                if (eventCode === code) {
                    if (window.idaStockVision.mutationObservers[code].disconnect) {
                        window.idaStockVision.mutationObservers[code].disconnect()
                    }
                    delete window.idaStockVision.positionIn[code]
                    window.removeEventListener(PriceAnalysis.EVENT_NAMES.setFutureInterval, setFutureIntervalListener)
                    clearInterval(window.idaStockVision.intervalInspectorInstance[code])
                    clearTimeout(window.idaStockVision.timeoutInspectorInstance[code])
                    window.idaStockVision.timeoutInspectorInstance[code] = undefined
                    window.idaStockVision.intervalInspectorInstance[code] = undefined
                }
            })
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
            }
            if (
                primaryCode in data && 
                'peakValleyHistory' in data[primaryCode] && 
                window.idaStockVision.priceStore.peakValleyHistory.length === 0
            ) {
                /** @type {PriceHistory[]} */
                const addedFlagsMap = data[primaryCode].peakValleyHistory.map((item) => {
                    if (!('flags' in item)) {
                        item.flags = []
                    }
                    return item
                })
                window.idaStockVision.priceStore.peakValleyHistory.push(...addedFlagsMap)
            }
            window.idaStockVision.notificationInProgress[code] = false
        } catch (error) {
            console.log('Ida Trader Bot - TRADER SETUP ERROR', error)
        }
    }
    /**
      * 
      * @param {string} tokenOrStockCode 
      * @param {string} messageBody 
      * @param {number} currentPrice 
      * @param {string} action 
      * @param {number | string} anchorPrice 
      * @param {string} confirmationLink 
      * @returns {Promise<void>}
      */
    const sendNotification =  async (tokenOrStockCode, messageBody = 'manual confirmation', currentPrice, action, anchorPrice, confirmationLink) => {
        const priceDifferencePercentage = 'currentPrice' in window.idaStockVision.lastNotificationSent[tokenOrStockCode] 
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
        const experimentMode = window.idaStockVision.settings[tokenOrStockCode].experiment === true
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
            queryParams.append('primaryCode', PriceAnalysis.primaryCode(tokenOrStockCode))
            queryParams.append('action', action)
            queryParams.append('currentPrice', currentPrice.toString())
            queryParams.append('confirmationLink', confirmationLink)
            const cloudServerRequest = fetch(`${window.idaStockVision.serverUrl}/trader/notify?${queryParams.toString()}`, {
                method: 'POST',
                mode: 'cors',
            })
            const localServerRequest = () => {
                if (experimentMode) {
                    // we do not want to auto trade in experiment mode
                    return Promise.resolve()
                }
                return fetch(`${window.idaStockVision.server.localServer}/trader/notify?${queryParams.toString()}`, {
                    method: 'POST',
                    mode: 'cors',
                })
            }
            const resp = await Promise.allSettled([cloudServerRequest,localServerRequest()])
            // const data = await resp[0].value.json()
            if (experimentMode) {
                // auto confirm in experiment mode
                fetch(`${confirmationLink}`, {
                    method: 'GET',
                    mode: 'cors',
                })
            }
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
    /**
      * 
      * @param {CurrentPrice} currentPrice 
      * @param {PriceHistory | undefined} peakValleyDetected 
      * @param {IntervalFlags} intervalFlag 
      */
    const updatePrices = (currentPrice, peakValleyDetected, intervalFlag) => {
        try {
            const priceStore = window.idaStockVision.priceStore
            const {low, high} = priceStore.marketHighLowRange
            const isHighLowRangeValid = [low, high].every((item) => typeof item === 'number' && item > 0)
            // Reduce market noise from outlier price trades(pre-market & after market hours especially)
            const isCurrentPriceWithinMarketRange = isHighLowRangeValid ? (currentPrice.price >= low && currentPrice.price <= high) : true

            if (priceStore.lastPrice?.price !== currentPrice.price) {
                priceStore.previousLastPrice = priceStore.lastPrice
                priceStore.lastPrice = currentPrice
            }

            if (peakValleyDetected !== undefined) {
                addIntervalFlagToPeakValleyDetectedOrCurrentPrice(code, peakValleyDetected, intervalFlag)
                priceStore.peakValleyHistory.push(peakValleyDetected)
            }
        } catch (error) {
            console.log('Ida Trader Bot - UPDATE PRICES', error)
        }
    }
    /**
      * 
      * @param {CurrentPrice} currentPrice 
      * @param {Price} lastPrice 
      * @param {Price} previousLastPrice 
      * @returns {undefined | PriceHistory}
      */
    const peakValleyDetection = (currentPrice, lastPrice, previousLastPrice) => {
        if (lastPrice !== undefined && previousLastPrice !== undefined) {
            const payload = {
                date: lastPrice.date,
                epochDate: lastPrice.epochDate,
                price: lastPrice.price,
                type: undefined,
                flags: [],
            }
            if (lastPrice.price >= previousLastPrice.price && lastPrice.price > currentPrice.price) {
                payload.type = 'peak'
                return payload
            }
            if (lastPrice.price <= previousLastPrice.price && lastPrice.price < currentPrice.price) {
                payload.type = 'valley'
                return payload
            }
        }

        return
    }

    /**
      * 
      * @param {string} code 
      * @param {number[]} intervals 
      * @param {number | undefined} intervalInSeconds 
      * @param {number} startHour 
      * @param {number} startMinute 
      * @param {number} startSeconds 
      * @param {boolean} forTomorrow 
      */
    const tradingTimeInterval = (code, intervals, intervalInSeconds, startHour = 0, startMinute = 0, startSeconds = 0, forTomorrow = false) => {
        if (intervalInSeconds === undefined) {
            return
        }
        let today = new Date()
        if (forTomorrow) {
            const tomorrowEpoch = today.getTime() + 24*PriceAnalysis.TRADING_INTERVAL_SECONDS[PriceAnalysis.TRADING_INTERVAL.oneHour]
            today = new Date(tomorrowEpoch)
            clearInterval(window.idaStockVision.intervalInspectorInstance[code])
            window.idaStockVision.intervalInspectorInstance[code] = undefined
            window.idaStockVision.timeoutInspectorInstance[code] = undefined
        }
        const [endHour, endMinute, endSecond] = window.idaStockVision.tradingEndTime
        const stopTime = today.setHours(endHour, endMinute, endSecond, 0)
        const startTime = today.setHours(startHour,startMinute,startSeconds,0)
        const createTimeIntervals = (start, stop) => {
            const interval = start+intervalInSeconds
            // console.log(start, stop)
            !intervals.includes(interval) && interval < stopTime ?  intervals.push(interval) : null
            if (interval <= stop) {
                createTimeIntervals(interval, stop)
            }
        }
        !intervals.includes(startTime) ?  intervals.push(startTime) : null
        createTimeIntervals(startTime, stopTime)

    }

    /**
      * 
      * @param {number[]} intervals 
      * @returns {Map<string, TradingIntervalInspection>}
      */
    const tradingTimeIntervalForPeakDetection = (intervals) => {
        let timeKeysWithFlags = new Map()
        intervals.forEach((item, index) => {
            const hourMinuteString = PriceAnalysis.hourMinuteStringFormat(item)
            timeKeysWithFlags.set(hourMinuteString, {
                peakCaptured: false,
                valleyCaptured: false,
                currentPriceExecuted: false,
                epochDate: item,
                // 1 minute after interval time
                inspectionEpochDate: item + PriceAnalysis.TRADING_INTERVAL_SECONDS[PriceAnalysis.TRADING_INTERVAL.oneMinute], 
                hourMinute: hourMinuteString,
                index,
                peakPrice: undefined,
                valleyPrice: undefined,
                currentPrice: undefined,
            })
        })

        return timeKeysWithFlags
    }

    /**
      * 
      * @param {number[]} intervals 
      * @returns {Map<string, PrecisionIntervalInspection>}
      */
    const precisionTimeIntervalForPricePrecision = (intervals) => {
        /** @type {Map<string, PrecisionIntervalInspection>} */
        let timeKeysWithFlags = new Map()
        intervals.forEach((item, index) => {
            const hourMinuteString = PriceAnalysis.hourMinuteStringFormat(item)
            timeKeysWithFlags.set(hourMinuteString, {
                currentPriceExecuted: false,
                epochDate: item,
                // 1 minute after interval time
                inspectionEpochDate: item + PriceAnalysis.TRADING_INTERVAL_SECONDS[PriceAnalysis.TRADING_INTERVAL.oneMinute], 
                hourMinute: hourMinuteString,
                index,
                currentPrices: [],
            })
        })

        return timeKeysWithFlags
    }

    /**
      *  
      * @param {string} code 
      * @param {number | undefined} tradingIntervalInSeconds 
      * @param {number | undefined} precisionIntervalInSeconds 
      * @param {number} startHour 
      * @param {number} startMinute 
      * @param {number} startSeconds 
      * @param {boolean} forTomorrow 
      */
    const setTradingTimeInterval = (code, tradingIntervalInSeconds, precisionIntervalInSeconds, startHour, startMinute, startSeconds, forTomorrow = false) => {
        let tradingIntervalsBag = []
        let precisionIntervalsBag = []
        tradingTimeInterval(code, tradingIntervalsBag, tradingIntervalInSeconds, startHour, startMinute, startSeconds, forTomorrow)
        tradingTimeInterval(code, precisionIntervalsBag, precisionIntervalInSeconds, startHour, startMinute, startSeconds, forTomorrow)
        window.idaStockVision.priceStore.priceTimeIntervalsToday[code] = tradingTimeIntervalForPeakDetection(tradingIntervalsBag)
        window.idaStockVision.priceStore.precisionTimeIntervalsToday[code] = precisionTimeIntervalForPricePrecision(precisionIntervalsBag)
    }

    /**
      * 
      * @param {string} code 
      * @param {PriceHistory | CurrentPrice} peakValleyDetectedOrCurrentPrice 
      * @param {IntervalFlags} intervalFlag
      */
    const addIntervalFlagToPeakValleyDetectedOrCurrentPrice = (code, peakValleyDetectedOrCurrentPrice, intervalFlag) => {
        if (PriceAnalysis.TRADING_INTERVAL_SECONDS[intervalFlag] === undefined) {
            return
        }
        const priceStore = window.idaStockVision.priceStore
        const isPeakValley = 'type' in peakValleyDetectedOrCurrentPrice && ['peak','valley'].includes(peakValleyDetectedOrCurrentPrice.type)
        const timeFormatString = PriceAnalysis.hourMinuteStringFormat(peakValleyDetectedOrCurrentPrice.date)
        const tradingIntervalMatch = priceStore.priceTimeIntervalsToday[code].has(timeFormatString)
        const precisionIntervalMatch = priceStore.precisionTimeIntervalsToday[code].has(timeFormatString)
        if (tradingIntervalMatch === true) {
            const tradngIntervalSettings = priceStore.priceTimeIntervalsToday[code].get(timeFormatString)
            
            if (isPeakValley) {
                switch(peakValleyDetectedOrCurrentPrice.type) {
                    case 'peak':
                        if (!tradngIntervalSettings.peakCaptured) {
                            peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag)
                            tradngIntervalSettings.peakCaptured = true
                            tradngIntervalSettings.peakPrice = peakValleyDetectedOrCurrentPrice.price
                        }
                        break;
                    case 'valley':
                        if (!tradngIntervalSettings.valleyCaptured) {
                            peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag)
                            tradngIntervalSettings.valleyCaptured = true
                            tradngIntervalSettings.valleyPrice = peakValleyDetectedOrCurrentPrice.price
                        }
                        break;
                    default:
                }
            }

            if (!isPeakValley && !tradngIntervalSettings.currentPriceExecuted) {
                peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag, PriceAnalysis.TRADING_FLAGS.REGULAR)
                tradngIntervalSettings.currentPriceExecuted = true
                tradngIntervalSettings.currentPrice = peakValleyDetectedOrCurrentPrice
            }
        }

        if (precisionIntervalMatch === true && !isPeakValley) {
            // Allow all price movements within the minute of the interval match to maximize chances of having precision execution
            const precisionIntervalSettings = priceStore.precisionTimeIntervalsToday[code].get(timeFormatString)

            peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag, PriceAnalysis.TRADING_FLAGS.PRECISION)
            precisionIntervalSettings.currentPriceExecuted = true
            precisionIntervalSettings.currentPrices.push(peakValleyDetectedOrCurrentPrice)
        }
    }

    /**
      * 
      * @param {string} code 
      * @param {Map<string, TradingIntervalInspection>} intervalBag 
      * @param {number} intervalSeconds  
      */
    const tradingIntervalInspector = (code, intervalBag, intervalSeconds) => {
        try {
            const now = Date.now()
            const intervalForNow = intervalBag.values().toArray()
                .filter((item) => item.epochDate < now)
                .at(-1)
            if (intervalForNow === undefined) {
                window.idaStockVision.timeoutInspectorInstance[code] = undefined
                return 
            }
            const intervalKey = intervalForNow.hourMinute
            const lastPrice = window.idaStockVision.priceStore.lastPrice
            const interval = intervalBag.get(intervalKey)
            const peakValleyCaptured = [interval.peakCaptured, interval.valleyCaptured].every((item) => item === true)
            const currentTimePriceExecuted = interval.currentPriceExecuted === true
            const tradingInterval = window.idaStockVision.settings[code].tradingInterval
            
            if (!peakValleyCaptured) {
                const closestPeakValleyToNow = window.idaStockVision.priceStore.peakValleyHistory.filter((item) => {
                    return 'epochDate' in item && item.epochDate < now
                })
                const closestPeaksToNow = closestPeakValleyToNow.filter((item) => {
                    return item.type === PriceAnalysis.PEAK
                })
                const closestValleysToNow = closestPeakValleyToNow.filter((item) => {
                    return item.type === PriceAnalysis.VALLEY
                })
                const peakAndValleyToUse = [closestPeaksToNow.at(-1), closestValleysToNow.at(-1)]
                peakAndValleyToUse.forEach((item) => {
                    // const flagExists = 'flags' in item
                    // if (!flagExists) {
                    //     item.flags = []
                    // }
                    if (item && !item.flags.includes(tradingInterval)) {
                        item.flags.push(tradingInterval)
                        interval[`${item.type}Captured`] = true
                        console.log(`inspector: closest ${item.type} flagged`)
                    }
                })
            }


            if (!currentTimePriceExecuted) {
                const record = {
                    target: {
                        nodeValue: String(lastPrice.price)
                    }
                }
                mutationObserverCallback(/** @type{MutationRecord[]}*/ ([record]), undefined, true)
                interval.currentPriceExecuted = true
                console.log('inspector: interval time price execution completed')
            }


            if (window.idaStockVision.intervalInspectorInstance[code] === undefined) {
                window.idaStockVision.intervalInspectorInstance[code] = window.setInterval(() => {
                    tradingIntervalInspector(code, intervalBag, intervalSeconds)
                }, intervalSeconds)
            }

            console.log('inspector: check completed')
        } catch (error) {
            console.log('Ida Trader Bot - TRADING INTERVAL INSPECTOR', error)
        }
        
        
    }

    /**
      * 
      * @param {string} code 
      * @param {Map<string, TradingIntervalInspection>} tradingIntervalBag 
      * @param {number} tradingIntervalSeconds 
      * @param {Map<string, PrecisionIntervalInspection>} precisionIntervalBag 
      * @param {number} precisionIntervalSeconds 
      */
    const runTradingIntervalInspector = (code, tradingIntervalBag, tradingIntervalSeconds, precisionIntervalBag, precisionIntervalSeconds) => {
        // check date and time
        // make sure now is not beyond trading end time
        // find/get closest time > now that needs to be checked
        // calculate the milliseconds needed to run the check
        // setTimeout with the seconds needed
        const today = new Date()
        const nowEpochDate = today.getTime()
        /** @type {TradingIntervalInspection[]} */
        const intervalBagValues = tradingIntervalBag.values().toArray()
        if (intervalBagValues.length === 0) {
            return
        }
        const firstIntervalItem = intervalBagValues[0]
        const firstIntervalItemDate = new Date(firstIntervalItem.epochDate)
        const [startHour, startMinute, startSeconds] = window.idaStockVision.tradingStartTime
        // check the interval bag has todays date and reset the interval bag otherwise (after weekend, public holidays, etc)
        if (firstIntervalItemDate.getDate() !== today.getDate()) {
            setTradingTimeInterval(code, tradingIntervalSeconds, precisionIntervalSeconds, startHour, startMinute, startSeconds)
            return
        }

        if (window.idaStockVision.timeoutInspectorInstance[code] === undefined) {
            const inspectionTimeForNow = intervalBagValues
                .filter((item) => item.epochDate > nowEpochDate)
                .at(0)
            if (inspectionTimeForNow === undefined) {
                return 
            }
            const inspectionTime = inspectionTimeForNow.inspectionEpochDate
            const timeDifference = inspectionTime - nowEpochDate
            console.log(inspectionTime)
            window.idaStockVision.timeoutInspectorInstance[code] = window.setTimeout(() => {
                tradingIntervalInspector(code, tradingIntervalBag, tradingIntervalSeconds)
            }, timeDifference)
        }

    }
    
    traderSetUp(code)

    /**
      * 
      * @param {MutationRecord[]} mutationArray 
      * @param {MutationObserver} observerInstance 
      * @param {boolean} inspectorTrigger 
      * @returns {void}
      */
    const mutationObserverCallback = (mutationArray, observerInstance, inspectorTrigger) => {
        try {
            // TO-DO have a disconnect method to cleanup setTimeouts for history upload
            const nowEpochDate = Date.now()
            const nowDateFullString = new Date(nowEpochDate).toString()
            const nowDateISOString = new Date(nowEpochDate).toISOString()
            const lastRecord = mutationArray[mutationArray.length - 1]
            const targetValue = lastRecord.target.nodeValue.replace('$','')
            const priceStore = window.idaStockVision.priceStore
            /** @type {CurrentPrice} */
            const currentPrice =  {epochDate: nowEpochDate, date: nowDateISOString, price: decimalConvert(targetValue), flags: []}
            addIntervalFlagToPeakValleyDetectedOrCurrentPrice(code, currentPrice, tradingInterval)
            if (inspectorTrigger === true) {
                currentPrice.flags.push(tradingInterval)
            }
            const confirmationLink = `${window.idaStockVision.notificationServerUrl}/trader/confirm?`
            const confirmationQueryParams = new URLSearchParams()
            let entryPrice = manualEntryPrice
            let exitPrice = manualExitPrice
            let analysis, anchor
            /** @type {number | string} */
            let anchorPrice = ''
            let notificationBody = ''
            let onlyPrecisionFlagExistsOnCurrentPrice = false
            const autoEntryExitMode = entryPrice === undefined && exitPrice === undefined
            if (autoEntryExitMode) {
                const currentPosition = priceStore.currentPosition[code]
                const peakValleyDetected = peakValleyDetection(currentPrice, priceStore.lastPrice, priceStore.previousLastPrice)
                updatePrices(currentPrice, peakValleyDetected, tradingInterval)
                analysis = new PriceAnalysis(priceStore.peakValleyHistory, currentPrice, currentPosition, isCrypto, entryPercentage, exitPercentage, tradingInterval, precisionInterval)
                priceStore.analysis[code] = analysis
                entryPrice = applyEntryExitThresholdToAnchor(analysis.findAnchorValley(), entryPercentage, exitPercentage)
                exitPrice = analysis.isCurrentPositionStuck ? currentPrice.price : applyEntryExitThresholdToAnchor(analysis.findAnchorPeak(), entryPercentage, exitPercentage)
                priceStore.peakValleyHistory = analysis.peakValleySizeManagement !== undefined 
                    ? analysis.peakValleySizeManagement
                    : priceStore.peakValleyHistory
                priceStore.highestPeakAndLowestValleyToday[code] = analysis.highestPeakAndLowestValleyToday
                priceStore.todaysPeakValleySnapshot[code] = analysis.todaysPeakValleySnapshot
                anchor = analysis.findAnchor()
                anchorPrice = anchor !== undefined ? anchor.price : 'no-anchor'
                // should be set after all flags have been possibly set
                onlyPrecisionFlagExistsOnCurrentPrice = currentPrice.flags.includes(PriceAnalysis.TRADING_FLAGS.PRECISION) 
                    && !currentPrice.flags.includes(PriceAnalysis.TRADING_FLAGS.REGULAR)
                runTradingIntervalInspector(code, priceStore.priceTimeIntervalsToday[code], PriceAnalysis.TRADING_INTERVAL_SECONDS[tradingInterval], priceStore.precisionTimeIntervalsToday[code], PriceAnalysis.TRADING_INTERVAL_SECONDS[precisionInterval])
                const timeToUpload = setUploadPricesTimeout(isCrypto,priceStore.uploadTodaysPriceTime,uploadTodaysPriceHistory)
                if (typeof timeToUpload === 'number') {
                    priceStore.uploadTodaysPriceTime = timeToUpload
                }
                if (anchor !== undefined){
                    notificationBody = notificationBody.concat(`Anchor Price: ${anchorPrice} \r\n`)
                    notificationBody = notificationBody.concat(`Anchor Type: ${anchor.type} \r\n`)
                }
                notificationBody = window.idaStockVision.positionIn[code] 
                    ? notificationBody.concat(`Gross Profit(%): ${percentageDelta(currentPosition.price, currentPrice.price, true)} \r\n`)
                    : notificationBody
                notificationBody = analysis.isCurrentPositionStuck
                    ? notificationBody.concat(`Stuck: true \r\n`)
                    : notificationBody
            }
            const stockRangeDecision = {
                // No need for <= to logic since probability of exact match is very low
                enter: currentPrice.price < entryPrice,
                exit: currentPrice.price >= exitPrice,
            }
            const stockSurfDecision = {
                enter: onlyPrecisionFlagExistsOnCurrentPrice 
                    ? numberIsWithinOneDirectionalRange(entryPrice,currentPrice.price,PriceAnalysis.entryExitPricePrecisionThreshold) 
                    : currentPrice.price >= entryPrice,
                exit: onlyPrecisionFlagExistsOnCurrentPrice 
                    ? numberIsWithinOneDirectionalRange(exitPrice,currentPrice.price,PriceAnalysis.entryExitPricePrecisionThreshold,false) 
                    : currentPrice.price <= exitPrice,
            }
            const enterDecision = !autoEntryExitMode ? stockRangeDecision.enter : stockSurfDecision.enter
            const exitDecision = !autoEntryExitMode ? stockRangeDecision.exit : stockSurfDecision.exit
            
            let color = 'red'
            let message = `[${code}] DO NOTHING AT ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
            confirmationQueryParams.append('code', code)
            confirmationQueryParams.append('price', String(currentPrice.price))
            confirmationQueryParams.append('date', nowDateISOString) // will help with scenario where entry is the max peak so the peak is not ignored for exit threshold

            if (PriceAnalysis.TRADING_INTERVAL_SECONDS[tradingInterval] !== undefined 
                && 'flags' in currentPrice 
                && !currentPrice.flags.includes(tradingInterval)
            ) {
                return
            }

            if (entryPrice !== undefined && enterDecision) {
                // No need for equals to logic since probabiloty of exact match is very low
                message = `[${code}] SWAP IN AT ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                color = 'green'
                confirmationQueryParams.append('position', 'in')
                notificationBody = notificationBody.concat(`Action Link: ${confirmationLink}${confirmationQueryParams.toString()} \r\n`)
                sendNotification(code, notificationBody, currentPrice.price, 'in', anchorPrice, `${confirmationLink}${confirmationQueryParams.toString()}`)
                if (window.idaStockVision.positionIn[code]) {
                    message = `[${code}] YOU ARE IN ALREADY ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                    color = 'blue'
                }
            }
            if (exitPrice !== undefined && exitDecision) {
                message = `[${code}] SWAP OUT AT ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                color = 'orange'
                confirmationQueryParams.append('position', 'out')
                notificationBody = notificationBody.concat(`Action Link: ${confirmationLink}${confirmationQueryParams.toString()} \r\n`)
                sendNotification(code, notificationBody, currentPrice.price, 'out', anchorPrice, `${confirmationLink}${confirmationQueryParams.toString()}`)
                if (!window.idaStockVision.positionIn[code]) {
                    message = `[${code}] YOU ARE OUT ALREADY ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                    color = 'blue'
                }
            }
            console.log(`%c ${message}`,`color:white;background-color:${color};padding:50px`)
        } catch (error) {
            console.log('Ida Trader Bot - MUTATION OBSERVER CALLBACK ERROR', error)
        }
    }

    // @ts-ignore
    return mutationObserverCallback
}

let stockVisionTrade = function () {
    // should work for both questrade & IBKR
    // get key variables from localstorgae
    // keep screen awake
    // ping pong with [ls] to know what to do ~ 5seconds
    // buy/sell
    // check orderId is executed
    // confirm code with confirmation link
    // on orderId failure get new price only from [ls] and try to buy/sell again
    // save all important information to localStorage cause you can be logged out at anytime
    // send a notification when being sent to the logout page

    const questradeTradeProcess = () => {
        // access token is needed in the request header
        // use scope to find access token in sessionStorage. access token gets updated frequently
        // request headers can be flaky so make sure you are sending exactly what they are looking for
        // you will get a new orderId when you modify an existing order and the previoud orderId becomes a rootOrderId
        const securityIds = [ 
            {securityUuid: "70362c18-013e-4022-04fd-19826d640f2c", symbol: "SMCI.TO"},
            {securityUuid: "515c3938-2281-4122-0285-869320320824", symbol: "NVDA.TO"},
            {securityUuid: "15203112-167e-4502-01ec-9e4294810e0d", symbol: "TSLA.TO"},
            {securityUuid: "2a101833-8e5a-4a92-072a-00921187129b", symbol: "INTC.TO"},
        ]

        const submit = {
            requestType: 'post',
            url: 'https://api.questrade.com/v1/order-entry/stock/submit',
            payload: {
                "action": "Sell",
                "quantity": 128,
                "securityUuid": "515c3938-2281-4122-0285-869320320824",
                "orderType": "Limit",
                "duration": "Day",
                "accountUuid": "${accountId}",
                "limitPrice": 39.31,
                "quantityMode": "Quantity"
            },
            response: {
                "orderUuid": "07b22917-1b79-4be2-09ec-82055c391ede"
            },
            fetch: (accessToken,securityId,accountId,tradeType,quantity,price) => fetch("https://api.questrade.com/v1/order-entry/stock/submit", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${accessToken}`,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://myportal.questrade.com/",
                "body": `{\"action\":\"${tradeType}\",\"quantity\":${quantity},\"securityUuid\":\"${securityId}\",\"orderType\":\"Limit\",\"duration\":\"Day\",\"accountUuid\":\"${accountId}\",\"limitPrice\":${price},\"quantityMode\":\"Quantity\"}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
        }

        const modify = {
            fetch: (accessToken,orderId,accountId,quantity,price) => fetch(`https://api.questrade.com/v1/order-entry/stock/${orderId}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${accessToken}`,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://myportal.questrade.com/",
                "body": `{\"quantity\":${quantity},\"orderType\":\"Limit\",\"duration\":\"Day\",\"accountUuid\":\"${accountId}\",\"limitPrice\":${price},\"route\":\"AUTO\",\"subRoute\":\"AUTO\"}`,
                "method": "PUT",
                "mode": "cors",
                "credentials": "include"
            }),
            response: {
                "orderUuid": "2e3e275e-36cb-43f2-06f2-0f0626362f00"
            }
        }
        
        const balance = {
            requestType: 'get',
            url: 'https://api.questrade.com/v2/brokerage-accounts-balances/${accountId}/balances?timeOfDay=current',
            response: {
                "account": {
                    "key": "${accountId}",
                    "number": "0000000000",
                    "name": "Individual RRSP",
                    "createdOn": "2020-04-22",
                    "productType": "SD",
                    "accountDetailType": "RRSP"
                },
                "cash": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 762.62
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "marketValue": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 9215.6
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 6773.69
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 9215.6
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "totalEquity": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 10253.15
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 7536.31
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 10253.15
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "buyingPower": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 745.84
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "maxBuyingPower": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 745.84
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "totalBuyingPower": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 745.84
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "totalMaxBuyingPower": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 745.84
                        }
                    ],
                    "byCurrency": [
                        {
                            "currencyCode": "CAD",
                            "amount": 1037.55
                        },
                        {
                            "currencyCode": "USD",
                            "amount": 0
                        }
                    ]
                },
                "isLinked": false,
                "linkedAccount": null,
                "pnl": {
                    "timeWeightedReturn": null,
                    "open": {
                        "combined": [
                            {
                                "currencyCode": "CAD",
                                "amount": -235.44
                            },
                            {
                                "currencyCode": "USD",
                                "amount": -173.05
                            }
                        ],
                        "byCurrency": [
                            {
                                "currencyCode": "CAD",
                                "amount": -235.44
                            },
                            {
                                "currencyCode": "USD",
                                "amount": 0
                            }
                        ]
                    },
                    "closed": {
                        "combined": [
                            {
                                "currencyCode": "CAD",
                                "amount": 0
                            },
                            {
                                "currencyCode": "USD",
                                "amount": 0
                            }
                        ],
                        "byCurrency": [
                            {
                                "currencyCode": "CAD",
                                "amount": 0
                            },
                            {
                                "currencyCode": "USD",
                                "amount": 0
                            }
                        ]
                    },
                    "day": {
                        "combined": [
                            {
                                "currencyCode": "CAD",
                                "amount": 186.16
                            },
                            {
                                "currencyCode": "USD",
                                "amount": 136.83
                            }
                        ],
                        "byCurrency": [
                            {
                                "currencyCode": "CAD",
                                "amount": 186.16
                            },
                            {
                                "currencyCode": "USD",
                                "amount": 0
                            }
                        ]
                    },
                    "dayPercentage": 0.0185,
                    "total": {
                        "combined": [
                            {
                                "currencyCode": "CAD",
                                "amount": 351.6
                            }
                        ]
                    },
                    "totalPercentage": 0.0355
                },
                "netDeposits": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 9901.55
                        }
                    ]
                },
                "totalDeposits": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 9901.55
                        }
                    ]
                },
                "totalWithdrawals": {
                    "combined": [
                        {
                            "currencyCode": "CAD",
                            "amount": 0
                        }
                    ]
                },
                "asOfDateTime": "2025-07-23T16:35:49.115"
            },
            fetch: (accessToken,accountId) => fetch(`https://api.questrade.com/v2/brokerage-accounts-balances/${accountId}/balances?timeOfDay=current`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${accessToken}`,
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://myportal.questrade.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }),
        }

        const orders = {
            fetch: (accessToken, fromDateISO) => fetch(`https://api.questrade.com/v1/orders?from-date=${fromDateISO}&status-group=All&limit=20&sort-by=-createdDateTime`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${accessToken}`,
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://myportal.questrade.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }),
            response: {
                "data": [
                    {
                        "security": {
                            "securityUuid": "515c3938-2281-4122-0285-869320320824",
                            "symbol": "NVDA.TO",
                            "isQuotable": true,
                            "description": "NVIDIA CORP",
                            "currency": "CAD",
                            "type": "Stock",
                            "displayName": "NVDA.TO",
                            "option": null
                        },
                        "account": {
                            "accountUuid": "${accountId}",
                            "number": "00000000",
                            "name": "Individual RRSP",
                            "detailType": "RRSP"
                        },
                        "orderStatement": "Buy 100 NVDA.TO @ $40.25 Limit Day",
                        "cancelledQuantity": 0,
                        "openQuantity": 0,
                        "isDefaultRouted": true,
                        "isConditional": false,
                        "isModifiable": false,
                        "isCancellable": false,
                        "isDollarValueBased": false,
                        "hasSpecialInstructions": false,
                        "action": "Buy",
                        "goodTillDate": null,
                        "orderUuid": "35290e21-2837-4272-0e75-2133492e8707",
                        "createdDateTime": "2025-08-01T14:41:56.240Z",
                        "status": "Executed",
                        "clientSideAction": "Buy",
                        "totalQuantity": 100,
                        "dollarValue": null,
                        "limitPrice": 40.25,
                        "stopPrice": 0,
                        "duration": "Day",
                        "type": "Limit",
                        "bracket": null,
                        "bracketGroupUuid": null,
                        "crossZeroGroupUuid": null,
                        "venue": null,
                        "exchangeOrderId": "BT0250801000000281",
                        "parentOrderUuid": "35290e21-2837-4272-0e75-2133492e8707",
                        "strategyType": null,
                        "specialInstructions": {
                            "summary": null,
                            "isAnonymous": false,
                            "isAllOrNone": false,
                            "isPostOnly": false,
                            "minimumQuantity": 0,
                            "icebergQuantity": 0
                        },
                        "route": "AUTO",
                        "subRoute": "AUTO",
                        "note": null,
                        "totalFees": 0,
                        "updatedDateTime": "2025-08-01T14:42:36.426Z",
                        "filledQuantity": 100,
                        "averageFilledPrice": 40.25,
                        "stopPriceType": null,
                        "limitPriceType": "AbsoluteValue",
                        "rejectionReason": null,
                        "triggerPrice": 0,
                        "rootOrderUuid": "35290e21-2837-4272-0e75-2133492e8707",
                        "legs": null
                    },
                    {
                        "security": {
                            "securityUuid": "70362c18-013e-4022-04fd-19826d640f2c",
                            "symbol": "SMCI.TO",
                            "isQuotable": true,
                            "description": "SUPERMICRO CDR (CAD HEDGED)",
                            "currency": "CAD",
                            "type": "Stock",
                            "displayName": "SMCI.TO",
                            "option": null
                        },
                        "account": {
                            "accountUuid": "${accountId}",
                            "number": "00000000",
                            "name": "Individual RRSP",
                            "detailType": "RRSP"
                        },
                        "orderStatement": "Buy 262 SMCI.TO @ $19.10 Limit Day",
                        "cancelledQuantity": 0,
                        "openQuantity": 0,
                        "isDefaultRouted": true,
                        "isConditional": false,
                        "isModifiable": false,
                        "isCancellable": false,
                        "isDollarValueBased": false,
                        "hasSpecialInstructions": false,
                        "action": "Buy",
                        "goodTillDate": null,
                        "orderUuid": "3d550b25-4c11-45b2-08b4-0d390b388b06",
                        "createdDateTime": "2025-08-01T14:37:01.763Z",
                        "status": "Executed",
                        "clientSideAction": "Buy",
                        "totalQuantity": 262,
                        "dollarValue": null,
                        "limitPrice": 19.1,
                        "stopPrice": 0,
                        "duration": "Day",
                        "type": "Limit",
                        "bracket": null,
                        "bracketGroupUuid": null,
                        "crossZeroGroupUuid": null,
                        "venue": null,
                        "exchangeOrderId": "38LQ3ZEVEXVX",
                        "parentOrderUuid": "3d550b25-4c11-45b2-08b4-0d390b388b06",
                        "strategyType": null,
                        "specialInstructions": {
                            "summary": null,
                            "isAnonymous": false,
                            "isAllOrNone": false,
                            "isPostOnly": false,
                            "minimumQuantity": 0,
                            "icebergQuantity": 0
                        },
                        "route": "AUTO",
                        "subRoute": "AUTO",
                        "note": null,
                        "totalFees": 0,
                        "updatedDateTime": "2025-08-01T14:39:02.804Z",
                        "filledQuantity": 262,
                        "averageFilledPrice": 19.1,
                        "stopPriceType": null,
                        "limitPriceType": "AbsoluteValue",
                        "rejectionReason": null,
                        "triggerPrice": 0,
                        "rootOrderUuid": "3d550b25-4c11-45b2-08b4-0d390b388b06",
                        "legs": null
                    },
                    {
                        "security": {
                            "securityUuid": "515c3938-2281-4122-0285-869320320824",
                            "symbol": "NVDA.TO",
                            "isQuotable": true,
                            "description": "NVIDIA CORP",
                            "currency": "CAD",
                            "type": "Stock",
                            "displayName": "NVDA.TO",
                            "option": null
                        },
                        "account": {
                            "accountUuid": "${accountId}",
                            "number": "00000000",
                            "name": "Individual RRSP",
                            "detailType": "RRSP"
                        },
                        "orderStatement": "Sell 126 NVDA.TO @ $40.35 Limit Day",
                        "cancelledQuantity": 0,
                        "openQuantity": 0,
                        "isDefaultRouted": true,
                        "isConditional": false,
                        "isModifiable": false,
                        "isCancellable": false,
                        "isDollarValueBased": false,
                        "hasSpecialInstructions": false,
                        "action": "Sell",
                        "goodTillDate": null,
                        "orderUuid": "1f00298a-1059-4052-0052-10c962005500",
                        "createdDateTime": "2025-07-29T19:50:13.176Z",
                        "status": "Executed",
                        "clientSideAction": "Sell",
                        "totalQuantity": 126,
                        "dollarValue": null,
                        "limitPrice": 40.35,
                        "stopPrice": 0,
                        "duration": "Day",
                        "type": "Limit",
                        "bracket": null,
                        "bracketGroupUuid": null,
                        "crossZeroGroupUuid": null,
                        "venue": "TSX",
                        "exchangeOrderId": "ST0250729000000318",
                        "parentOrderUuid": "57320975-3ed9-4382-0382-1eac4d233800",
                        "strategyType": null,
                        "specialInstructions": {
                            "summary": null,
                            "isAnonymous": false,
                            "isAllOrNone": false,
                            "isPostOnly": false,
                            "minimumQuantity": 0,
                            "icebergQuantity": 0
                        },
                        "route": "AUTO",
                        "subRoute": "AUTO",
                        "note": null,
                        "totalFees": 0,
                        "updatedDateTime": "2025-07-29T19:54:10.147Z",
                        "filledQuantity": 126,
                        "averageFilledPrice": 40.35,
                        "stopPriceType": null,
                        "limitPriceType": "AbsoluteValue",
                        "rejectionReason": null,
                        "triggerPrice": 0,
                        "rootOrderUuid": "1b1e0790-3e4c-4122-0722-294628273200",
                        "legs": null
                    },
                    {
                        "security": {
                            "securityUuid": "515c3938-2281-4122-0285-869320320824",
                            "symbol": "NVDA.TO",
                            "isQuotable": true,
                            "description": "NVIDIA CORP",
                            "currency": "CAD",
                            "type": "Stock",
                            "displayName": "NVDA.TO",
                            "option": null
                        },
                        "account": {
                            "accountUuid": "${accountId}",
                            "number": "00000000",
                            "name": "Individual RRSP",
                            "detailType": "RRSP"
                        },
                        "orderStatement": "Sell 126 NVDA.TO @ $40.40 Limit Day",
                        "cancelledQuantity": 0,
                        "openQuantity": 126,
                        "isDefaultRouted": true,
                        "isConditional": false,
                        "isModifiable": false,
                        "isCancellable": false,
                        "isDollarValueBased": false,
                        "hasSpecialInstructions": false,
                        "action": "Sell",
                        "goodTillDate": null,
                        "orderUuid": "57320975-3ed9-4382-0382-1eac4d233800",
                        "createdDateTime": "2025-07-29T19:47:39.564Z",
                        "status": "Replaced",
                        "clientSideAction": "Sell",
                        "totalQuantity": 126,
                        "dollarValue": null,
                        "limitPrice": 40.4,
                        "stopPrice": 0,
                        "duration": "Day",
                        "type": "Limit",
                        "bracket": null,
                        "bracketGroupUuid": null,
                        "crossZeroGroupUuid": null,
                        "venue": null,
                        "exchangeOrderId": "ST0250729000000317",
                        "parentOrderUuid": "335f0896-24c3-4522-0225-411c37320207",
                        "strategyType": null,
                        "specialInstructions": {
                            "summary": null,
                            "isAnonymous": false,
                            "isAllOrNone": false,
                            "isPostOnly": false,
                            "minimumQuantity": 0,
                            "icebergQuantity": 0
                        },
                        "route": "AUTO",
                        "subRoute": "AUTO",
                        "note": null,
                        "totalFees": 0,
                        "updatedDateTime": "2025-07-29T19:50:13.271Z",
                        "filledQuantity": 0,
                        "averageFilledPrice": 0,
                        "stopPriceType": null,
                        "limitPriceType": "AbsoluteValue",
                        "rejectionReason": null,
                        "triggerPrice": 0,
                        "rootOrderUuid": "1b1e0790-3e4c-4122-0722-294628273200",
                        "legs": null
                    },
                ],
                "metadata": {
                    "previousLink": "",
                    "nextLink": "/v1/orders?from-date=2025-07-01T17:56:22.911Z&status-group=All&limit=20&sort-by=-createdDateTime&cursor=MzEyNzQ0MjE5",
                    "totalCount": 60,
                    "count": 20
                }
            }
        }

        const position = {
            requestType: 'get',
            url: 'https://api.questrade.com/v1/positions?underlying-security-uuid=515c3938-2281-4122-0285-869320320824&account-product-type=SD',
            response: {
                "data": [
                    {
                        "securityUuid": "515c3938-2281-4122-0285-869320320824",
                        "openQuantity": 128,
                        "closedQuantity": 0,
                        "averagePrice": 39.31,
                        "marketValue": 4966.4,
                        "percentageOfPortfolio": 0.4837,
                        "openPnl": -65.28,
                        "closedPnl": 0,
                        "percentageOfPnl": -0.0129,
                        "percentageOfPnlDay": 0.0109,
                        "bookValue": 5031.68,
                        "currency": "CAD",
                        "createdDateTime": "2025-07-15T13:40:26.591Z",
                        "entryPrice": 0,
                        "pnlDay": 53.75,
                        "account": {
                            "accountUuid": "${accountId}",
                            "number": "00000000",
                            "name": "Individual RRSP",
                            "productType": "SD",
                            "detailType": "RRSP"
                        },
                        "marketData": {
                            "lastPrice": 38.8,
                            "priceChangeAmount": 0.42,
                            "priceChangePercent": 0.0109,
                            "bidPrice": 38.79,
                            "bidSize": 95,
                            "askPrice": 38.81,
                            "askSize": 18,
                            "volume": 256524
                        },
                        "security": {
                            "symbol": "NVDA.TO",
                            "description": "NVIDIA CORP",
                            "listingMarket": "TSX",
                            "listingMarketUuid": "21051101-0341-4012-0191-008105210919",
                            "assetGroup": null,
                            "type": "Stock",
                            "isQuotable": true,
                            "isTradable": true,
                            "earningsDate": null
                        }
                    }
                ],
                "metadata": {
                    "previousLink": "",
                    "nextLink": "",
                    "totalCount": 1,
                    "count": 1
                }
            },
        }

        const searchStockCode = {
            fetch: () => fetch("https://api.questrade.com/v1/securities?pattern=nvda&have-options=false&limit=8", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": "Bearer aSeS7Dva9ZKG7E5qBy5Gr4Dal0txbQUgZ7XBOuSR2kuAS0404OmFrNqPa3BaEKk39G20DfBEMDbtyQuMk9O7EA",
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://myportal.questrade.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then((data) => {return data.json()}).then((data) => {console.log(data)})
        }

        const getMarketData = {
            fetch: () => fetch("https://api.questrade.com/v1/market-data/update?symbols=515c3938-2281-4122-0285-869320320824&symbols=1f2c511b-0b83-4f92-0dac-66503e9d0a9d&symbols=7502295d-2255-4592-0ada-a6911f5a1d9b&symbols=67063f4c-2e03-4772-014c-37523481047d&symbols=0d45156a-12a3-4d32-0454-c4943e440535&symbols=1921123f-154c-4962-0c4e-6697040c446f&symbols=0b022952-501c-4b12-0b03-0892834b1012&symbols=22187e06-039b-4272-0001-039849600070", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": "Bearer aSeS7Dva9ZKG7E5qBy5Gr4Dal0txbQUgZ7XBOuSR2kuAS0404OmFrNqPa3BaEKk39G20DfBEMDbtyQuMk9O7EA",   
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://myportal.questrade.com/",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then((data) => {return data.json()}).then((data) => {console.log(data)})
        }

        const scopeToFindAccessToken = "openid brokerage.accounts.all brokerage.account-onboarding.read brokerage.orders.all brokerage.balances.all brokerage.trading.all brokerage.research.all brokerage.market-research.all brokerage.watchlists.all brokerage.charts.read brokerage.securities.read brokerage.positions.read brokerage.portfolios.read brokerage.quotes.read brokerage.settings.all brokerage.investing-insights.all all.notifications.all all.usersettings.all enterprise.staggered-rollout.read brokerage.account-transactions.read enterprise.document-centre-tax-slip.read brokerage.brokerage-customer-tier.read brokerage.portfolios-questionnaire.read"

        return {submit,modify,balance,orders,scopeToFindAccessToken}

    }

    // const ibkrTradeProcess = () => {
    //     // No need for access token in request header
    //     const order = {
    //         requestType: 'post',
    //         url: 'https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/account/${accountID}/orders',
    //         payload: {
    //             "orders": [
    //                 {
    //                     "quantity": 3,
    //                     "orderType": "LMT",
    //                     "price": 38.55,
    //                     "tif": "DAY",
    //                     "outsideRTH": false,
    //                     "acctId": ${accountID},
    //                     "cOID": "31746922", //you generate this yourself
    //                     "conidex": "541229759",
    //                     "side": "BUY",
    //                     "allOrNone": false,
    //                     "originator": "Side-Order"
    //                 },
    //                 {
    //                     "quantity": 3,
    //                     "orderType": "LMT",
    //                     "price": 39.87,
    //                     "tif": "DAY",
    //                     "outsideRTH": false,
    //                     "acctId": "${accountID}",
    //                     "cOID": "57261337", //you generate this yourself
    //                     "conidex": "541229759",
    //                     "side": "SELL",
    //                     "allOrNone": false,
    //                     "originator": "Side-Order"
    //                 }
    //             ]
    //         },
    //         response: [
    //             {
    //                 "id": "5d3d50f0-f4ce-4bbf-9997-a49545ed9e62",
    //                 "message": [
    //                     "You are submitting an order without market data. We strongly recommend against this as it may result in erroneous and unexpected trades.\nAre you sure you want to submit this order?"
    //                 ],
    //                 "isSuppressed": false,
    //                 "messageIds": [
    //                     "o354"
    //                 ]
    //             }
    //         ],
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/account/${accountID}/orders", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "content-type": "application/json; charset=utf-8",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": "{\"orders\":[{\"quantity\":3,\"orderType\":\"LMT\",\"price\":39.87,\"tif\":\"DAY\",\"outsideRTH\":false,\"acctId\":\"${accountID}\",\"cOID\":\"57261338\",\"conidex\":\"541229759\",\"side\":\"SELL\",\"allOrNone\":false,\"originator\":\"Side-Order\"}]}",
    //             "method": "POST",
    //             "mode": "cors",
    //             "credentials": "include"
    //         }).then((data) => {return data.json()}).then((data) => {console.log(data)})
    //     }

    //     const marketDataConfirmation = {
    //         requestType: 'post',
    //         url: 'https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/reply/5d3d50f0-f4ce-4bbf-9997-a49545ed9e62',
    //         payload: {
    //             "confirmed": true
    //         },
    //         response: [
    //             {
    //                 "id": "becd9797-7852-4992-91cd-f023efd3da89",
    //                 "message": [
    //                     "<h4>Confirm Mandatory Cap Price</h4>To avoid trading at a price that is not consistent with a fair and orderly market, IB may set a cap (for a buy order) or floor (for a sell order). THIS MAY CAUSE AN ORDER THAT WOULD OTHERWISE BE MARKETABLE NOT TO BE TRADED."
    //                 ],
    //                 "isSuppressed": false,
    //                 "messageIds": [
    //                     "o10153"
    //                 ]
    //             }
    //         ],
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/reply/11d43d3c-6678-41a5-95fe-44959fa52a69", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "content-type": "application/json; charset=utf-8",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": "{\"confirmed\":true}",
    //             "method": "POST",
    //             "mode": "cors",
    //             "credentials": "include"
    //         }).then((data) => {return data.json()}).then((data) => {console.log(data)})
    //     }
        
    //     const priceCapConfirmation = {
    //         requestType: 'post',
    //         url: 'https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/reply/becd9797-7852-4992-91cd-f023efd3da89',
    //         payload: {
    //             "confirmed": true
    //         },
    //         response: [
    //             {
    //                 "order_id": "1568727945",
    //                 "local_order_id": "31746922",
    //                 "order_status": "Submitted",
    //                 "encrypt_message": "1"
    //             }
    //         ],
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/reply/3b6a26d9-6269-4bf9-b8b2-dcef97dcf332", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "content-type": "application/json; charset=utf-8",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": "{\"confirmed\":true}",
    //             "method": "POST",
    //             "mode": "cors",
    //             "credentials": "include"
    //         }).then((data) => {return data.json()}).then((data) => {console.log(data)})
    //     }

    //     const position = {
    //         requestType: 'get',
    //         url: 'https://portal.interactivebrokers.com/portal.proxy/v1/portal/portfolio2/${accountID}/positions',
    //         urlNoCache: 'https://portal.interactivebrokers.com/portal.proxy/v1/portal/portfolio/${accountID}/combo/positions?nocache=true',
    //         response: [
    //             {
    //                 "acctId": "${accountID}",
    //                 "model": "",
    //                 "position": 3,
    //                 "conid": 541229759,
    //                 "avgCost": 38.742767,
    //                 "avgPrice": 38.742767,
    //                 "currency": "CAD",
    //                 "description": "NVDA @TSE",
    //                 "isLastToLoq": null,
    //                 "marketPrice": 38.560001,
    //                 "marketValue": 115.680004,
    //                 "mktPrice": 38.560001,
    //                 "mktValue": 115.680004,
    //                 "realizedPnl": 0,
    //                 "secType": "STK",
    //                 "timestamp": null,
    //                 "unrealizedPnl": -0.548296,
    //                 "contractDesc": "NVDA @TSE",
    //                 "assetClass": "STK",
    //                 "sector": "Technology",
    //                 "group": "Semiconductors"
    //             }
    //         ],
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/portfolio2/${accountID}/positions", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": null,
    //             "method": "GET",
    //             "mode": "cors",
    //             "credentials": "include"
    //         })
    //     }
        
    //     const searchStockCode = {
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/secdef/search", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "content-type": "application/json; charset=utf-8",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": "{\"symbol\":\"NVDA\",\"pattern\":true,\"referrer\":\"\"}",
    //             "method": "POST",
    //             "mode": "cors",
    //             "credentials": "include"
    //         }).then((data) => {return data.json()}).then((data) => {console.log(data)})
    //     }

    //     const balance = {
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/account/${accountID}/summary", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": null,
    //             "method": "GET",
    //             "mode": "cors",
    //             "credentials": "include"
    //         }).then((data) => {return data.json()}).then((data) => {console.log(data)})
    //     }
        
    //     const deleteOrder = {
    //         fetch: fetch("https://portal.interactivebrokers.com/portal.proxy/v1/portal/iserver/account/${accountID}/order/1503457449", {
    //             "headers": {
    //                 "accept": "*/*",
    //                 "accept-language": "en-US,en;q=0.9",
    //                 "cache-control": "no-cache",
    //                 "pragma": "no-cache",
    //                 "priority": "u=1, i",
    //                 "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    //                 "sec-ch-ua-mobile": "?0",
    //                 "sec-ch-ua-platform": "\"Windows\"",
    //                 "sec-fetch-dest": "empty",
    //                 "sec-fetch-mode": "cors",
    //                 "sec-fetch-site": "same-origin"
    //             },
    //             "referrer": "https://portal.interactivebrokers.com/portal/?loginType=1&action=ACCT_MGMT_MAIN",
    //             "body": null,
    //             "method": "DELETE",
    //             "mode": "cors",
    //             "credentials": "include"
    //         }).then((data) => {return data.json()}).then((data) => {console.log(data)})
    //     }
    // }

    const constants = {
        localServer: {
            serverUrl: 'http://localhost:9000'
        },
        cloudServer: {
            serverUrl: 'https://styleminions.co/ninja'
        },
        serverApi: {
            notify: '/trader/notify'
        },
        notification: {
            subjectGeneral: '[BWA] NOTIFICATION',
        },
        pingPongInterval: 1000*5,
        orderInspectionDelay: 1000*60*1,
        modifyThreshold: (60/5) * 2, // keep within 1 minute for now
        questrade: {
            firstElement: () => document.querySelector('investing-shell-root').shadowRoot.querySelector('trading-root').shadowRoot.querySelector('app-bottom-tabs-section > div > app-tabs > div > qt-trad-carousel > section > ul > li:nth-child(1) > div > span'),
            secondElement: () => document.querySelector('investing-shell-root').shadowRoot.querySelector('trading-root').shadowRoot.querySelector('app-bottom-tabs-section > div > app-tabs > div > qt-trad-carousel > section > ul > li:nth-child(2) > div > span'),
            trade: {
                buy: 'Buy',
                sell: 'Sell',
                orderId: 'orderUuid',
                orderStatus: {
                    executed: 'Executed',
                    accepted: 'Accepted',
                    pending: 'Pending',
                    partial: 'Partial',
                    queued: 'Queued',
                    activated: 'Activated',
                    rejected: 'Rejected',
                    replaced: 'Replaced',
                    expired: 'Expired',
                }
            },
            tradeProcess: questradeTradeProcess(),
        },
        ibkr: {}
    }

    const getBrokerageVariables = () => {
        // domain/brokername, accountId, keepAwakeXpaths,
        const host = location.host.includes('questrade') ? 'questrade' : 'ibkr'
        const storage = localStorage.getItem('stockvisionTrade') !== null ? JSON.parse(localStorage.getItem('stockvisionTrade')) : undefined
        storage.brokerage = {
            name: host,
        }

        return storage
    }

    /**
     * 
     * @param {{[key: string]: {securityId: string; capital: number}}[]} securities 
     * @param {string} accountId 
     */
    const defaultBrokerageVariables = (securities, accountId) => {
        // securityIds, capital, accountId
        const storage = localStorage.getItem('stockvisionTrade') !== null ? JSON.parse(localStorage.getItem('stockvisionTrade')) : {}
        if (accountId) {
            storage.accountId = accountId
        }
        if (securities) {
            const allSecurityInfoNotDefine = Object.values(securities).some((security) => !security.securityId || !security.capital)
            if (allSecurityInfoNotDefine) {
                throw new Error('define all security information')
            }
            const entries =  Object.entries(securities).map(i => {
                i[0] = i[0].toUpperCase()
                return i
            })
            storage.securities = Object.fromEntries(entries)
        }

        storeBrokerageVariables(storage)
    }

    const storeBrokerageVariables = (objectToStore) => {
        localStorage.setItem('stockvisionTrade', JSON.stringify(objectToStore))
    }

    const backUp = () => {
        // securities, orders and orderHistory for now
        const idaStockVisionTrade = window.idaStockVisionTrade
        const storage = getBrokerageVariables()
        storage.orders = idaStockVisionTrade.orders
        storage.orderHistory = idaStockVisionTrade.orderHistory
        storage.securities = idaStockVisionTrade.securities

        storeBrokerageVariables(storage)

    }

    /**
     * 
     * @param {string} brokerage 
     * @returns {string | undefined}
     */
    const getAccessToken = (brokerage) => {
        let accessToken = undefined
        switch(brokerage) {
            case 'questrade':
                const tokenObject = Object.values(sessionStorage).find((item) => item.includes(constants.questrade.tradeProcess.scopeToFindAccessToken))
                if (tokenObject) {
                    accessToken = JSON.parse(tokenObject).access_token
                }
                break;
            default:
        }

        return accessToken
    }

    /**
     * 
     * @param {HTMLElement | number} firstElement 
     * @param {HTMLElement | number} secondElement 
     * @param {boolean} stop 
     * @returns {number[]}
     */
    const keepAwake = (firstElement, secondElement, stop = false) => {
        // switch between 2 elements to keep browser tab active
        if (!stop && ![firstElement, secondElement].every((element) => element instanceof HTMLElement)) {
            throw new Error('Need all elements to keep tab awake')
        }

        if (stop) {
            [firstElement, secondElement].forEach((item) => {
                if (typeof item === 'number') {
                    window.clearInterval(item)
                }
            })
            return
        }

        const secondIntervalInstance = window.setInterval(()=>{/**@type {HTMLElement}*/ (secondElement).click();/**console.log('second element')*/}, 1000*4);
        const firstIntervalInstance = window.setInterval(()=>{/**@type {HTMLElement}*/ (firstElement).click();/**console.log('first element')*/}, 1000*5);

        return [firstIntervalInstance, secondIntervalInstance]
    }

    const pollLocalServer = () => {
        try {
            const idaStockVisionTrade = window.idaStockVisionTrade
            const brokerageName = idaStockVisionTrade.brokerage.name
            idaStockVisionTrade.keepAwakeInstances = keepAwake(constants[brokerageName].firstElement(), constants[brokerageName].secondElement())
            const intervalCallback = async () => {
                try {
                    if (idaStockVisionTrade.pollServerInProgress) {
                        return
                    }
                    idaStockVisionTrade.pollServerInProgress = true
                    const payload = new URLSearchParams()
                    payload.set('brokerageName', brokerageName)
                    const resp = await fetch(`${constants.localServer.serverUrl}/trader/tradeCheck?${payload.toString()}`, {
                        method: 'GET',
                        mode: 'cors',
                    })
                    /** @type {TradeCheckResponse} */
                    const formattedResp = await resp.json()
                    if (Array.isArray(formattedResp) && formattedResp.length > 0) {
                        window.idaStockVisionTrade.orders.push(...formattedResp)
                        idaStockVisionTrade.pollServerInProgress = false
                        backUp()
                        // backup order data in localstorage
                        // start/queue trade operation
                        processOrderQueue()
                        return
                    }
                    if (!idaStockVisionTrade.processOrderQueueInProgress && !idaStockVisionTrade.investigateOrderQueueInProgress) {
                        investigateOrderQueue()
                    }
                    
                } catch (error) {
                    const errorMessage = ['Ida Trader Bot - POLL LOCAL SERVER', error.toString()]
                    console.log(...errorMessage)
                    if (idaStockVisionTrade.pollServerErrorCount === 0) {
                        notify(errorMessage.join('-'))
                        idaStockVisionTrade.pollServerErrorCount++
                    }
                } finally {
                    idaStockVisionTrade.pollServerInProgress = false
                }
            }
            idaStockVisionTrade.pollServerInstance = window.setInterval(intervalCallback, constants.pingPongInterval)
            
        } catch (error) {
            console.log('Ida Trader Bot - POLL LOCAL SERVER', error)
        }
    }

    const stopPollLocalServer = () => {
        const idaStockVisionTrade = window.idaStockVisionTrade
        const [first, second] = idaStockVisionTrade.keepAwakeInstances
        clearInterval(window.idaStockVisionTrade.pollServerInstance)
        keepAwake(first, second, true)
    }

    /**
     * 
     * @param {string|number} price 
     * @param {number} capitalAmount 
     * @returns {number}
     */
    const sharesAmount = (price, capitalAmount) => {
        return Math.ceil(capitalAmount / Number(price))
    }
    
    /**
     * 
     * @param {string} primaryCode 
     * @returns {Promise<Response>} 
     */
    const priceCheck = (primaryCode) => {
        const payload = new URLSearchParams()
        payload.set('primaryCode', primaryCode)
        return fetch(`${constants.localServer.serverUrl}/trader/priceCheck?${payload.toString()}`, {
            method: 'GET',
            mode: 'cors',
        })
    }

    /**
     * 
     * @param {number|string} num 
     * @param {number} decimalPlaces 
     * @returns {number|string}
     */
    const decimalPrecision = (num, decimalPlaces = 2) => {
        // this only work for normal currency numbers. really small numbers very close to 0 become zero or exponential eg 0.005 || 0.00000005
        if (!['string', 'number'].includes(typeof num) || Number.isNaN(num)) {
            return num
        }
        const numberString = num.toString()
        const [first, second] = numberString.split('.')

        if (second === undefined) {
            return num
        }
        
        return Number(`${first}.${second.substring(0, decimalPlaces)}`)
    }

    /**
     * 
     * @param {string} last 
     * @param {string} bid 
     * @param {string} ask 
     * @returns {string|number}
     */
    const priceDecision = (last, bid, ask) => {
        // seems like askPrice and Bid price from cboe might not always be available. plan for edge case
        const missingBidOrAskPrice = [ask, bid].some((price) => price === undefined)
        const lastPrice = Number(last)
        const bidPrice = Number(bid)
        const askPrice = Number(ask)
        const lastPriceInMiddle = lastPrice >= bidPrice && lastPrice <= askPrice
        const midAskBidPrice = decimalPrecision((bidPrice + askPrice)/2)
        if (!missingBidOrAskPrice && !lastPriceInMiddle) {
            return midAskBidPrice
        }

        return decimalPrecision(last) // decimal places from cboe is more than 2
    }

    /**
     * 
     * @param {string} code 
     * @returns {number | undefined}
     */
    const getLatestOrderedQuantity = (code) => {
        const stockVisionTrade = window.idaStockVisionTrade
        if (code in stockVisionTrade.orderHistory) {
            return stockVisionTrade.orderHistory[code].quantity
        }

        return
    }

    /**
     * 
     * @param {string} message 
     * @param {string} subject 
     * @param {string} brokerageName 
     */
    const notify = async (message, subject = constants.notification.subjectGeneral, brokerageName = window.idaStockVisionTrade.brokerage.name) => {
        try {
            let brokerageSubject = `${subject} (${brokerageName})`
            const queryParams = new URLSearchParams()
            queryParams.set('subject', brokerageSubject)
            queryParams.set('message', message)
            fetch(`${constants.cloudServer.serverUrl}${constants.serverApi.notify}?${queryParams.toString()}`, {
                method: 'POST',
            })
        } catch (error) {
            
        }
    }

    const processOrderQueue = async () => {
        //always store orders in localstorage as backup in case of forced logout
        const stockVisionTrade = window.idaStockVisionTrade
        if (stockVisionTrade.processOrderQueueInProgress) {
            stockVisionTrade.newOrdersReceived = true
            return
        }
        stockVisionTrade.processOrderQueueInProgress = true
        const orders = stockVisionTrade.orders.filter((order) => (order.accepted === undefined || order.accepted === false))
        const brokerageName = stockVisionTrade.brokerage.name
        if (orders.length === 0) {
            stockVisionTrade.processOrderQueueInProgress = false
            return 
        }

        // sequential promise fulfliment as forEach doe not respect asyc/await
        for(const order of orders) {
            try {
                const action = order.position === true ? constants[brokerageName].trade.buy : constants[brokerageName].trade.sell
                const price = priceDecision(order.last, order.bid_price, order.ask_price)
                const quantity = order.position === true 
                    ? sharesAmount(price, stockVisionTrade.securities[order.primaryCode].capital) 
                    : getLatestOrderedQuantity(order.code)
                const securityId = stockVisionTrade.securities[order.primaryCode].securityId
                if (quantity === undefined) {
                    throw new Error(`no quantity to process order - ${order.code}`)
                }
                if (securityId === undefined) {
                    throw new Error(`no security Id to process order - ${order.code}`)
                }
                const accountId = stockVisionTrade.accountId
                const accessToken = getAccessToken(brokerageName)
                const now = new Date().toISOString()
                const res = await constants[brokerageName].tradeProcess.submit.fetch(accessToken,securityId,accountId,action,quantity,price)
                /** @type {QuestradeSubmitResponse} */
                const resFormatted = await res.json()
                if (constants[brokerageName].trade.orderId in resFormatted) {
                    // setup order object with FE default properties it needs later
                    order.accepted = true // assume it's been accepted with the return of an orderId
                    order.timeSubmitted = now
                    order.orderId = resFormatted[constants[brokerageName].trade.orderId]
                    order.quantity = quantity
                    order.priceSubmitted = price
                    order.checkCount = 0
                    order.executed = false
                    order.modify = false
                    order.partialExecution = false
                    stockVisionTrade.orderHistory[order.code] = {
                        quantity,
                        orderId: order.orderId
                    }
                    // backup order data in localstorage
                    backUp()
                } else {
                    throw new Error(`no orderId returned - ${order.code} - ${JSON.stringify(resFormatted)}`)
                }

            } catch (error) {
                const errorMessage = ['Ida Trader Bot - PROCESS ORDER QUEUE', error.toString()]
                console.log(...errorMessage)
                notify(errorMessage.join('-'))
                order.accepted = true
                order.executed = true
                // backup order data in localstorage
                backUp()
                // notify for manual intervention
            }
        }

        stockVisionTrade.processOrderQueueInProgress = false

        if (stockVisionTrade.newOrdersReceived) {
            stockVisionTrade.newOrdersReceived = false
            processOrderQueue()
            return
        }
        investigateOrderQueue(true)
        
    }

    /**
     * 
     * @param {boolean} defer 
     * @returns 
     */
    const investigateOrderQueue = async (defer = false) => {
        const stockVisionTrade = window.idaStockVisionTrade
        if (stockVisionTrade.investigateOrderQueueInProgress) {
            return
        }

        if (defer) {
            window.setTimeout(investigateOrderQueue, constants.orderInspectionDelay)
            return
        }

        stockVisionTrade.investigateOrderQueueInProgress = true
        const orders = stockVisionTrade.orders
            .filter((order) => (order.accepted === true && order.executed === false && order.modify === false))
        if (orders.length === 0) {
            stockVisionTrade.investigateOrderQueueInProgress = false
            return
        }

        
        try {
            let orderToModifyExist = false
            const fromDateISO = orders.at(0).timeSubmitted
            const brokerageName = stockVisionTrade.brokerage.name
            const orderStatuses = constants[brokerageName].trade.orderStatus
            const accessToken = getAccessToken(brokerageName)
            const res = await constants[brokerageName].tradeProcess.orders.fetch(accessToken,fromDateISO)
            /** @type {QuestradeOrdersResponse} */
            const formattedRes = await res.json()
            /** @type {{[key: string]: QuestradeOrder}} */
            const brokerageOrdersObject = formattedRes.data.reduce((previous, current) => {
                previous[current[constants[brokerageName].trade.orderId]] = current
                return previous
            }, {})
            orders.forEach((order) => {
                try {
                    const orderId = order.orderId
                    if (!(orderId in brokerageOrdersObject)) {
                        throw new Error(`Cannot find orderId - ${orderId}`)
                    }
                    const orderFromBrokerage = brokerageOrdersObject[orderId]
                    switch(orderFromBrokerage.status) {
                        case orderStatuses.executed:
                            order.executed = true
                            confirmOrderWithLink(order.confirmationLink, order.quantity)
                            break
                        case orderStatuses.partial:
                            order.partialExecution = true
                            order.openQuantity = orderFromBrokerage.openQuantity
                            order.filledQuantity = orderFromBrokerage.filledQuantity
                            break
                            // to-do handle edge case of partial execution and never completely executes (price run off buy/sell edge case)
                            // remove break, so that checkCount can be iterated and modify can be triggered
                            // in modify function use openQunatity and quantity to modify buy/sell orders with partialExecution flag
                        case orderStatuses.accepted:
                        case orderStatuses.pending:
                        case orderStatuses.queued:
                        case orderStatuses.activated:
                            if (order.checkCount >= constants.modifyThreshold) {
                                order.modify = true
                                orderToModifyExist = true
                            }
                            order.checkCount++
                            break
                        default:
                            throw new Error(`order status is bad - ${orderId} - - ${JSON.stringify(formattedRes)}`)
                        
                    }
                } catch (error) {
                    console.log('Ida Trader Bot', error)
                }
            })
            // backup order data in localstorage
            backUp()
            
            stockVisionTrade.investigateOrderQueueInProgress = false
            if (orderToModifyExist) {
                modifyOrders()
            }
            // you can trigger modifying orders around here
            // polling will trigger this function
        } catch (error) {
            const errorMessage = ['Ida Trader Bot - INVESTIGATE ORDER QUEUE', error.toString()]
            console.log(...errorMessage)
            notify(errorMessage.join('-'))
            stockVisionTrade.investigateOrderQueueInProgress = false
        }
    }

    /**
     * 
     * @param {string} link 
     * @param {number | undefined} sharesQuantity 
     */
    const confirmOrderWithLink = (link, sharesQuantity) => {
        try {
            const url = new URL(link)
            if(sharesQuantity !== undefined) {
                url.searchParams.set('quantity', sharesQuantity.toString())
            }
            fetch(`${url.toString()}`, {
                method: 'GET',
                mode: 'cors',
            })
        } catch (error) {
            const errorMessage = ['Ida Trader Bot - CONFIRM ORDER WITH LINK', error.toString()]
            console.log(...errorMessage)
            notify(errorMessage.join('-'))
        }
    }

    const modifyOrders = async () => {
        // get list of orders to modify
        // price check each
        // send modify request
        // update orderId
        // reset order details to be picked up for later investigation
        // investigate
        const stockVisionTrade = window.idaStockVisionTrade
        if (stockVisionTrade.modifyOrderQueueInProgress) {
            return
        }
        stockVisionTrade.modifyOrderQueueInProgress = true
        const orders = stockVisionTrade.orders
            .filter((order) => (order.accepted === true && order.executed === false && order.modify === true))
        const brokerageName = stockVisionTrade.brokerage.name
        if (orders.length === 0) {
            stockVisionTrade.modifyOrderQueueInProgress = false
            return
        }

        for(const order of orders) {
            try {
                const newPricesResponse = await priceCheck(order.primaryCode)
                /** @type {CboeQuoteResponse} */
                const newPriceJson = await newPricesResponse.json()
                const newPrice = priceDecision(newPriceJson.last, newPriceJson.bid_price, newPriceJson.ask_price)
                const quantity = order.position === true 
                    ? sharesAmount(newPrice, stockVisionTrade.securities[order.primaryCode].capital) 
                    : getLatestOrderedQuantity(order.code)
                if (quantity === undefined) {
                    order.accepted = true
                    order.executed = true
                    throw new Error(`MODIFY ORDERS - no quantity to process - ${order.code}`)
                }
                if (newPrice === order.priceSubmitted) {
                    order.checkCount = 0
                    order.modify = false
                    return
                }
                const accessToken = getAccessToken(brokerageName)
                const now = new Date().toISOString()
                const res = await constants[brokerageName].tradeProcess.modify.fetch(accessToken, order.orderId, stockVisionTrade.accountId, quantity, newPrice)
                /** @type {QuestradeSubmitResponse} */
                const formattedRes = await res.json()
                if (constants[brokerageName].trade.orderId in formattedRes) {
                    // reset order details for next investigation
                    order.accepted = true
                    order.timeSubmitted = now
                    order.rootOrderId = order.orderId
                    order.orderId = formattedRes[constants[brokerageName].trade.orderId]
                    order.quantity = quantity
                    order.checkCount = 0
                    order.executed = false
                    order.modify = false
                    stockVisionTrade.orderHistory[order.code] = {
                        quantity,
                        orderId: order.orderId
                    }
                    // backup order data in localstorage
                    backUp()
                } else {
                    // most likely has executed already so let it go through another investigation cycle
                    order.checkCount = 0
                    order.modify = false
                    throw new Error(`MODIFY ORDERS - no orderId returned - ${order.code} - ${JSON.stringify(formattedRes)}`)
                }

            } catch (error) {
                const errorMessage = ['Ida Trader Bot - MODIFY ORDER QUEUE', error.toString()]
                console.log(...errorMessage)
                notify(errorMessage.join('-'))
            }
        }

        stockVisionTrade.modifyOrderQueueInProgress = false
    }

    const setUp = () => {
        try {
            const brokerageVariables = getBrokerageVariables()
            window.idaStockVisionTrade = {
                pollServerInProgress: false,
                processOrderQueueInProgress: false,
                investigateOrderQueueInProgress: false,
                modifyOrderQueueInProgress: false,
                newOrdersReceived: false,
                pollServerInstance: undefined,
                pollServerErrorCount: 0,
                keepAwakeInstances: [],
                orders: [],
                orderHistory: {},
                tools: {
                    start: pollLocalServer,
                    stop: stopPollLocalServer,
                    define: defaultBrokerageVariables,
                    process: processOrderQueue,
                    investigate: investigateOrderQueue,
                    modify: modifyOrders,
                    api: constants.questrade.tradeProcess,
                    priceDecision,
                    decimalPrecision,
                    sharesAmount,
                    getAccessToken,
                    notify,
                    keepAwake,
                    backUp,
                },
                ...brokerageVariables,
            }
            window.addEventListener('beforeunload', () => {
                const message = `Browser tab has been closed. Please investigate`
                notify(message, undefined, brokerageVariables.brokerage.name)
            })
        } catch (error) {
            console.log(`Ida Trader Bot - SETUP - ${error.toString()}`)
        }

    }

    setUp()

}