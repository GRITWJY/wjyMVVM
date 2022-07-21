const {delay, delayPromise} = require('../index')

test('callback 被执行',done=>{
    expect.assertions(1);
    const callback = () => {
        console.log('callback exec')
        expect(true).toBe(true);
        done();
    };
    delay(callback);
})

test('deplayPromise 被执行',()=>{
    expect.assertions(1);
    const callback = () => 1;
    return delayPromise(callback).then(res=>{
        expect(res).toBe(1)
    })
})

test('deplayPromise async 被执行',async ()=>{
    expect.assertions(1);
    const callback = () => 1;
    const res = await delayPromise(callback)
    expect(res).toBe(1)
})
