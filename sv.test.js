const { milk } = require('./www/token/scripts/components/stockvision')
// import Milk from './www/token/scripts/components/stockvision'

test('random test', () => {
    expect(milk.sanitizePrice('$12,000')).toBe('12000')
})