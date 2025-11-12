//@ts-check
/**
 * @typedef { import("globals") }
 * @typedef { import("token").IPriceHistory } PriceHistory
 * @typedef { import("token").IPrice } Price
 * @typedef { import("token").ICurrentPrice } CurrentPrice
 * @typedef { import("token").IPosition } Position
 * @typedef { import("token").INTERVAL_FLAGS } IntervalFlags
 * @typedef { import("token").TRADING_FLAGS } TradingFlags
 * @typedef { import("token").PROFIT_PURSUIT } ProfitPursuit
 * @typedef { import("token").ITradingIntervalInspection } TradingIntervalInspection
 * @typedef { import("token").IPrecisionIntervalInspection } PrecisionIntervalInspection
 * @typedef { import("token").PriceAnalysis } IPriceAnalysis
 * @typedef { import("token").IStockVision } StockVision
 * 
 * @typedef { import("token").ITradeCheckResponse } TradeCheckResponse
 * @typedef { import("token").ITradeOrder } TradeOrder
 * @typedef { import("token").ICboeQuoteResponse } CboeQuoteResponse
 * @typedef { import("token").IQuestradeSubmitResponse |  import("token").IQuestradeSubmitErrorResponse} QuestradeSubmitResponse
 * @typedef { import("token").IQuestradeOrdersResponse } QuestradeOrdersResponse
 * @typedef { import("token").IQuestradeOrder } QuestradeOrder
 * @typedef { import("token").IStockVisionTrade } SVisionTrade
 */

// @ts-ignore
class ProjectStockVision {
    constructor() {}
    
