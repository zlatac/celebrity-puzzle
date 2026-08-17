//@ts-check
const { StockVisionTrade } = require('@/token/scripts/components/stockvision')

describe('Trade', () => {
    beforeEach(() => {
        window.idaStockVisionTrade = {}
        window.idaStockVisionTrade.accounts = {}
        window.idaStockVisionTrade.codes = {}
    })

    test('random test', () => {
        expect(StockVisionTrade.priceDecision('24', '23', '25', {code: 'SMCI'})).toBe(24)
    })

    test('create accounts', () => {
        StockVisionTrade.backUp = jest.fn()
        StockVisionTrade.setCodeSettings('gev_small', 300, StockVisionTrade.accountStrategy.WAVE, false, true)
        StockVisionTrade.createAccount(StockVisionTrade.accountType.CASH, StockVisionTrade.accountStrategy.WAVE, 'wave', 45)
        StockVisionTrade.createAccount(StockVisionTrade.accountType.RSP, StockVisionTrade.accountStrategy.GENERAL, 'gen', 95)
        const waveCash = StockVisionTrade.accountStrategyName(StockVisionTrade.accountStrategy.WAVE,StockVisionTrade.accountType.CASH)
        const genRsp = StockVisionTrade.accountStrategyName(StockVisionTrade.accountStrategy.GENERAL,StockVisionTrade.accountType.RSP)
        expect(window.idaStockVisionTrade.accounts[waveCash].id).toBe('wave')
        expect(window.idaStockVisionTrade.accounts[waveCash].accountNumber).toBe(45)
        expect(window.idaStockVisionTrade.accounts[waveCash].strategyType).toBe(StockVisionTrade.accountStrategy.WAVE)
        expect(window.idaStockVisionTrade.accounts[waveCash].accountType).toBe(StockVisionTrade.accountType.CASH)
        
        expect(window.idaStockVisionTrade.accounts[genRsp].id).toBe('gen')
        expect(window.idaStockVisionTrade.accounts[genRsp].accountNumber).toBe(95)
        expect(window.idaStockVisionTrade.accounts[genRsp].strategyType).toBe(StockVisionTrade.accountStrategy.GENERAL)
        expect(window.idaStockVisionTrade.accounts[genRsp].accountType).toBe(StockVisionTrade.accountType.RSP)

        expect(StockVisionTrade.getAccountId('GEV_SMALL')).toBe('wave')


    })
})