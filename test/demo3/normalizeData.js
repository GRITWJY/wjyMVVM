const getData = require('./getData.js')

const normalizeData = () => {
    const data = getData();
    return {
        status:0,
        data
    }
}

module.exports = normalizeData
