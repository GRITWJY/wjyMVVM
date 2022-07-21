const getRandom = require('../getRandom')
let mockRandom
beforeEach(()=>{
    mockRandom = jest.spyOn(Math, 'random')
})

afterEach(()=>{
    mockRandom.mockRestore()

})

test('getRandom 大于=0',() => {
    expect(getRandom()).toBeGreaterThanOrEqual(0)
})

test('Math.random 返回0.11 结果为1',() => {
    mockRandom.mockReturnValue(1)
    expect(getRandom()).toBe(10)
})


test('getRandom 小于10',() => {
    expect(getRandom()).toBeLessThan(10)
})
