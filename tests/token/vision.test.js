//@ts-check
const { ProjectStockVision } = require('@/token/scripts/components/stockvision')

describe('Trade', () => {
    test('random test', () => {
        expect(ProjectStockVision.vision.sanitizePrice('$12,000')).toBe('12000')
    })
})