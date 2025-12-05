//@ts-check
const { StockVisionTrade } = require('@/token/scripts/components/stockvision')

describe('Trade', () => {
    test('random test', () => {
        expect(StockVisionTrade.priceDecision('24', '23', '25', {code: 'SMCI'})).toBe(24)
    })
})