    static vision = class Vision {
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
        #code
        #projectParameters
        #manualEntryPrice
        #manualExitPrice
        #isCrypto
        #entryPercentage
        #exitPercentage
        #tradingInterval
        #precisionInterval

        /**
         * vision
         * @param {string} codeInput 
         * @param {number | undefined} manualEntryPrice 
         * @param {number | undefined} manualExitPrice 
         * @param {boolean} isCrypto 
         * @param {number} entryPercentage 
         * @param {number} exitPercentage 
         * @param {IntervalFlags} [tradingInterval]
         * @param {IntervalFlags} [precisionInterval]
         */
        constructor(codeInput, manualEntryPrice, manualExitPrice, isCrypto = false, entryPercentage, exitPercentage, tradingInterval = '1hour', precisionInterval = '5min') {
            this.#code = Vision.PriceAnalysis.codeFormat(codeInput)
            this.#projectParameters = arguments
            this.#manualEntryPrice = manualEntryPrice
            this.#manualExitPrice = manualExitPrice
            this.#isCrypto = isCrypto
            this.#entryPercentage = entryPercentage
            this.#exitPercentage = exitPercentage
            this.#tradingInterval = tradingInterval
            this.#precisionInterval = precisionInterval

            this.traderSetUp()
        }

        static PriceAnalysis = class PriceAnalysis {
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
                fourHour: '4hour',
                oneDay: '1day',
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
                [PriceAnalysis.TRADING_INTERVAL.fourHour]: 60 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS * 4,
                [PriceAnalysis.TRADING_INTERVAL.oneDay]: 60 * PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS * 10,
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

            /** @type {{[key: string]: ProfitPursuit}} PROFIT_PURSUIT */
            static PROFIT_PURSUIT = {
                TINY: 'tiny',
                SMALL: 'small',
                LARGE: 'large',
            }

            /** @type {{[key: string]: number}} ENTRY_MULTIPLIER */
            static ENTRY_MULTIPLIER = {
                [PriceAnalysis.PROFIT_PURSUIT.TINY]: 1,
                [PriceAnalysis.PROFIT_PURSUIT.SMALL]: 3,
                [PriceAnalysis.PROFIT_PURSUIT.LARGE]: 3
                
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
                    this._currentPrice = currentPrice
                    this._currentPosition = currentPosition
                    this._priceTradingInterval = priceTradingInterval

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
                    // To-do refactor to a reduce that also removes duplicates within the peak/valley using type and epoch date in the map
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

                    return item.flags.includes(this._priceTradingInterval) || (flagsEmpty && item.epochDate < this.todaysDateMidnight)
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
            }

            get peakValleyBeforeToday() {
                return this.peakValleyProgressionOrder.filter((item) => item.epochDate < this.todaysDateMidnight)
            }

            get peakValleyToday() {
                return this.peakValleyProgressionOrder.filter((item) => item.epochDate > this.todaysDateMidnight)
            }

            get todaysPeakValleySnapshot() {
                // since peak and valley alternate in pattern they will always be side by side in progression order
                const openPeakValley = this.peakValleyToday.slice(0, 2)
                const closePeakValley = this.peakValleyToday.slice(-2, undefined)
                const lastTenInBetweenPeakValleys = this.peakValleyToday.slice(-2*6, -2) // results in 10 data points (-12 + 2)
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

                return Array.from(this.highestPeakAndLowestValleyToday)
                    .concat(openPeakValley,lowestValleyAfterHighestPeakToday,closePeakValley,lastTenInBetweenPeakValleys)
            }

            /** @returns {boolean} */
            get onlyPrecisionFlagOnCurrentPrice() {
                return this._currentPrice.flags.includes(PriceAnalysis.TRADING_FLAGS.PRECISION) 
                    && !this._currentPrice.flags.includes(PriceAnalysis.TRADING_FLAGS.REGULAR)
            }

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
                /* commented out this block as it is indeed causing us to get out just as we entered and not worth the loss saving we get while loosing out on a real profit upward path
                if (this.onlyPrecisionFlagOnCurrentPrice) {
                    isCurrentPriceLessThanStuckFromExitThresholdPrice =
                        numberIsWithinOneDirectionalRange(stuckFromExitThresholdPrice, this._currentPrice.price, 0.06, false)
                } */

                // Goal is to have the right amount of loss threshold to give us enough room for having more long term wins than losses
                const positionIsStuck = isCurrentPriceLessThanStuckFromExitThresholdPrice
                
                return positionIsStuck

            }

            targetedProfitAcquired(code) {
                const profitThreshold = window.idaStockVision.settings[code].profitThreshold
                if (typeof profitThreshold !== 'number' 
                    || this._currentPosition === undefined 
                    || this._currentPosition.position !== PriceAnalysis.IN
                    || !this.dateExistsForCurrrentPosition
                ) {
                    return false
                }

                return Vision.percentageDelta(this._currentPosition.price, this._currentPrice.price, true) >= profitThreshold
            }

            targetedLossAcquired(code) {
                const lossThreshold = window.idaStockVision.settings[code].lossThreshold
                if (typeof lossThreshold !== 'number' 
                    || this._currentPosition === undefined 
                    || this._currentPosition.position !== PriceAnalysis.IN
                    || !this.dateExistsForCurrrentPosition
                ) {
                    return false
                }

                return Vision.percentageDelta(this._currentPosition.price, this._currentPrice.price, true) <= -1 * lossThreshold
            }

            /**
             * 
             * @param {string} code 
             * @param {number} mutationEpochDate 
             * @param {boolean} ignorePosition 
             * @returns {boolean}
             */
            exitByTradingEndTime(code, mutationEpochDate, ignorePosition = false) {
                /* only precision interval should be used here as thats what happens last & some trading interval
                 might only have 1 in a trading day */
                const precisionIntervalExist = window.idaStockVision.priceStore.precisionTimeIntervalsToday[code] instanceof Map
                const profitLossThresholdsDefined = this.profitLossThresholdsExist(code)
                const isTinyProfitPursuit = PriceAnalysis.profitPursuitType(code) === PriceAnalysis.PROFIT_PURSUIT.TINY
                let lastHourMinute

                if (!isTinyProfitPursuit
                    ||[precisionIntervalExist, profitLossThresholdsDefined].some(item => item === false)
                    || mutationEpochDate === undefined 
                    || this._currentPosition === undefined 
                    || !ignorePosition && this._currentPosition.position !== PriceAnalysis.IN
                ) {
                    return false
                }

                switch(true) {
                    case profitLossThresholdsDefined && precisionIntervalExist:
                        lastHourMinute = Array.from(window.idaStockVision.priceStore.precisionTimeIntervalsToday[code].values()).at(-1)
                        if (lastHourMinute.epochDate <= mutationEpochDate) {
                            return true
                        }
                        return false
                    default:
                        return false
                }
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
                // Note: current position date & price are needed for this function to work
                if (this._currentPosition === undefined || this._currentPosition.position !== PriceAnalysis.IN || !this.dateExistsForCurrrentPosition) {
                    return
                }

                /* concat current position to the peaks since we will have entry after an anchor
                with precision interval and need to calculate exit/stuck state from that point as well  */
                const peaks = this.peakOnlyProgressionOrder
                    .filter((item) => (this.dateIsGreaterThanOrEqual(item.epochDate, this._currentPosition.epochDate) && item.epochDate < this._currentPrice.epochDate))
                    .concat({type: PriceAnalysis.PEAK, flags: [this._priceTradingInterval], ...this._currentPosition})
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
                    return (item.epochDate > this.closestHighestPeak.epochDate) && this.dateIsGreaterThanOrEqual(item.epochDate, currentPositionDate)
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
                /* Make sure that you append stock market closing hour and ISO format [T00:00:00]
                for non ISO format dates so parse method uses local timezone automatically */
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

                /** @type {Map<number,number>} */
                let tracker = new Map()
                // console.log(daysToProcess)
                daysToProcess.forEach((day, index) => {
                    /** @type {Map<number,number>} */
                    let basket = new Map()
                    // Ignore today peaks to take advantage of steap slope increase in price
                    peakList.filter((item) => item.epochDate > day && item.epochDate < this.todaysDateMidnight)
                        .forEach((item) => basket.set(item.price, item.epochDate))
                    if (basket.size > 0) {
                        const prices = Array.from(basket.keys())
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
                    const trackerDates = Array.from(tracker.keys())
                    const trackerPoints = Array.from(tracker.values())
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
             * @param {number} leftEpochDate 
             * @param {number} rightEpochDate 
             * @param {boolean} forceEqualMinute 
             * @returns {boolean}
             */
            dateIsGreaterThanOrEqual(leftEpochDate, rightEpochDate, forceEqualMinute = true, reverse = false) {
                // force equal minute only in situations where needed logic wise
                if (!([leftEpochDate, rightEpochDate].every(i => typeof i === 'number'))) {
                    throw new Error('need all dates as epoch date number')
                }

                const defaultLogic = leftEpochDate >= rightEpochDate
                const reverserDefaultLogic = leftEpochDate <= rightEpochDate

                if (forceEqualMinute) {
                    const leftDateAtExactMinute = new Date(leftEpochDate).setSeconds(0,0)
                    const rightDateAtExactMinute = new Date(rightEpochDate).setSeconds(0,0)

                    if (reverse) {
                        return reverserDefaultLogic || leftDateAtExactMinute === rightDateAtExactMinute
                    }
                    return defaultLogic || leftDateAtExactMinute === rightDateAtExactMinute
                }

                if (reverse) {
                    return reverserDefaultLogic
                }

                return defaultLogic 
            }

            /**
             * 
             * @param {PriceHistory[]} onlyPeaks 
             * @returns {boolean | undefined}
             */
            downwardVolatility(onlyPeaks = this.peakOnlyProgressionOrder) {
                // make sure it is deep cloned so we do not overwrite a peak type to valley type carelessly
                // reverse the array to easily loop from the top
                // the second result of a peak should break out of the loop and return outcome of slope calculation
                /** @type {PriceHistory[]}*/
                let onlyPeaksCloned = JSON.parse(JSON.stringify(onlyPeaks))
                onlyPeaksCloned.reverse()
                const removeDuplicates = new Map()
                onlyPeaksCloned.forEach((peak) => removeDuplicates.set(peak.epochDate, peak))
                onlyPeaksCloned = Array.from(removeDuplicates.values())
                // console.log(onlyPeaksCloned)
                const mostRecentPeak = onlyPeaksCloned.at(0)
                const aggregateValley = []
                const aggregatePeak = []
                let brokeOutOfLoop = false

                for(let i = 0; i < onlyPeaksCloned.length; i++) {
                    const current = onlyPeaksCloned[i + 2]
                    const last = onlyPeaksCloned[i + 1]
                    const previousLast = onlyPeaksCloned[i + 0]
                    const outcome = PriceAnalysis.peakValleyDetection(current, last, previousLast)

                    if (outcome !== undefined && outcome.type === PriceAnalysis.VALLEY) {
                        aggregateValley.push(outcome)
                    }

                    if (outcome !== undefined && outcome.type === PriceAnalysis.PEAK) {
                        aggregatePeak.push(outcome)
                    }

                    if (aggregatePeak.length === 2 && aggregateValley.length >= 1 
                        && aggregatePeak.at(-1).epochDate < aggregatePeak.at(0).epochDate
                    ) {
                        // its possible that we run out of data points without breaking out of loop 
                        brokeOutOfLoop = true
                        break
                    }
                }

                if (brokeOutOfLoop === true && aggregatePeak.at(-1) !== undefined && aggregatePeak.at(-1).type === PriceAnalysis.PEAK) {
                    const slope = this.priceSlope(aggregatePeak.at(-1), mostRecentPeak)
                    if (slope !== undefined) {
                        // console.log(aggregatePeak.at(-1), aggregatePeak.at(0), slope)
                        return slope.negative || slope.value === 0
                    }
                }

                return undefined

            }

            /**
             * 
             * @param {string} code 
             * @returns {boolean}
             */
            profitLossThresholdsExist(code) {
                const profitThresholdExists = typeof window.idaStockVision.settings[code].profitThreshold === 'number'
                const lossThresholdExists = typeof window.idaStockVision.settings[code].lossThreshold === 'number'

                return profitThresholdExists && lossThresholdExists
            }

            /**
             * 
             * @param {PriceHistory[]} onlyPeaks 
             * @param {number} [fromEpochDate] 
             * @param {number} [toEpochDate] 
             * @param {number} [deltaUpOutlier]
             * @param {number} [deltaDownOutlier] 
             * @param {number} [entrySimulation] 
             * @param {number} [exitSimulation] 
             * @returns 
             */
            static statistics(onlyPeaks, fromEpochDate = 0, toEpochDate = Infinity, deltaUpOutlier, deltaDownOutlier, entrySimulation, exitSimulation) {
                // we want to know the min, max, median, average and ?mode
                // use output for defining entry, exit, profit & loss thresholds
                // create cumulative peak/valley records
                // then use valley and following peaks to create analysis buckets to be processed
                // https://www.investopedia.com/terms/s/standarddeviation.asp

                /** @type {PriceHistory[]}*/
                let onlyPeaksCloned = JSON.parse(JSON.stringify(onlyPeaks))
                const removeDuplicates = new Map()
                const toEpochDateEndOfDay = toEpochDate !== Infinity 
                    ? new Date(toEpochDate).setHours(...PriceAnalysis.tradingEndTime())
                    : Infinity
                onlyPeaksCloned.filter((peak) => fromEpochDate <= peak.epochDate && toEpochDateEndOfDay >= peak.epochDate)
                    .forEach((peak) => removeDuplicates.set(peak.epochDate, peak))
                onlyPeaksCloned = Array.from(removeDuplicates.values())
                // console.log(onlyPeaksCloned)
                const mostRecentPeak = onlyPeaksCloned.at(0)
                 /** @type {PriceHistory[]}*/
                const aggregateValley = []
                 /** @type {PriceHistory[]}*/
                const aggregatePeak = []
                 /** @type {[number, number, number, number, number, string, string][]}*/
                const rows = []
                const result = {}
                /** This is the non-localized peak/valley movement that has the complete profits and losses that happen */
                const detectionFlow = []
                let previousLastSinceNoOutcome
                let passedSanityInspection = true

                for(let i = 0; i < onlyPeaksCloned.length; i++) {
                    const current = onlyPeaksCloned[i + 2]
                    const last = onlyPeaksCloned[i + 1]
                    const previousLast = previousLastSinceNoOutcome !== undefined ? previousLastSinceNoOutcome : onlyPeaksCloned[i + 0]
                    const outcome = PriceAnalysis.peakValleyDetection(current, last, previousLast)
                    // TO-DO use new variable to collect outcomes and also add ISO date string to object to upload to [cs]
                    // TO-DO collect and return the top 5 cummulative peaks for possible downward volatility analysis

                    if (outcome !== undefined && outcome.type === PriceAnalysis.VALLEY) {
                        aggregateValley.push(outcome)
                        detectionFlow.push(outcome)
                        previousLastSinceNoOutcome = undefined
                    }

                    if (outcome !== undefined && outcome.type === PriceAnalysis.PEAK) {
                        aggregatePeak.push(outcome)
                        detectionFlow.push(outcome)
                        previousLastSinceNoOutcome = undefined
                    }

                    if (aggregatePeak.length === 1 && aggregateValley.length === 0) {
                        // situation where we start off with a peak since we need corresponding valley
                        aggregateValley.push(undefined)
                    }

                    if ([current?.price, last?.price, previousLast?.price].every(i => Number.isFinite(i)) && outcome === undefined) {
                        // we do not want localized peaks/valleys but the true peak/valley shape as the price flows
                        // for better/accurate analysis and simulations
                        previousLastSinceNoOutcome = previousLast
                    }

                    // console.assert(outcome !== undefined, 'The value is undefined bro')
                }

                detectionFlow.forEach((item, index) => {
                    const previousItem = detectionFlow[index - 1]
                    if (item.type === PriceAnalysis.VALLEY) {
                        return
                    }

                    const dateFormat = 'h:m D/M'
                    const valley = previousItem ? previousItem.price : undefined
                    const valleyDate = previousItem ? PriceAnalysis.dateStringFormat(previousItem.epochDate, dateFormat) : undefined
                    const peak = item.price
                    const peakDate = PriceAnalysis.dateStringFormat(item.epochDate, dateFormat)
                    const previousPeak = detectionFlow[index - 2] !== undefined ? detectionFlow[index - 2].price : undefined
                    let deltaUp = Vision.percentageDelta(valley, peak)
                    deltaUp = (deltaUpOutlier !== undefined && deltaUp >= deltaUpOutlier) ? NaN : deltaUp
                    let deltaDown = previousPeak !== undefined ? Vision.percentageDelta(previousPeak, valley) : undefined
                    deltaDown = (deltaDownOutlier !== undefined && deltaDown >= deltaDownOutlier) ? NaN : deltaDown
                    const profit = (entrySimulation && exitSimulation) && entrySimulation < deltaUp 
                        ? Vision.percentageDelta(PriceAnalysis.percentageFinalAmount(valley, entrySimulation), PriceAnalysis.percentageFinalAmount(peak, exitSimulation, true), true)
                        : 0
                    if (passedSanityInspection === true) {
                        let peakValleyInspection = true
                        let dateInspection = true
                        if (Number.isFinite(valley) && Number.isFinite(peak)) {
                            peakValleyInspection = peak > valley
                        }
                        if (Number.isFinite(previousItem?.epochDate) && Number.isFinite(item?.epochDate)) {
                            dateInspection = item.epochDate > previousItem.epochDate
                        }
                        passedSanityInspection = peakValleyInspection && dateInspection
                        console.assert(passedSanityInspection === true, `${index} index failed sanity inspection`)
                    }
                    

                    rows.push([valley, peak, deltaUp, deltaDown, profit, valleyDate, peakDate])
                })

                const upScatterPlot = rows.map(i => i[2]).filter(j => Number.isFinite(j)).sort((a,b) => a - b).map(i => Number(i.toFixed(2)))
                const downScatterPlot = rows.map(i => i[3]).filter(j => Number.isFinite(j)).sort((a,b) => a - b).map(i => Number(i.toFixed(2)))
                const totalProfit = rows.map(i => i[4]).filter(j => Number.isFinite(j)).reduce((previous, current) => previous + current, 0)

                result.up = {
                    scatterPlot: upScatterPlot,
                    min: Math.min(...upScatterPlot),
                    max: Math.max(...upScatterPlot),
                    average: upScatterPlot.reduce((previous, current) => previous + current, 0) / upScatterPlot.length,
                    median: upScatterPlot.at(Math.round((upScatterPlot.length/2) - 1)),
                    totalProfit
                }

                result.down = {
                    scatterPlot: downScatterPlot,
                    min: Math.min(...downScatterPlot) * -1,
                    max: Math.max(...downScatterPlot) * -1,
                    average: (downScatterPlot.reduce((previous, current) => previous + current, 0) / downScatterPlot.length) * -1,
                    median: downScatterPlot.at(Math.round((downScatterPlot.length/2) - 1)) * -1
                }

                result.up.skewnessTail = result.up.average > result.up.median ? 'right' : 'left'
                result.up.standardDeviation = Math.sqrt(upScatterPlot.map(i => Math.pow(i - result.up.average, 2)).reduce((previous, current) => previous + current, 0) / (upScatterPlot.length - 1))
                
                result.down.standardDeviation = Math.sqrt(downScatterPlot.map(i => Math.pow(i - result.down.average, 2)).reduce((previous, current) => previous + current, 0) / (downScatterPlot.length - 1))
                result.down.skewnessTail = result.down.average > result.down.median ? 'right' : 'left'

                aggregatePeak.sort((a,b) => b.price - a.price)
                aggregateValley.sort((a,b) => a.price - b.price)
                // TO-DO develop an inspector method to make sure that valley to peak rows for prices and dates are in expected behaviour
                // TO-DO develop mode analysis that focuses on the data points between the means and max points

                console.table(rows)
                console.table(detectionFlow)
                console.table(result)

                return {highestPeaks: aggregatePeak.slice(0,5), lowestPeaks: aggregateValley.slice(0,5), rows, result, passedSanityInspection}

            }

            /**
             * 
             * @param {string | string[]} rawData 
             * @param {number} minutesOrDayInterval 
             * @param {number} daysOfMinutesToAnalyse 
             * @param {boolean} isDailyInterval 
             */
            static prepareForStatistics(rawData, minutesOrDayInterval = 5, daysOfMinutesToAnalyse, isDailyInterval = false) {
                // copy paste raw data from nasdaq into the browser as a string literal https://www.nasdaq.com/market-activity/stocks/tsla/advanced-charting
                // TO-DO in separate method, use file system to get the file that has the raw data to use when rawData is undefined
                const completePriceHistoryFormat = []
                const completeIntervalData = []
                let data = []
                if (Array.isArray(rawData)) {
                    rawData.forEach((item) => {
                        const bucket = item.trim().replaceAll('"', '').split('\n')
                        bucket.splice(0, 1)
                        bucket.reverse()
                        data.push(...bucket)
                    })
                }
                if (typeof rawData === 'string') {
                    data = rawData.trim().replaceAll('"', '').split('\n')
                    data.splice(0, 1)
                    data.reverse()
                }
                
                const fullDayMinuteIntervalTotal = !isDailyInterval ? 391 : data.length
                const remainder = !isDailyInterval ? 1 : 0
                const days = daysOfMinutesToAnalyse !== undefined 
                    ? daysOfMinutesToAnalyse 
                    : data.length / fullDayMinuteIntervalTotal
                if (data.length % fullDayMinuteIntervalTotal !== 0) {
                    throw new Error('dataset is missing some data')
                }
                for(let day = 0; day < days; day++) {
                    const intervalData = data.splice(0, fullDayMinuteIntervalTotal)
                        .filter((item, index) => {return (index + 1) % minutesOrDayInterval === remainder})
                    const priceHistoryFormat = intervalData.reduce((previous, current, index) => {
                        // we use open price by default in daily interval scenario since we observe it that way
                        const [date, price, ...rest] = current.split(',')
                        previous.push({
                            epochDate: Date.parse(date),
                            price: Number(price),
                            type: 'peak',
                            volume: rest.at(-1),
                            percentageChange: index > 0 ? Vision.percentageDelta(previous[index - 1].price, Number(price), true) : NaN
                        })
                        return previous
                    }, [])
                    
                    completeIntervalData.push(...intervalData)
                    completePriceHistoryFormat.push(...priceHistoryFormat)
                }

                const priceChangeData = completePriceHistoryFormat.map(item => item.percentageChange).filter(item => Number.isFinite(item))
                const priceChangePositive = priceChangeData.filter(item => item >= 0)
                const priceChangeNegative = priceChangeData.filter(item => item < 0)
                const priceChangePositiveMean = PriceAnalysis.mean(priceChangePositive)
                const priceChangePositiveMedian = PriceAnalysis.median(priceChangePositive)
                const priceChangeNegativeMean = PriceAnalysis.mean(priceChangeNegative)
                const priceChangeNegativeMedian = PriceAnalysis.median(priceChangeNegative)
                const priceChangeMax = Math.max(...priceChangeData)
                const priceChangeMin = Math.min(...priceChangeData)

                return {
                    completeIntervalData,
                    completePriceHistoryFormat,
                    priceChangePositiveMean,
                    priceChangeNegativeMean,
                    priceChangePositiveMedian,
                    priceChangeNegativeMedian,
                    priceChangeMin,
                    priceChangeMax
                }
            }

            /**
             * 
             * @param {number[]} data 
             * @returns {number}
             */
            static mean(data) {
                const onlyNumbers = data.filter(item => Number.isFinite(item))
                const output = onlyNumbers.reduce((previous, current) => previous + current, 0) / onlyNumbers.length
                return output
            }

            /**
             * 
             * @param {number[]} data 
             * @returns {number}
             */
            static median(data) {
                const output = data.filter(item => Number.isFinite(item)).sort((a,b) => a - b)
                return output.at(Math.round((output.length/2) - 1))
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
             * @param {string} format 
             * @returns {string}
             */
            static dateStringFormat(dateObjectOrString, format = 'h:m') {
                // Y (year), M (month), D (date), h (hour), m (minute), s (second)
                const date = dateObjectOrString instanceof Date ?  dateObjectOrString : new Date(dateObjectOrString)
                const formatMap = {year: 'Y', month: 'M', day: 'D', hour: 'h', minute: 'm', second: 's'}
                let output = format
                switch (true) {
                    case format.includes(formatMap.year):
                        output = output.replaceAll(formatMap.year, date.getFullYear().toString())
                    case format.includes(formatMap.month):
                        output = output.replaceAll(formatMap.month, String(date.getMonth() + 1))
                    case format.includes(formatMap.day):
                        output = output.replaceAll(formatMap.day, date.getDate().toString())
                    case format.includes(formatMap.hour):
                        output = output.replaceAll(formatMap.hour, date.getHours().toString())
                    case format.includes(formatMap.minute):
                        output = output.replaceAll(formatMap.minute, date.getMinutes().toString())
                    case format.includes(formatMap.second):
                        output = output.replaceAll(formatMap.second, date.getSeconds().toString())
                    default:
                }
                
                return output
            }

            /**
             * 
             * @param {boolean} isCrypto 
             * @returns {number[]}
             */
            static tradingStartTime (isCrypto = false, minuteOffset = 1) {
                // Hour, Minute, Seconds
                // Add 1 minute to the minute time to have the close price of that minute
                return isCrypto 
                    ? [0, 0 + minuteOffset, 0] 
                    : [9, 30 + minuteOffset, 0]
            }
            
            /**
             * 
             * @param {boolean} isCrypto 
             * @returns {[number, number, number]}
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
             * @returns {[number, number, number]}
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

            /**
            * 
            * @param {string} code 
            * @returns {string}
            */
            static codeFormat(code) {
                return code.toUpperCase()
            }

            /**
             * 
             * @param {string} code 
             * @returns {string}
             */
            static profitPursuitType(code) {
                const codeLowerCase = code.toLowerCase()
                switch (true) {
                    case codeLowerCase.includes(`_${PriceAnalysis.PROFIT_PURSUIT.SMALL}`):
                    case codeLowerCase.includes('_short'):
                        return PriceAnalysis.PROFIT_PURSUIT.SMALL
                    case codeLowerCase.includes(`_${PriceAnalysis.PROFIT_PURSUIT.TINY}`):
                        return PriceAnalysis.PROFIT_PURSUIT.TINY
                    default:
                        return PriceAnalysis.PROFIT_PURSUIT.LARGE
                }
            }

            /**
             * 
             * @param {CurrentPrice} currentPrice 
             * @param {Price} lastPrice 
             * @param {Price} previousLastPrice 
             * @returns {undefined | PriceHistory}
             */
            static peakValleyDetection(currentPrice, lastPrice, previousLastPrice) {
                if (lastPrice !== undefined && previousLastPrice !== undefined && currentPrice !== undefined) {
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
            
        }
        /**
         * 
         * @param {string} val 
         * @returns {number}
         */
        static decimalConvert(val) {
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
        static sanitizePrice(val) {
            if (typeof val === 'string') {
                return val.replace(/[\$\,cadusd]/g, '')
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
        static percentageDelta(oldNumber, newNumber, includeSign = false) {
            if ([oldNumber, newNumber].every((item) => typeof item !== 'number')){
                return
            }
            const percentage = (newNumber - oldNumber)*100/oldNumber
            if (includeSign === true) {
                return percentage
            }
            
            return Math.abs(percentage)
        }

        /**
         * 
         * @param {number} first 
         * @param {number} second 
         * @param {number} percentageLimit 
         * @param {boolean} directionPositive 
         * @returns {boolean}
         */
        static numberIsWithinOneDirectionalRange(first, second, percentageLimit, directionPositive = true) {
            const delta = Number(Vision.percentageDelta(first, second, true).toFixed(2))
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
         * @param {number} [entryMultiplier] 
         * @returns {number | undefined}
         */
        static applyEntryExitThresholdToAnchor(anchor, entryThreshold, exitThreshold, entryMultiplier = 1) {
            if (anchor !== undefined && 'price' in anchor && 'type' in anchor) {
                if (anchor.type === Vision.PriceAnalysis.PEAK) {
                    return Vision.PriceAnalysis.percentageFinalAmount(anchor.price, exitThreshold, true)
                }
                if (anchor.type === Vision.PriceAnalysis.VALLEY) {
                    return Vision.PriceAnalysis.percentageFinalAmount(anchor.price, entryThreshold * entryMultiplier)
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
        static async uploadTodaysPriceHistory(code = window.idaStockVision.code, squashTodaysHistory = true) {
            try {
                const primaryCode = Vision.PriceAnalysis.primaryCode(code)
                const priceStore = window.idaStockVision.priceStore
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
                    window.dispatchEvent(new Event(Vision.PriceAnalysis.EVENT_NAMES.setFutureInterval))
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
        static setUploadPricesTimeout(isCrypto, currentTimeoutDateInMiliseconds, callback) {
            // will be initialized by the first code but other codes can continue when the first code is destroyed
            let isSameDate = false
            let currentTiemoutInDateObject
            const nowInMilliSeconds = Date.now()
            const nowInDateObject = new Date(nowInMilliSeconds)
            const [endHour, endMinute, endSecond] = Vision.PriceAnalysis.tradingHistoryUploadTime(isCrypto)
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
        static statusHTTP(code) {
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
        static async positionStatusPolling(code = window.idaStockVision.code, restartCounter = false) {
            try {
                if (restartCounter) {
                    clearTimeout(window.idaStockVision.statusTimeoutInstance)
                    window.idaStockVision.statusCounter = 0
                }
                const resp = await Vision.statusHTTP(code)
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

        watch = () => {
            try {
                const origin = location.origin
                const observeOptions = {subtree: true,characterData: true, characterDataOldValue: true}
                let priceElement, priceHighAndLowRangeElement, priceLowRangeElement, priceHighRangeElement, highAndLowMutationObserver, lowMutationObserver, highMutationObserver
                window.idaStockVision.mutationObservers[this.#code] = new MutationObserver(this.mutationObserverCallback)
                const storeHighLowRangeGeneral = (lowElementText, highElementText) => {
                    if (lowElementText !== undefined) {
                        window.idaStockVision.priceStore.marketHighLowRange.low = Vision.decimalConvert(Vision.sanitizePrice(lowElementText))
                    }
                    if (highElementText !== undefined) {
                        window.idaStockVision.priceStore.marketHighLowRange.high = Vision.decimalConvert(Vision.sanitizePrice(highElementText))
                    }
                }
                const storeJointHighLowRange = (elementText) => {
                    const value = elementText.split('-')
                    window.idaStockVision.priceStore.marketHighLowRange.low = Vision.decimalConvert(Vision.sanitizePrice(value[0]))                 
                    window.idaStockVision.priceStore.marketHighLowRange.high = Vision.decimalConvert(Vision.sanitizePrice(value[1]))
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
                        // add tradingview, google finance
                        throw new Error('website css selectors do not exist')
                }

                if (priceElement === null || priceElement === undefined) {
                    throw new Error('can\'t find price')
                }
                window.idaStockVision.mutationObservers[this.#code].observe(priceElement, observeOptions)
            } catch (error) {
                console.log('Ida Trader Bot - WATCH STOCK', error)
            }
        }
        /**
         * 
         * @param {string} code 
         */
        static destroyCode(code) {
            const codeUpperCase = code.toUpperCase()
            window.dispatchEvent(new CustomEvent(Vision.PriceAnalysis.EVENT_NAMES.destroyCode, {detail: {code: codeUpperCase}}))
        }
        /**
         * 
         * @param {string} code 
         */
        static pauseWatchCode(code) {
            const codeUpperCase = code.toUpperCase()
            window.idaStockVision.mutationObservers[codeUpperCase].disconnect()
        }
        /**
         * 
         * @param {string} code 
         */
        async traderSetUp(code = this.#code) {         
            if (window.idaStockVision === undefined) {
                window.idaStockVision = {
                    positionIn: {},
                    notificationInProgress: {},
                    lastNotificationSent: {},
                    mutationObservers: {},
                    consoleClearInstance: window.setInterval(()=>{console.clear()}, 1000*60*20),
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
                    tradingStartTime: Vision.PriceAnalysis.tradingStartTime(this.#isCrypto),
                    tradingEndTime: Vision.PriceAnalysis.tradingEndTime(this.#isCrypto),
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
                        decimalConvert: Vision.decimalConvert,
                        percentageDelta: Vision.percentageDelta,
                        percentageFinalAmount: Vision.PriceAnalysis.percentageFinalAmount,
                        uploadTodaysPriceHistory: Vision.uploadTodaysPriceHistory,
                        positionStatusPolling: Vision.positionStatusPolling,
                        destroyCode: Vision.destroyCode,
                        pauseWatchCode: Vision.pauseWatchCode,
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
                            preMarketAndAfterHoursPrice: () => document.evaluate('//c-wiz[3]/div/div[4]/div/main/div[2]/div[1]/div[1]/c-wiz/div/div[1]/div/div[2]/span[1]/span/div/div',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                            highLowRange: () => document.evaluate('//c-wiz[3]/div/div[4]/div/main/div[2]/div[2]/div/div[1]/div[3]/div',document,null,XPathResult.ANY_UNORDERED_NODE_TYPE,null).singleNodeValue,
                        },

                    },
                    constants: {},
                    reports: [],
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
                window.idaStockVision.tools[`watch_${code}`] = this.watch
                window.idaStockVision.tools[`destroy_${code}`] = () => Vision.destroyCode(code)
                window.idaStockVision.tools[`pause_${code}`] = () => Vision.pauseWatchCode(code)
                window.idaStockVision.tools[`purgeNotification_${code}`] = () => Vision.purgeNotificationLastSent(code)
                window.idaStockVision.settings[code] = {
                    tradingInterval: this.#tradingInterval,
                    precisionInterval: this.#precisionInterval,
                    experiment: false,
                    entryPercentageThreshold: this.#entryPercentage || undefined,
                    exitPercentageThreshold: this.#exitPercentage || undefined,
                    entryMultiplier: Vision.PriceAnalysis.ENTRY_MULTIPLIER[Vision.PriceAnalysis.profitPursuitType(code)] || undefined,
                    manualEntryPriceThreshold: this.#manualEntryPrice || undefined,
                    manualExitPriceThreshold: this.#manualExitPrice || undefined,
                    profitThreshold: undefined,
                    lossThreshold: undefined,
                }
                Vision.setTradingTimeInterval(code, Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#tradingInterval], Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#precisionInterval], codeStartTime[0], codeStartTime[1], codeStartTime[2])
                const setFutureIntervalListener = () => {
                    Vision.setTradingTimeInterval(code, Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#tradingInterval], Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#precisionInterval], codeStartTime[0], codeStartTime[1], codeStartTime[2], true)
                }
                window.addEventListener(Vision.PriceAnalysis.EVENT_NAMES.setFutureInterval, setFutureIntervalListener)
                window.addEventListener(Vision.PriceAnalysis.EVENT_NAMES.destroyCode, (/** @type{CustomEvent} */customEvent) => {
                    const eventCode = customEvent.detail.code
                    if (eventCode === code) {
                        if (window.idaStockVision.mutationObservers[code] && window.idaStockVision.mutationObservers[code].disconnect) {
                            window.idaStockVision.mutationObservers[code].disconnect()
                        }
                        delete window.idaStockVision.positionIn[code]
                        window.removeEventListener(Vision.PriceAnalysis.EVENT_NAMES.setFutureInterval, setFutureIntervalListener)
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
                const primaryCode = Vision.PriceAnalysis.primaryCode(code)
                const resp = await Vision.statusHTTP(code)
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
         * @param {{[key: string]: string|boolean} | {}} otherQueryParams 
         * @returns {Promise<void>}
         */
        static async sendNotification(tokenOrStockCode, messageBody = 'manual confirmation', currentPrice, action, anchorPrice, confirmationLink, otherQueryParams = {}) {
            const lastNotification = window.idaStockVision.lastNotificationSent[tokenOrStockCode]
            const priceDifferencePercentage = 'currentPrice' in lastNotification
                ? Vision.percentageDelta(lastNotification.currentPrice, currentPrice) 
                : 0
            const percentageThreshold = 5
            const notificationSubject = `${tokenOrStockCode} - Get [${action.toUpperCase()}] (${currentPrice})`
            const queryParams = new URLSearchParams()
            const sameActionAsLast = 'action' in lastNotification 
                ? lastNotification.action === action 
                : false
            // only useful when doing manual buy/sell execution
            const percentageThresholdReached = priceDifferencePercentage >= percentageThreshold
            const sameAnchorPriceAsLastNotificationAnchorPrice = 'anchorPrice' in lastNotification
                ? anchorPrice === lastNotification.anchorPrice
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
                || sameActionAsLast
            ) {
                return
            }

            try {
                window.idaStockVision.notificationInProgress[tokenOrStockCode] = true
                queryParams.append('message', messageBody)
                queryParams.append('subject', notificationSubject)
                queryParams.append('code', tokenOrStockCode)
                queryParams.append('primaryCode', Vision.PriceAnalysis.primaryCode(tokenOrStockCode))
                queryParams.append('action', action)
                queryParams.append('currentPrice', currentPrice.toString())
                queryParams.append('confirmationLink', confirmationLink)
                Object.entries(otherQueryParams).forEach((item) => queryParams.append(item[0], String(item[1])))

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
                if (action === 'out') {
                    Vision.addReport('message' in lastNotification ? lastNotification.message : undefined, messageBody)
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
                Vision.positionStatusPolling(tokenOrStockCode, true)
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
        updatePrices(currentPrice, peakValleyDetected, intervalFlag) {
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
                    Vision.addIntervalFlagToPeakValleyDetectedOrCurrentPrice(this.#code, peakValleyDetected, intervalFlag)
                    priceStore.peakValleyHistory.push(peakValleyDetected)
                }
            } catch (error) {
                console.log('Ida Trader Bot - UPDATE PRICES', error)
            }
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
        static tradingTimeInterval(code, intervals, intervalInSeconds, startHour = 0, startMinute = 0, startSeconds = 0, forTomorrow = false) {
            if (intervalInSeconds === undefined) {
                return
            }
            let today = new Date()
            if (forTomorrow) {
                const tomorrowEpoch = today.getTime() + 24*Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[Vision.PriceAnalysis.TRADING_INTERVAL.oneHour]
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

            let confirmTodayInMultipleDaysInterval = (month = 0, daysInterval = 1) => {
                // relative to the first business day of beginning of the year (mon,tue,wed...)
                // from that day extract all the business days of the year up to todays month
                // loop through all the business days with the days interval up to todays month
                // map the days intervals to be in the format day:month:year
                // check current day exist in the map
                // https://www.timeanddate.com/date/workdays.html?d1=1&m1=1&y1=2025&d2=29&m2=11&y2=2025&ti=on&
                const today = new Date(new Date().setHours(0,0,0,0))
                const todayFormatString = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
                const nextMonth = today.setMonth(today.getMonth() + 1)
                const firstDayOfTheYear = new Date(today.setFullYear(today.getFullYear(), month, 1))
                let firstBusinessDayOfTheYear, businessDayLoop, businessDaysOfTheYearIntervals
                const businessDaysOfTheYear = []
                switch(firstDayOfTheYear.getDay()) {
                    case 0:
                        firstBusinessDayOfTheYear = firstDayOfTheYear.setDate(firstDayOfTheYear.getDate() + 1)
                        break
                    case 6:
                        firstBusinessDayOfTheYear = firstDayOfTheYear.setDate(firstDayOfTheYear.getDate() + 2)
                        break
                    default:
                        firstBusinessDayOfTheYear = firstDayOfTheYear.getTime()
                }
                businessDayLoop = firstBusinessDayOfTheYear
                businessDaysOfTheYear.push(businessDayLoop) // start from the first business day

                while(businessDayLoop < nextMonth) {
                    businessDayLoop += 1000 * 60 * 60 * 24
                    if ([6, 0].includes(new Date(businessDayLoop).getDay())) {   
                        continue
                    }
                    
                    businessDaysOfTheYear.push(businessDayLoop)
                }

                businessDaysOfTheYearIntervals = businessDaysOfTheYear.reduce((previous, current, index) => {
                    if ((index + 1) % daysInterval === 0) {
                        const date = new Date(current)
                        previous.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`)
                    }

                    return previous
                }, [])

                console.log(new Date(firstBusinessDayOfTheYear), businessDayLoop, businessDaysOfTheYear, businessDaysOfTheYearIntervals)

                return businessDaysOfTheYearIntervals.includes(todayFormatString)
            }

        }

        /**
         * 
         * @param {number[]} intervals 
         * @returns {Map<string, TradingIntervalInspection>}
         */
        static tradingTimeIntervalForPeakDetection(intervals) {
            let timeKeysWithFlags = new Map()
            intervals.forEach((item, index) => {
                const hourMinuteString = Vision.PriceAnalysis.dateStringFormat(item)
                timeKeysWithFlags.set(hourMinuteString, {
                    peakCaptured: false,
                    valleyCaptured: false,
                    currentPriceExecuted: false,
                    epochDate: item,
                    // 1 minute after interval time
                    inspectionEpochDate: item + Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[Vision.PriceAnalysis.TRADING_INTERVAL.oneMinute], 
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
        static precisionTimeIntervalForPricePrecision(intervals) {
            /** @type {Map<string, PrecisionIntervalInspection>} */
            let timeKeysWithFlags = new Map()
            intervals.forEach((item, index) => {
                const hourMinuteString = Vision.PriceAnalysis.dateStringFormat(item)
                timeKeysWithFlags.set(hourMinuteString, {
                    currentPriceExecuted: false,
                    epochDate: item,
                    // 1 minute after interval time
                    inspectionEpochDate: item + Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[Vision.PriceAnalysis.TRADING_INTERVAL.oneMinute], 
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
        static setTradingTimeInterval(code, tradingIntervalInSeconds, precisionIntervalInSeconds, startHour, startMinute, startSeconds, forTomorrow = false) {
            let tradingIntervalsBag = []
            let precisionIntervalsBag = []
            Vision.tradingTimeInterval(code, tradingIntervalsBag, tradingIntervalInSeconds, startHour, startMinute, startSeconds, forTomorrow)
            Vision.tradingTimeInterval(code, precisionIntervalsBag, precisionIntervalInSeconds, startHour, startMinute, startSeconds, forTomorrow)
            window.idaStockVision.priceStore.priceTimeIntervalsToday[code] = Vision.tradingTimeIntervalForPeakDetection(tradingIntervalsBag)
            window.idaStockVision.priceStore.precisionTimeIntervalsToday[code] = Vision.precisionTimeIntervalForPricePrecision(precisionIntervalsBag)
        }

        /**
         * 
         * @param {string} code 
         * @param {PriceHistory | CurrentPrice} peakValleyDetectedOrCurrentPrice 
         * @param {IntervalFlags} intervalFlag
         */
        static addIntervalFlagToPeakValleyDetectedOrCurrentPrice(code, peakValleyDetectedOrCurrentPrice, intervalFlag) {
            if (Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[intervalFlag] === undefined) {
                return
            }
            const priceStore = window.idaStockVision.priceStore
            const isPeakValley = 'type' in peakValleyDetectedOrCurrentPrice && ['peak','valley'].includes(peakValleyDetectedOrCurrentPrice.type)
            const timeFormatString = Vision.PriceAnalysis.dateStringFormat(peakValleyDetectedOrCurrentPrice.date)
            const tradingIntervalMatch = priceStore.priceTimeIntervalsToday[code].has(timeFormatString)
            const precisionIntervalMatch = priceStore.precisionTimeIntervalsToday[code].has(timeFormatString)
            if (tradingIntervalMatch === true) {
                const tradingIntervalSettings = priceStore.priceTimeIntervalsToday[code].get(timeFormatString)
                
                if (isPeakValley) {
                    switch(peakValleyDetectedOrCurrentPrice.type) {
                        case 'peak':
                            if (!tradingIntervalSettings.peakCaptured) {
                                peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag)
                                tradingIntervalSettings.peakCaptured = true
                                tradingIntervalSettings.peakPrice = peakValleyDetectedOrCurrentPrice.price
                            }
                            break;
                        case 'valley':
                            if (!tradingIntervalSettings.valleyCaptured) {
                                peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag)
                                tradingIntervalSettings.valleyCaptured = true
                                tradingIntervalSettings.valleyPrice = peakValleyDetectedOrCurrentPrice.price
                            }
                            break;
                        default:
                    }
                }

                if (!isPeakValley && !tradingIntervalSettings.currentPriceExecuted) {
                    // will only execute on trading interval once
                    peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag, Vision.PriceAnalysis.TRADING_FLAGS.REGULAR)
                    tradingIntervalSettings.currentPriceExecuted = true
                    tradingIntervalSettings.currentPrice = peakValleyDetectedOrCurrentPrice
                }
            }

            if (precisionIntervalMatch === true && !isPeakValley) {
                // Allow all price movements within the minute of the precision interval match to maximize chances of having precision execution
                const precisionIntervalSettings = priceStore.precisionTimeIntervalsToday[code].get(timeFormatString)
                if (precisionIntervalMatch && !tradingIntervalMatch) {
                    // we do not want precision interval execution within the trading interval time but want to see the current prices data
                    peakValleyDetectedOrCurrentPrice.flags.push(intervalFlag, Vision.PriceAnalysis.TRADING_FLAGS.PRECISION)
                }

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
        tradingIntervalInspector(code, intervalBag, intervalSeconds) {
            try {
                const now = Date.now()
                const intervalForNow = Array.from(intervalBag.values())
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
                    const closestPeakValleyToNow = window.idaStockVision.priceStore.peakValleyHistory
                    .filter((item) => {
                        return 'epochDate' in item  && (item.epochDate >= interval.epochDate)
                    }).sort((a,b) => {
                        // ascending date
                        if (a.epochDate < b.epochDate) {
                            return -1
                        }
                        if (a.epochDate === b.epochDate) {
                            return 0
                        }
                        return 1
                    })

                    
                    const closestPeaksToNow = closestPeakValleyToNow.filter((item) => {
                        return item.type === Vision.PriceAnalysis.PEAK
                    })
                    const closestValleysToNow = closestPeakValleyToNow.filter((item) => {
                        return item.type === Vision.PriceAnalysis.VALLEY
                    })
                    const firstPeakAndValley = [closestPeaksToNow.at(0), closestValleysToNow.at(0)]
                    const allItemsAreUndefined = firstPeakAndValley.every(item => item === undefined)
                    const someItemsAreUndefined = firstPeakAndValley.some(item => item === undefined)
                    // if peak & valley is empty retry again in one minute
                    // if one or the other is empty, clone it for the one thats missing
                    if (allItemsAreUndefined) {
                        // explore using the current price executed at the time of the interval if this does not work well
                        window.setTimeout(() => {
                            this.tradingIntervalInspector(code, intervalBag, intervalSeconds)
                        }, Vision.PriceAnalysis.ONE_MINUTE_IN_MILLISECONDS)

                        return
                    }

                    if (!allItemsAreUndefined && someItemsAreUndefined) {
                        const anchorNotEmpty = firstPeakAndValley.filter(item => item !== undefined)
                        const localTypeToClone = anchorNotEmpty[0].type === Vision.PriceAnalysis.PEAK ? Vision.PriceAnalysis.VALLEY : Vision.PriceAnalysis.PEAK
                        const clone = JSON.parse(JSON.stringify(anchorNotEmpty[0]))
                        clone.type = localTypeToClone
                        window.idaStockVision.priceStore.peakValleyHistory.push(clone)
                        firstPeakAndValley.push(clone)
                    }
                    firstPeakAndValley.forEach((item) => {
                        if (item === undefined) {
                            console.log('peak or valley is undefined')
                            return
                        }
                        if (item && !item.flags.includes(tradingInterval)) {
                            item.flags.push(tradingInterval)
                        }
                        interval[`${item.type}Captured`] = true
                        interval[`${item.type}Price`] = item.price
                        console.log(`inspector: closest ${item.type} flagged`)
                    })
                }


                if (!currentTimePriceExecuted) {
                    const record = {
                        target: {
                            nodeValue: String(lastPrice.price)
                        }
                    }
                    this.mutationObserverCallback(/** @type{MutationRecord[]}*/ ([record]), undefined, true)
                    interval.currentPriceExecuted = true
                    console.log('inspector: interval time price execution completed')
                }


                if (window.idaStockVision.intervalInspectorInstance[code] === undefined) {
                    window.idaStockVision.intervalInspectorInstance[code] = window.setInterval(() => {
                        this.tradingIntervalInspector(code, intervalBag, intervalSeconds)
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
        runTradingIntervalInspector(code, tradingIntervalBag, tradingIntervalSeconds, precisionIntervalBag, precisionIntervalSeconds) {
            // check date and time
            // make sure now is not beyond trading end time
            // find/get closest time > now that needs to be checked
            // calculate the milliseconds needed to run the check
            // setTimeout with the seconds needed
            const today = new Date()
            const nowEpochDate = today.getTime()
            /** @type {TradingIntervalInspection[]} */
            const intervalBagValues = Array.from(tradingIntervalBag.values())
            if (intervalBagValues.length === 0) {
                return
            }
            const firstIntervalItem = intervalBagValues[0]
            const firstIntervalItemDate = new Date(firstIntervalItem.epochDate)
            const [startHour, startMinute, startSeconds] = window.idaStockVision.tradingStartTime
            // check the interval bag has todays date and reset the interval bag otherwise (after weekend, public holidays, etc)
            if (firstIntervalItemDate.getDate() !== today.getDate()) {
                Vision.setTradingTimeInterval(code, tradingIntervalSeconds, precisionIntervalSeconds, startHour, startMinute, startSeconds)
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
                    this.tradingIntervalInspector(code, tradingIntervalBag, tradingIntervalSeconds)
                }, timeDifference)
            }

        }

        /**
         * 
         * @param {string} code 
         */
        static purgeNotificationLastSent(code) {
            const codeFormatted = Vision.PriceAnalysis.codeFormat(code)
            window.idaStockVision.lastNotificationSent[codeFormatted] = {}
        }

        /**
         * 
         * @param {string} messageEntry 
         * @param {string} messageExit 
         */
        static addReport(messageEntry, messageExit) {
            try {
                const idaStockVision = window.idaStockVision
                /**
                 * 
                 * @param {string} notificationMessage 
                 * @returns 
                 */
                const retrieveData = (notificationMessage) => {
                    //TO-DO use array.find to get the specific data needed as the index order will vary dynamically
                    const message = notificationMessage.split('\n')
                    let anchorPrice, downwardVolatility, link, profitLoss
                    anchorPrice = message.find(item => item.toLowerCase().includes('anchor'))
                    downwardVolatility = message.find(item => item.toLowerCase().includes('volatility'))
                    link = message.find(item => item.toLowerCase().includes('link'))
                    profitLoss = message.find(item => item.toLowerCase().includes('gross'))
                    const url = new URL(link.split(': ').at(-1).trim())
                    const date = url.searchParams.get('date')
                    const position = url.searchParams.get('position') === 'in' ? Vision.PriceAnalysis.IN : Vision.PriceAnalysis.OUT
                    const price = Number(url.searchParams.get('price'))
                    const code = url.searchParams.get('code')
                    anchorPrice = anchorPrice !== undefined ? Number(anchorPrice.split(':').at(-1).trim()) : undefined
                    profitLoss = profitLoss !== undefined ? Number(profitLoss.split(':').at(-1).trim()) : undefined
                    downwardVolatility = downwardVolatility.split(':').at(-1).trim() === 'true' ? true : false
    
                    return {anchorPrice, downwardVolatility, date, position, price, code, profitLoss}
                }
                
                const exit = retrieveData(messageExit)
                const entry = messageEntry !== undefined ? retrieveData(messageEntry) : idaStockVision.priceStore.currentPosition[exit.code]
                const anchorIn = 'anchorPrice' in entry ? entry.anchorPrice : undefined
                const volatilityIn = 'downwardVolatility' in entry ? entry.downwardVolatility : undefined
                const localStorageKey = `stockvision_${exit.code}`
                const report = {
                    dateIn: entry.date,
                    dateOut: exit.date,
                    code: exit.code,
                    anchorIn,
                    anchorOut: exit.anchorPrice,
                    volatilityIn,
                    volatilityOut: exit.downwardVolatility,
                    priceIn: entry.price,
                    priceOut: exit.price,
                    profitLoss: exit.profitLoss,
                    anchorProfitLoss: Vision.percentageDelta(anchorIn, exit.anchorPrice, true),
                }
    
                idaStockVision.reports.push(report)

                if (!localStorage.hasOwnProperty(localStorageKey)){
                    localStorage.setItem(localStorageKey, JSON.stringify([]))
                }
                // save to localstorage
                localStorage.setItem(localStorageKey, JSON.stringify([...JSON.parse(localStorage.getItem(localStorageKey)), report]))
                
                
            } catch (error) {
                console.log('cannot add report', error.toString())
            }
        }

        /**
         * 
         * @param {StockVision['reports']} reports 
         * @param {string[]} specificCodes 
         */
        static viewReports(reports = [], specificCodes = []) {
            let anchorProfitLossPercentage = 0
            let profitLossPercentage = 0
            const breakDown = []
            const formatedSpecificCodes = specificCodes.map(code => code.toUpperCase())
            reports.filter(report => specificCodes.length === 0 || formatedSpecificCodes.includes(report.code))
            .forEach((report) => {
                profitLossPercentage += report.profitLoss
                
                if (!Number.isNaN(report.anchorProfitLoss)) {
                    anchorProfitLossPercentage += report.anchorProfitLoss
                }

                breakDown.push([
                    report.anchorIn,
                    report.anchorOut,
                    Number(report.anchorProfitLoss).toFixed(2),
                    report.priceIn,
                    report.priceOut,
                    Number(report.profitLoss).toFixed(2),
                    report.code,
                    report.volatilityIn,
                    report.volatilityOut,
                    Vision.PriceAnalysis.dateStringFormat(report.dateIn, 'D/M h:m'),
                    Vision.PriceAnalysis.dateStringFormat(report.dateOut, 'D/M h:m'),
                ])
            })

            return {anchorProfitLossPercentage, profitLossPercentage, breakDown}
        }

        /**
         * 
         * @param {MutationRecord[]} mutationArray 
         * @param {MutationObserver} observerInstance 
         * @param {boolean} inspectorTrigger
         */
        mutationObserverCallback = (mutationArray, observerInstance, inspectorTrigger = false) => {
            try {
                // TO-DO have a disconnect method to cleanup setTimeouts for history upload
                const nowEpochDate = Date.now()
                const nowDateFullString = new Date(nowEpochDate).toString()
                const nowDateISOString = new Date(nowEpochDate).toISOString()
                const lastRecord = mutationArray[mutationArray.length - 1]
                const targetValue =  Vision.decimalConvert(Vision.sanitizePrice(lastRecord.target.nodeValue))
                const windowStockVision = window.idaStockVision
                const priceStore = window.idaStockVision.priceStore
                /** @type {CurrentPrice} */
                const currentPrice =  {epochDate: nowEpochDate, date: nowDateISOString, price: targetValue, flags: []}
                Vision.addIntervalFlagToPeakValleyDetectedOrCurrentPrice(this.#code, currentPrice, this.#tradingInterval)
                if (inspectorTrigger === true) {
                    currentPrice.flags.push(this.#tradingInterval)
                }
                const confirmationLink = `${window.idaStockVision.notificationServerUrl}/trader/confirm?`
                const confirmationQueryParams = new URLSearchParams()
                let entryPrice = windowStockVision.settings[this.#code].manualEntryPriceThreshold
                let exitPrice = windowStockVision.settings[this.#code].manualExitPriceThreshold
                const entryPercentageThreshold = windowStockVision.settings[this.#code].entryPercentageThreshold
                const exitPercentageThreshold = windowStockVision.settings[this.#code].exitPercentageThreshold
                let analysis, anchor
                /** @type {number | string} */
                let anchorPrice = ''
                let notificationBody = ''
                let onlyPrecisionFlagExistsOnCurrentPrice = false
                /** @type {undefined | boolean} */
                let downwardVolatilityTrail = undefined
                let exitByTradingEndTime = false
                let shouldBeExitingByTradingEndTime = false
                const otherNotificationQueryParams = {}
                const autoEntryExitMode = entryPrice === undefined && exitPrice === undefined
                if (autoEntryExitMode) {
                    const currentPosition = priceStore.currentPosition[this.#code]
                    const peakValleyDetected = Vision.PriceAnalysis.peakValleyDetection(currentPrice, priceStore.lastPrice, priceStore.previousLastPrice)
                    this.updatePrices(currentPrice, peakValleyDetected, this.#tradingInterval)
                    this.runTradingIntervalInspector(this.#code, priceStore.priceTimeIntervalsToday[this.#code], Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#tradingInterval], priceStore.precisionTimeIntervalsToday[this.#code], Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#precisionInterval])
                    if (Vision.PriceAnalysis.TRADING_INTERVAL_SECONDS[this.#tradingInterval] !== undefined 
                        && 'flags' in currentPrice 
                        && !currentPrice.flags.includes(this.#tradingInterval)
                    ) {
                        return
                    }
                    analysis = new Vision.PriceAnalysis(priceStore.peakValleyHistory, currentPrice, currentPosition, this.#isCrypto, entryPercentageThreshold, exitPercentageThreshold, this.#tradingInterval, this.#precisionInterval)
                    priceStore.analysis[this.#code] = analysis
                    exitByTradingEndTime = analysis.exitByTradingEndTime(this.#code, nowEpochDate)
                    shouldBeExitingByTradingEndTime = analysis.exitByTradingEndTime(this.#code, nowEpochDate, true)
                    downwardVolatilityTrail = analysis.downwardVolatility()
                    const entryMultiplier = downwardVolatilityTrail === true ? window.idaStockVision.settings[this.#code].entryMultiplier : undefined
                    entryPrice = !shouldBeExitingByTradingEndTime
                        ? Vision.applyEntryExitThresholdToAnchor(analysis.findAnchorValley(), entryPercentageThreshold, exitPercentageThreshold, entryMultiplier)
                        : undefined
                    exitPrice = analysis.isCurrentPositionStuck || analysis.targetedProfitAcquired(this.#code) || analysis.targetedLossAcquired(this.#code) || exitByTradingEndTime
                        ? currentPrice.price 
                        : Vision.applyEntryExitThresholdToAnchor(analysis.findAnchorPeak(), entryPercentageThreshold, exitPercentageThreshold)
                    priceStore.highestPeakAndLowestValleyToday[this.#code] = analysis.highestPeakAndLowestValleyToday
                    priceStore.todaysPeakValleySnapshot[this.#code] = analysis.todaysPeakValleySnapshot
                    anchor = analysis.findAnchor()
                    anchorPrice = anchor !== undefined ? anchor.price : 'no-anchor'
                    // should be set after all flags have been possibly set
                    onlyPrecisionFlagExistsOnCurrentPrice = currentPrice.flags.includes(Vision.PriceAnalysis.TRADING_FLAGS.PRECISION) 
                        && !currentPrice.flags.includes(Vision.PriceAnalysis.TRADING_FLAGS.REGULAR)
                    const timeToUpload = Vision.setUploadPricesTimeout(this.#isCrypto,priceStore.uploadTodaysPriceTime,Vision.uploadTodaysPriceHistory)
                    if (typeof timeToUpload === 'number') {
                        priceStore.uploadTodaysPriceTime = timeToUpload
                    }
                    if (anchor !== undefined){
                        notificationBody = notificationBody.concat(`Anchor Price: ${anchorPrice} \r\n`)
                        notificationBody = notificationBody.concat(`Anchor Type: ${anchor.type} \r\n`)
                    }
                    notificationBody = window.idaStockVision.positionIn[this.#code] 
                        ? notificationBody.concat(`Gross Profit(%): ${Vision.percentageDelta(currentPosition.price, currentPrice.price, true)} \r\n`)
                        : notificationBody
                    notificationBody = analysis.isCurrentPositionStuck
                        ? notificationBody.concat(`Stuck: true \r\n`)
                        : notificationBody
                    notificationBody =  notificationBody.concat(`Downward volatility: ${downwardVolatilityTrail} \r\n`)
                    otherNotificationQueryParams.downwardVolatility = downwardVolatilityTrail === true
                    otherNotificationQueryParams.immediateExecution = 
                        exitByTradingEndTime === true && Vision.PriceAnalysis.profitPursuitType(this.#code) === Vision.PriceAnalysis.PROFIT_PURSUIT.TINY
                }
                const stockRangeDecision = {
                    // No need for <= to logic since probability of exact match is very low
                    enter: currentPrice.price < entryPrice,
                    exit: currentPrice.price >= exitPrice,
                }
                const stockSurfDecision = {
                    enter: onlyPrecisionFlagExistsOnCurrentPrice
                        ? Vision.numberIsWithinOneDirectionalRange(entryPrice,currentPrice.price,Vision.PriceAnalysis.entryExitPricePrecisionThreshold) 
                        : currentPrice.price >= entryPrice,
                    exit: onlyPrecisionFlagExistsOnCurrentPrice 
                        ? Vision.numberIsWithinOneDirectionalRange(exitPrice,currentPrice.price,Vision.PriceAnalysis.entryExitPricePrecisionThreshold,false) 
                        : currentPrice.price <= exitPrice,
                }
                const enterDecision = !autoEntryExitMode ? stockRangeDecision.enter : stockSurfDecision.enter
                const exitDecision = !autoEntryExitMode ? stockRangeDecision.exit : stockSurfDecision.exit
                
                let color = 'red'
                let message = `[${this.#code}] DO NOTHING AT ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                confirmationQueryParams.append('code', this.#code)
                confirmationQueryParams.append('price', String(currentPrice.price))
                confirmationQueryParams.append('date', nowDateISOString) // will help with scenario where entry is the max peak so the peak is not ignored for exit threshold


                if (entryPrice !== undefined && enterDecision) {
                    // No need for equals to logic since probabiloty of exact match is very low
                    message = `[${this.#code}] SWAP IN AT ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                    color = 'green'
                    confirmationQueryParams.append('position', 'in')
                    notificationBody = notificationBody.concat(`Action Link: ${confirmationLink}${confirmationQueryParams.toString()} \r\n`)
                    Vision.sendNotification(
                        this.#code, 
                        notificationBody, 
                        currentPrice.price, 
                        'in', 
                        anchorPrice, 
                        `${confirmationLink}${confirmationQueryParams.toString()}`,
                        otherNotificationQueryParams
                    )
                    if (window.idaStockVision.positionIn[this.#code]) {
                        message = `[${this.#code}] YOU ARE IN ALREADY ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                        color = 'blue'
                    }
                }
                if (exitPrice !== undefined && exitDecision) {
                    message = `[${this.#code}] SWAP OUT AT ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                    color = 'orange'
                    confirmationQueryParams.append('position', 'out')
                    notificationBody = notificationBody.concat(`Action Link: ${confirmationLink}${confirmationQueryParams.toString()} \r\n`)
                    Vision.sendNotification(
                        this.#code,
                        notificationBody,
                        currentPrice.price,
                        'out',
                        anchorPrice,
                        `${confirmationLink}${confirmationQueryParams.toString()}`,
                        otherNotificationQueryParams
                    )
                    if (!window.idaStockVision.positionIn[this.#code]) {
                        message = `[${this.#code}] YOU ARE OUT ALREADY ${currentPrice.price}[${anchorPrice}] - ${nowDateFullString}`
                        color = 'blue'
                    }
                }
                console.log(`%c ${message}`,`color:white;background-color:${color};padding:50px`)
            } catch (error) {
                console.log('Ida Trader Bot - MUTATION OBSERVER CALLBACK ERROR', error)
            }
        }

    }

    /**
     * 
     * @param {string} code 
     * @param {number} [entryThreshold] 
     * @param {number} [exitThreshold] 
     * @param {boolean} [experiment] 
     * @param {number} [profitThreshold]
     * @param {number} [lossThreshold]
     * @param {IntervalFlags | undefined} [tradingInterval] 
     * @param {IntervalFlags | undefined} [precisionInterval]
     * @param {boolean} [isCrypto]
     * @returns {string}
     */
    static visionLarge(
        code,
        entryThreshold = 3,
        exitThreshold = 2,
        experiment = true,
        profitThreshold,
        lossThreshold,
        tradingInterval,
        precisionInterval,
        isCrypto = false
    ) {
        const codeFormatted = code.toUpperCase()
        try {
            if (typeof ProjectStockVision !== 'function') {
                throw new Error('No projectVision class on window object')
            }

            const visionInstance = new ProjectStockVision.vision(codeFormatted, undefined, undefined, isCrypto, entryThreshold, exitThreshold, tradingInterval, precisionInterval)
            if (typeof visionInstance !== 'object') {
                throw new Error('object is not returned')
            }
            window.idaStockVision.settings[codeFormatted].experiment = experiment
            window.idaStockVision.settings[codeFormatted].profitThreshold = profitThreshold
            window.idaStockVision.settings[codeFormatted].lossThreshold = lossThreshold
            // window.idaStockVision.tools[`watch_${codeFormatted}`].call()
            visionInstance.watch()


            return `startup is done - ${codeFormatted}`
        } catch (error) {
            console.log(error.toString())
            return `startup failed - ${codeFormatted}`
        }
    }
    
    /**
     * 
     * @param {string} code 
     * @param {number} entry 
     * @param {number} exit 
     * @param {boolean} [experiment] 
     * @param {number} [profit] 
     * @param {number} [loss]
     * @returns {string}
     */
    static visionSmall(code, entry, exit, experiment = false, profit, loss) {
        return ProjectStockVision.visionLarge(`${code}_short`, entry, exit, experiment, profit, loss)
    }

    /**
     * 
     * @param {string} code 
     * @param {number} [entry]
     * @param {number} [exit] 
     * @param {boolean} [experiment] 
     * @param {number} [profit] 
     * @param {number} [loss] 
     * @param {IntervalFlags} [tradingInterval]
     * @returns {string}
     */
    static visionTiny(code, entry = 0.2, exit = 0.2, experiment = false, profit = 0.3, loss = 0.3, tradingInterval = '15min') {
        return ProjectStockVision.visionLarge(`${code}_tiny`, entry, exit, experiment, profit, loss, tradingInterval)
    }

    static visionShadow(code) {
        // make sure we can handle the volume of data points on the backend before using this
        return ProjectStockVision.visionLarge(`${code}_shadow`, 200, 100, true, undefined, undefined, '5min', 'none')
    }

    /**
     * 
     * @param {string} code 
     * @param {number} entryManualPrice 
     * @param {number} exitManualPrice 
     * @param {boolean} [isCrypto] 
     * @param {boolean} [experiment] 
     * @returns {string}
     */
    static visionManual(code, entryManualPrice, exitManualPrice, isCrypto, experiment = false) {
        const codeFormatted = code.toUpperCase()
        const visionInstance = new ProjectStockVision.vision(codeFormatted, entryManualPrice, exitManualPrice, isCrypto, undefined, undefined)
        if (typeof visionInstance !== 'object') {
            throw new Error('object is not returned')
        }
        window.idaStockVision.settings[codeFormatted].experiment = experiment
        // window.idaStockVision.tools[`watch_${codeFormatted}`].call()
        visionInstance.watch()

        return `manual startup is done - ${codeFormatted}`
    }

    /**
     * 
     * @param {string} code 
     * @param {number} smallEntry 
     * @param {number} smallExit 
     * @param {boolean} [smallExperiment] 
     * @param {number} [tinyEntry]
     * @param {number} [tinyExit]
     * @param {boolean} [tinyExperiment]
     * @returns {string[]}
     */
    static visionTinySmallLarge(code, smallEntry, smallExit, smallExperiment, tinyEntry, tinyExit, tinyExperiment) {
        return [
            ProjectStockVision.visionLarge(code),
            ProjectStockVision.visionSmall(code, smallEntry, smallExit, smallExperiment),
            ProjectStockVision.visionTiny(code, tinyEntry, tinyExit, tinyExperiment)
        ]
    }

     /**
     * 
     * @param {string} code 
     * @param {number} [tinyEntry] 
     * @param {number} [tinyExit]
     * @param {boolean} [tinyExperiment] 
     * @returns {string[]}
     */
    static visionTinyLarge(code, tinyEntry, tinyExit, tinyExperiment) {
        return [
            ProjectStockVision.visionLarge(code),
            ProjectStockVision.visionTiny(code, tinyEntry, tinyExit, tinyExperiment)
        ]
    }

    static visionTools() {
        return window.idaStockVision.tools
    }
    
    static visionSettings() {
        return window.idaStockVision.settings
    }
}

class StockVisionTrade {
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

    constructor() {}

    static questradeTradeProcess = () => {
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

    // static ibkrTradeProcess = () => {
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

    static constants = {
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
        localStorageName: 'stockvisionTrade',
        pingPongInterval: 1000*5,
        orderInspectionDelay: 1000*60*1,
        modifyThreshold: (60/5) * 0.25, // keep within 1 minute for now
        questrade: {
            // Make sure the element(s) are not triggering network events to not crash the browser eg menu buttons, page scroll, etc
            firstElement: () => document.querySelector('shell-root').querySelector('shell-header button'),
            secondElement: () => document.querySelector('shell-root').querySelector('shell-header button'),
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
            tradeProcess: this.questradeTradeProcess(),
        },
        ibkr: {}
    }

    /**
     * 
     * @returns {SVisionTrade}
     */
    static getBrokerageVariables = () => {
        // domain/brokername, accountId, keepAwakeXpaths,
        const host = location.host.includes('questrade') ? 'questrade' : 'ibkr'
        const storage = localStorage.getItem(this.constants.localStorageName) !== null 
            ? JSON.parse(localStorage.getItem(this.constants.localStorageName)) 
            : undefined
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
    static defaultBrokerageVariables = (securities, accountId) => {
        // securityIds, capital, accountId
        const storage = localStorage.getItem(this.constants.localStorageName) !== null 
            ? JSON.parse(localStorage.getItem(this.constants.localStorageName)) 
            : {}
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

        this.storeBrokerageVariables(storage)
    }

    static storeBrokerageVariables = (objectToStore) => {
        localStorage.setItem(this.constants.localStorageName, JSON.stringify(objectToStore))
    }

    static backUp = () => {
        // securities, orders and orderHistory for now
        const idaStockVisionTrade = window.idaStockVisionTrade
        const storage = this.getBrokerageVariables()
        storage.orders = idaStockVisionTrade.orders
        storage.orderHistory = idaStockVisionTrade.orderHistory
        storage.codes = idaStockVisionTrade.codes
        storage.securities = idaStockVisionTrade.securities

        this.storeBrokerageVariables(storage)
    }

    /**
     * 
     * @param {string} code 
     * @param {number} capital 
     * @param {number} highRiskThreshold 
     */
    static setCodeSettings = (code, capital = 5000, highRiskThreshold = 0.5) => {
        const idaStockVisionTrade = window.idaStockVisionTrade
        idaStockVisionTrade.codes[code.toUpperCase()] = {
            capital,
            highRiskThreshold
        }

        this.backUp()
    }

    /**
     * 
     * @param {string} brokerage 
     * @returns {string | undefined}
     */
    static getAccessToken = (brokerage) => {
        let accessToken = undefined
        switch(brokerage) {
            case 'questrade':
                const tokenObject = Object.values(sessionStorage)
                    .find((item) => item.includes(this.constants.questrade.tradeProcess.scopeToFindAccessToken))
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
    static keepAwake = (firstElement, secondElement, stop = false) => {
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

    static pollLocalServer = () => {
        try {
            const idaStockVisionTrade = window.idaStockVisionTrade
            const brokerageName = idaStockVisionTrade.brokerage.name
            idaStockVisionTrade.keepAwakeInstances = this.keepAwake(this.constants[brokerageName].firstElement(), this.constants[brokerageName].secondElement())
            const intervalCallback = async () => {
                try {
                    if (idaStockVisionTrade.pollServerInProgress) {
                        return
                    }
                    idaStockVisionTrade.pollServerInProgress = true
                    const payload = new URLSearchParams()
                    payload.set('brokerageName', brokerageName)
                    const resp = await fetch(`${this.constants.localServer.serverUrl}/trader/tradeCheck?${payload.toString()}`, {
                        method: 'GET',
                        mode: 'cors',
                    })
                    /** @type {TradeCheckResponse} */
                    const formattedResp = await resp.json()
                    if (Array.isArray(formattedResp) && formattedResp.length > 0) {
                        window.idaStockVisionTrade.orders.push(...formattedResp)
                        idaStockVisionTrade.pollServerInProgress = false
                        this.backUp()
                        // backup order data in localstorage
                        // start/queue trade operation
                        this.processOrderQueue()
                        return
                    }
                    if (!idaStockVisionTrade.processOrderQueueInProgress && !idaStockVisionTrade.investigateOrderQueueInProgress) {
                        this.investigateOrderQueue()
                    }
                    
                } catch (error) {
                    const errorMessage = ['Ida Trader Bot - POLL LOCAL SERVER', error.toString()]
                    console.log(...errorMessage)
                    if (idaStockVisionTrade.pollServerErrorCount === 0) {
                        this.notify(errorMessage.join('-'))
                        idaStockVisionTrade.pollServerErrorCount++
                    }
                } finally {
                    idaStockVisionTrade.pollServerInProgress = false
                }
            }
            idaStockVisionTrade.pollServerInstance = window.setInterval(intervalCallback, this.constants.pingPongInterval)
            
        } catch (error) {
            console.log('Ida Trader Bot - POLL LOCAL SERVER', error)
        }
    }

    static stopPollLocalServer = () => {
        const idaStockVisionTrade = window.idaStockVisionTrade
        const [first, second] = idaStockVisionTrade.keepAwakeInstances
        clearInterval(window.idaStockVisionTrade.pollServerInstance)
        this.keepAwake(first, second, true)
    }

    /**
     * 
     * @param {string|number} price 
     * @param {number} capitalAmount 
     * @returns {number}
     */
    static sharesAmount = (price, capitalAmount) => {
        return Math.ceil(capitalAmount / Number(price))
    }
    
    /**
     * 
     * @param {string} primaryCode 
     * @returns {Promise<Response>} 
     */
    static priceCheck = (primaryCode) => {
        const payload = new URLSearchParams()
        payload.set('primaryCode', primaryCode)
        return fetch(`${this.constants.localServer.serverUrl}/trader/priceCheck?${payload.toString()}`, {
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
    static decimalPrecision = (num, decimalPlaces = 2) => {
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
     * @param {TradeOrder} order
     * @returns {string|number}
     */
    static priceDecision = (last, bid, ask, order) => {
        // seems like askPrice and Bid price from cboe might not always be available. plan for edge cases
        // in the beiginning of the trading day the last price of a CDR can be 0
        const isTinyOrder = order.code.includes('_TINY')
        const missingBidOrAskPrice = [ask, bid].some((price) => price === undefined)
        let lastPrice = Number(last)
        const bidPrice = Number(bid)
        const askPrice = Number(ask)
        const parametersHasZero = [bidPrice, askPrice].some((price) => price === 0)
        if (lastPrice === 0) {
            lastPrice = bidPrice
        }
        const lastPriceInMiddle = lastPrice >= bidPrice && lastPrice <= askPrice
        const midAskBidPrice = this.decimalPrecision((bidPrice + askPrice)/2)
        if (parametersHasZero) {
            throw new Error('zero value exists for at least one of the parameters (bidPrice, askPrice)')
        }
        if (isTinyOrder) {
            if (!order.position) {
                return this.decimalPrecision(Math.max(askPrice,bidPrice))
            }

            return this.decimalPrecision(Math.min(askPrice,bidPrice))
        }
        if (!missingBidOrAskPrice && !lastPriceInMiddle) {
            return midAskBidPrice
        }

        return this.decimalPrecision(lastPrice) // decimal places from cboe is more than 2
    }

    /**
     * 
     * @param {string} code 
     * @returns {number | undefined}
     */
    static getLatestOrderedQuantity = (code) => {
        const idaStockVisionTrade = window.idaStockVisionTrade
        if (code in idaStockVisionTrade.orderHistory) {
            return idaStockVisionTrade.orderHistory[code].quantity
        }

        return
    }

    /**
     * 
     * @param {string} message 
     * @param {string} subject 
     * @param {string} brokerageName 
     */
    static notify = async (message, subject = this.constants.notification.subjectGeneral, brokerageName = window.idaStockVisionTrade.brokerage.name) => {
        try {
            let brokerageSubject = `${subject} (${brokerageName})`
            const queryParams = new URLSearchParams()
            queryParams.set('subject', brokerageSubject)
            queryParams.set('message', message)
            fetch(`${this.constants.cloudServer.serverUrl}${this.constants.serverApi.notify}?${queryParams.toString()}`, {
                method: 'POST',
            })
        } catch (error) {
            
        }
    }

    /**
     * 
     * @param {TradeOrder[]} orders 
     * @param {string[]} specificCodes 
     * 
     */
    static getProfitLossReturn = (orders = [], specificCodes = []) => {
        // TO-DO switch out profitLoss percentage for geometric mean https://www.investopedia.com/terms/g/geometricmean.asp
        let profitLossAmount = 0
        let profitLossPercentage = 0
        const breakDown = []
        const specificCodesUppercase = specificCodes.map(i => i.toUpperCase())
        /** @type {{[key:string]: TradeOrder}} */
        const orderIdMap = orders.reduce((previousValue, currentValue,) => {
            previousValue[currentValue.orderId] = currentValue
            return previousValue
        }, {})

        orders
            .filter((order) => order.position === false && (specificCodes.length === 0 || specificCodesUppercase.includes(order.code)))
            .forEach((order) => {
                const entryOrder = orders.filter(i => i.code === order.code && Date.parse(i.timeSubmitted) < Date.parse(order.timeSubmitted)).at(-1)
                if (!entryOrder) {
                    return
                }
                const entryPrice = Number(entryOrder.priceSubmitted)
                const exitPrice = Number(order.priceSubmitted)
                const entryCost = entryPrice * order.quantity
                const exitIncome = exitPrice * order.quantity
                const percentageDifference = ((exitPrice - entryPrice)/entryPrice) * 100
                const profitLoss = exitIncome - entryCost
                const date = new Date(order.timeSubmitted)
                const dateDisplay = 
                    `${date.getDay()}/${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`
                const capitalUtilization = entryOrder.downwardVolatility ? 'half' : 'full'

                profitLossAmount += profitLoss
                profitLossPercentage += percentageDifference
                breakDown.push([
                    `${percentageDifference.toFixed(2)}%`,
                    profitLoss.toFixed(2),
                    order.code,
                    dateDisplay,
                    capitalUtilization
                ])
            })
        
        return {profitLossAmount, profitLossPercentage, breakDown}
    }

    static fixBrokenOrder = (orderId) => {
        if (typeof orderId !== 'string' || orderId === '') {
            throw new Error('not a string')
        }
        const order = window.idaStockVisionTrade.orders.find(order => order.orderId === orderId)
        if (order !== undefined) {
            order.executed = true
            return order
        }

        return
    }

    static processOrderQueue = async () => {
        //always store orders in localstorage as backup in case of forced logout
        const idaStockVisionTrade = window.idaStockVisionTrade
        if (idaStockVisionTrade.processOrderQueueInProgress) {
            idaStockVisionTrade.newOrdersReceived = true
            return
        }
        idaStockVisionTrade.processOrderQueueInProgress = true
        const orders = idaStockVisionTrade.orders.filter((order) => (order.accepted === undefined || order.accepted === false))
        const brokerageName = idaStockVisionTrade.brokerage.name
        if (orders.length === 0) {
            idaStockVisionTrade.processOrderQueueInProgress = false
            return 
        }

        // sequential promise fulfliment as forEach doe not respect asyc/await
        for(const order of orders) {
            try {
                const action = order.position === true ? this.constants[brokerageName].trade.buy : this.constants[brokerageName].trade.sell
                const price = this.priceDecision(order.last, order.bid_price, order.ask_price, order)
                const defaultCapital = idaStockVisionTrade.codes[order.code].capital
                const lowRiskCapital = defaultCapital * idaStockVisionTrade.codes[order.code].highRiskThreshold
                const realCapital = order.downwardVolatility ? lowRiskCapital : defaultCapital
                const quantity = order.position === true 
                    ? this.sharesAmount(price, realCapital) 
                    : this.getLatestOrderedQuantity(order.code)
                const securityId = idaStockVisionTrade.securities[order.primaryCode].securityId
                if (quantity === undefined) {
                    throw new Error(`no quantity to process order - ${order.code}`)
                }
                if (securityId === undefined) {
                    throw new Error(`no security Id to process order - ${order.code}`)
                }
                const accountId = idaStockVisionTrade.accountId
                const accessToken = this.getAccessToken(brokerageName)
                const now = new Date().toISOString()
                const res = await this.constants[brokerageName].tradeProcess.submit.fetch(accessToken,securityId,accountId,action,quantity,price)
                /** @type {QuestradeSubmitResponse} */
                const resFormatted = await res.json()
                if (this.constants[brokerageName].trade.orderId in resFormatted) {
                    // setup order object with FE default properties it needs later
                    order.accepted = true // assume it's been accepted with the return of an orderId
                    order.timeSubmitted = now
                    order.orderId = resFormatted[this.constants[brokerageName].trade.orderId]
                    order.quantity = quantity
                    order.priceSubmitted = price
                    order.checkCount = 0
                    order.executed = false
                    order.modify = false
                    order.partialExecution = false
                    if (order.position === false) {
                        order.entryOrderId = idaStockVisionTrade.orderHistory[order.code]?.orderId
                    }
                    idaStockVisionTrade.orderHistory[order.code] = {
                        quantity,
                        orderId: order.orderId
                    }
                    // backup order data in localstorage
                    this.backUp()
                } else {
                    throw new Error(`no orderId returned - ${order.code} - ${JSON.stringify(resFormatted)}`)
                }

            } catch (error) {
                const errorMessage = ['Ida Trader Bot - PROCESS ORDER QUEUE', error.toString()]
                console.log(...errorMessage)
                this.notify(errorMessage.join('-'))
                order.accepted = true
                order.executed = true
                // backup order data in localstorage
                this.backUp()
                // notify for manual intervention
            }
        }

        idaStockVisionTrade.processOrderQueueInProgress = false

        if (idaStockVisionTrade.newOrdersReceived) {
            idaStockVisionTrade.newOrdersReceived = false
            this.processOrderQueue()
            return
        }
        this.investigateOrderQueue(true)
        
    }

    /**
     * 
     * @param {boolean} defer 
     * @returns 
     */
    static investigateOrderQueue = async (defer = false) => {
        const idaStockVisionTrade = window.idaStockVisionTrade
        if (idaStockVisionTrade.investigateOrderQueueInProgress) {
            return
        }

        if (defer) {
            window.setTimeout(this.investigateOrderQueue, this.constants.orderInspectionDelay)
            return
        }

        idaStockVisionTrade.investigateOrderQueueInProgress = true
        const orders = idaStockVisionTrade.orders
            .filter((order) => (order.accepted === true && order.executed === false && order.modify === false))
        if (orders.length === 0) {
            idaStockVisionTrade.investigateOrderQueueInProgress = false
            return
        }

        
        try {
            let orderToModifyExist = false
            const fromDateISO = orders.at(0).timeSubmitted
            const brokerageName = idaStockVisionTrade.brokerage.name
            const orderStatuses = this.constants[brokerageName].trade.orderStatus
            const accessToken = this.getAccessToken(brokerageName)
            const res = await this.constants[brokerageName].tradeProcess.orders.fetch(accessToken,fromDateISO)
            /** @type {QuestradeOrdersResponse} */
            const formattedRes = await res.json()
            /** @type {{[key: string]: QuestradeOrder}} */
            const brokerageOrdersObject = formattedRes.data.reduce((previous, current) => {
                previous[current[this.constants[brokerageName].trade.orderId]] = current
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
                            this.confirmOrderWithLink(order.confirmationLink, order.quantity)
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
                            const isTinyCode = order.code.includes('_TINY') && !order.immediateExecution
                            const localModifyThreshold = isTinyCode ? (60/5) * 60 : this.constants.modifyThreshold
                            if (order.checkCount >= localModifyThreshold) {
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
            this.backUp()
            
            idaStockVisionTrade.investigateOrderQueueInProgress = false
            if (orderToModifyExist) {
                this.modifyOrders()
            }
            // you can trigger modifying orders around here
            // polling will trigger this function
        } catch (error) {
            const errorMessage = ['Ida Trader Bot - INVESTIGATE ORDER QUEUE', error.toString()]
            console.log(...errorMessage)
            this.notify(errorMessage.join('-'))
            idaStockVisionTrade.investigateOrderQueueInProgress = false
        }
    }

    /**
     * 
     * @param {string} link 
     * @param {number | undefined} sharesQuantity 
     */
    static confirmOrderWithLink = (link, sharesQuantity) => {
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
            this.notify(errorMessage.join('-'))
        }
    }

    static modifyOrders = async () => {
        // get list of orders to modify
        // price check each
        // send modify request
        // update orderId
        // reset order details to be picked up for later investigation
        // investigate
        const idaStockVisionTrade = window.idaStockVisionTrade
        if (idaStockVisionTrade.modifyOrderQueueInProgress) {
            return
        }
        idaStockVisionTrade.modifyOrderQueueInProgress = true
        const orders = idaStockVisionTrade.orders
            .filter((order) => (order.accepted === true && order.executed === false && order.modify === true))
        const brokerageName = idaStockVisionTrade.brokerage.name
        if (orders.length === 0) {
            idaStockVisionTrade.modifyOrderQueueInProgress = false
            return
        }

        for(const order of orders) {
            try {
                const newPricesResponse = await this.priceCheck(order.primaryCode)
                /** @type {CboeQuoteResponse} */
                const newPriceJson = await newPricesResponse.json()
                const newPrice = this.priceDecision(newPriceJson.last, newPriceJson.bid_price, newPriceJson.ask_price, order)
                const defaultCapital = idaStockVisionTrade.codes[order.code].capital
                const lowRiskCapital = defaultCapital * idaStockVisionTrade.codes[order.code].highRiskThreshold
                const realCapital = order.downwardVolatility ? lowRiskCapital : defaultCapital
                const quantity = order.position === true 
                    ? this.sharesAmount(newPrice, realCapital) 
                    : this.getLatestOrderedQuantity(order.code)
                if (quantity === undefined) {
                    order.accepted = true
                    order.executed = true
                    throw new Error(`MODIFY ORDERS - no quantity to process - ${order.code}`)
                }
                if (newPrice === order.priceSubmitted) {
                    order.checkCount = 0
                    order.modify = false
                    continue
                }
                const accessToken = this.getAccessToken(brokerageName)
                const now = new Date().toISOString()
                const res = await this.constants[brokerageName].tradeProcess.modify.fetch(accessToken, order.orderId, idaStockVisionTrade.accountId, quantity, newPrice)
                /** @type {QuestradeSubmitResponse} */
                const formattedRes = await res.json()
                if (this.constants[brokerageName].trade.orderId in formattedRes) {
                    // reset order details for next investigation
                    order.accepted = true
                    order.timeSubmitted = now
                    order.priceSubmitted = newPrice
                    order.rootOrderId = order.orderId
                    order.orderId = formattedRes[this.constants[brokerageName].trade.orderId]
                    order.quantity = quantity
                    order.checkCount = 0
                    order.executed = false
                    order.modify = false
                    idaStockVisionTrade.orderHistory[order.code] = {
                        quantity,
                        orderId: order.orderId
                    }
                    // backup order data in localstorage
                    this.backUp()
                } else {
                    // most likely has executed already so let it go through another investigation cycle
                    order.checkCount = 0
                    order.modify = false
                    throw new Error(`MODIFY ORDERS - no orderId returned - ${order.code} - ${JSON.stringify(formattedRes)}`)
                }

            } catch (error) {
                const errorMessage = ['Ida Trader Bot - MODIFY ORDER QUEUE', error.toString()]
                console.log(...errorMessage)
                this.notify(errorMessage.join('-'))
            }
        }

        idaStockVisionTrade.modifyOrderQueueInProgress = false
    }

    static setUp = () => {
        try {
            const brokerageVariables = this.getBrokerageVariables()
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
                codes: {},
                tools: {
                    start: StockVisionTrade.start,
                    stop: StockVisionTrade.stop,
                    define: StockVisionTrade.defaultBrokerageVariables,
                    process: StockVisionTrade.processOrderQueue,
                    investigate: StockVisionTrade.investigateOrderQueue,
                    modify: StockVisionTrade.modifyOrders,
                    api: StockVisionTrade.constants.questrade.tradeProcess,
                    priceDecision: StockVisionTrade.priceDecision,
                    decimalPrecision: StockVisionTrade.decimalPrecision,
                    sharesAmount: StockVisionTrade.sharesAmount,
                    getAccessToken: StockVisionTrade.getAccessToken,
                    notify: StockVisionTrade.notify,
                    keepAwake: StockVisionTrade.keepAwake,
                    backUp: StockVisionTrade.backUp,
                    prisetCodeSettingsceDecision: StockVisionTrade.setCodeSettings,
                    getProfitLossReturn: StockVisionTrade.getProfitLossReturn,
                },
                ...brokerageVariables,
            }
            window.addEventListener('beforeunload', () => {
                // To-do swap beforunload even before deprecation - https://developer.chrome.com/docs/web-platform/page-lifecycle-api#testing_your_app_in_the_frozen_and_discarded_states
                const message = `Browser tab has been closed. Please investigate`
                this.notify(message, undefined, brokerageVariables.brokerage.name)
            })
        } catch (error) {
            console.log(`Ida Trader Bot - SETUP - ${error.toString()}`)
        }

    }

    static start = (noPolling = false) => {
        this.setUp()
        if (!noPolling) {
            this.pollLocalServer()
        }
    }

    static stop = () => {
        this.stopPollLocalServer()
    }

}