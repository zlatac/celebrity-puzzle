//@ts-check
const { ProjectStockVision } = require('@/token/scripts/components/stockvision')

describe('Trade', () => {
    test('random test', () => {
        const Vision = ProjectStockVision.vision
        expect(ProjectStockVision.vision.sanitizePrice('$12,000')).toBe('12000')
        expect(Vision.PriceAnalysis[Vision.PriceAnalysis.REVERSED_ACTION['in']]).toBe(true)
        expect(Vision.numberIsWithinOneDirectionalRange(0.3,0.61,0.3)).toBe(false)
        
    })
})