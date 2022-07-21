const delayPromise = require('../index')
test('deplayPromise 被执行',()=>{
    expect.assertions(1);
    const callback = jest.fn().mockReturnValue(1);
    return delayPromise(callback).then(res=>{
        expect(res).toBe(1)
    })
})

