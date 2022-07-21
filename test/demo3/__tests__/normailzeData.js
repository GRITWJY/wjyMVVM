jest.mock('../getData')



const normailzeData = require('../normalizeData')
const getData = require('../getData')

getData.mockReturnValue({
    name:'wjy'
})

test('normalizeData.js 测试',() => {
    const data = normailzeData().data;
    expect(data).toEqual({
        name:'wjy'
    });
})
