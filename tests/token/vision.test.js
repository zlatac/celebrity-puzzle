//@ts-check
const { ProjectStockVision } = require('@/token/scripts/components/stockvision')

describe('Vision', () => {
    test('random test', () => {
        const Vision = ProjectStockVision.vision
        expect(ProjectStockVision.vision.sanitizePrice('$12,000')).toBe('12000')
        expect(Vision.PriceAnalysis[Vision.PriceAnalysis.REVERSED_ACTION['in']]).toBe(true)
        expect(Vision.numberIsWithinOneDirectionalRange(0.3,0.61,0.3)).toBe(false)
        
    })

    describe('Bleeding intra profit', () => {
        const Vision = ProjectStockVision.vision
        const goodTime = new Date().setHours(12,0,0,0)
        const badTimeOne = new Date().setHours(9,32,0,0)
        const badTimeTwo = new Date().setHours(15,52,0,0)
        test('below threshold & profitable', () => {
            expect(Vision.intraBleedingProfit(343.6,343.46,343.88,345.2,0.6,true,goodTime)).toBeTruthy()
        })
        
        test('below threshold & no profit', () => {
            expect(Vision.intraBleedingProfit(343.6,343.46,343.88,345.2,0.6,false,goodTime)).toBeFalsy()
        })
        
        test('logic deactivated by threshold', () => {
            expect(Vision.intraBleedingProfit(343.6,343.46,343.88,345.2,0,true,goodTime)).toBeFalsy()
        })
        
        test('missing previous close price', () => {
            expect(Vision.intraBleedingProfit(343.6,undefined,343.88,345.2,0.6,true,goodTime)).toBeFalsy()
        })
        test('below threshold & profitable & missing open price', () => {
            expect(Vision.intraBleedingProfit(343.6,343.46,undefined,345.2,0.6,true,goodTime)).toBeTruthy()
        })
        test('below threshold & profitable & badtimeOne', () => {
            expect(Vision.intraBleedingProfit(343.6,343.46,343.88,345.2,0.6,true,badTimeOne)).toBeFalsy()
        })
        test('below threshold & profitable & badtimeTwo', () => {
            expect(Vision.intraBleedingProfit(343.6,343.46,343.88,345.2,0.6,true,badTimeTwo)).toBeFalsy()
        })
    })

     describe('loss threshold', () => {
        const PriceAnalysis = ProjectStockVision.vision.PriceAnalysis
        const goodTime = new Date().setHours(12,0,0,0)
        const badTimeOne = new Date().setHours(9,32,0,0)
        const badTimeTwo = new Date().setHours(15,52,0,0)
        const currentPrice = {price: 45, epochDate: goodTime, flags: [], date: ''}
        const currentPosition = {price: 70, _price: 70, position: true, epochDate: new Date().setHours(6,0,0,0), date: ''}
        
        test('regular loss at good time', () => {
            const code = 'amzn_intra'
            window.idaStockVision = {settings: {[code]: {lossThreshold: 0.7}}}
            const analysis = new PriceAnalysis([],currentPrice,currentPosition,false,Infinity,Infinity,'1hour','3min',code)
            expect(analysis.targetedLossAcquired(code)).toBeTruthy()
        })

        test('no loss at good time', () => {
            const code = 'amzn_intra'
            window.idaStockVision = {settings: {[code]: {lossThreshold: 0.7}}}
            currentPrice.price = 72
            const analysis = new PriceAnalysis([],currentPrice,currentPosition,false,Infinity,Infinity,'1hour','3min',code)
            expect(analysis.targetedLossAcquired(code)).toBeFalsy()
        })

        test('intra loss at bad time one', () => {
            const code = 'amzn_intra'
            window.idaStockVision = {settings: {[code]: {lossThreshold: 0.7}}}
            currentPrice.price = 50
            currentPrice.epochDate = badTimeOne
            const analysis = new PriceAnalysis([],currentPrice,currentPosition,false,Infinity,Infinity,'1hour','3min',code)
            expect(analysis.targetedLossAcquired(code)).toBeFalsy()
        })

        test('intra loss at bad time one', () => {
            const code = 'amzn_intra'
            window.idaStockVision = {settings: {[code]: {lossThreshold: 0.7}}}
            currentPrice.price = 50
            currentPrice.epochDate = badTimeTwo
            const analysis = new PriceAnalysis([],currentPrice,currentPosition,false,Infinity,Infinity,'1hour','3min',code)
            expect(analysis.targetedLossAcquired(code)).toBeFalsy()
        })
     })

     describe('intra threshold met', () => {
        const PriceAnalysis = ProjectStockVision.vision.PriceAnalysis
        const goodTime = new Date().setHours(13,0,0,0)
        const badTimeOne = new Date().setHours(9,32,0,0)
        const badTimeTwo = new Date().setHours(15,41,0,0)
        const currentPrice = {price: 45, epochDate: goodTime, flags: [], date: ''}
        const currentPosition = {price: 70, _price: 70, position: true, epochDate: new Date().setHours(6,0,0,0), date: ''}

        test('bad time one', () => {
            const code = 'amzn_intra'
            window.idaStockVision = {priceStore: {marketHighLowRange: {}}}
            // currentPrice.price = 50
            // currentPrice.epochDate = badTimeTwo
            const analysis = new PriceAnalysis([],currentPrice,currentPosition,false,Infinity,Infinity,'1hour','3min',code)
            expect(analysis.intraTargetedThresholdMet(badTimeOne)).toBeFalsy()
        })

        test('bad time two', () => {
            const code = 'amzn_intra'
            window.idaStockVision = {priceStore: {marketHighLowRange: {}}}
            // currentPrice.price = 50
            // currentPrice.epochDate = badTimeTwo
            const analysis = new PriceAnalysis([],currentPrice,currentPosition,false,Infinity,Infinity,'1hour','3min',code)
            expect(analysis.intraTargetedThresholdMet(badTimeTwo)).toBeFalsy()
        })
     })
})