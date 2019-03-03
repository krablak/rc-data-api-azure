const { readAsJson } = require('../dist/RcDataApiHttpTrigger/data')
const { toClosuresFromHighways, toClosuresFromRoads1, toClosuresFromRoads23 } = require('../dist/RcDataApiHttpTrigger/converters')

var assert = require('assert')

describe('Parse highways data', function () {
    it('Parse highways_planned_23_2_2019.json', function () {
        let data = readAsJson(__dirname, 'data', 'highways_planned_23_2_2019.json')
        let parsed = toClosuresFromHighways(data)
        assert.equal(parsed.length, 4)
    })
    it('Parse highways_current_23_2_2019.json', function () {
        let data = readAsJson(__dirname, 'data', 'highways_current_23_2_2019.json')
        let parsed = toClosuresFromHighways(data)
        assert.equal(parsed.length, 31)
    })
    it('Parse highways_single.1.json', function () {
        let data = readAsJson(__dirname, 'data', 'highways_single.1.json')
        let parsed = toClosuresFromHighways(data)
        assert.equal(parsed.length, 1)
    })
});

describe('Parse R1 data', function () {
    it('Parse roads_planned_23_2_2019.json', function () {
        let data = readAsJson(__dirname, 'data', 'roads_planned_23_2_2019.json')
        let parsed = toClosuresFromRoads1(data)
        assert.equal(parsed.length, 172)
    })
    it('Parse roads_current_23_2_2019.json', function () {
        let data = readAsJson(__dirname, 'data', 'roads_current_23_2_2019.json')
        let parsed = toClosuresFromRoads1(data)
        assert.equal(parsed.length, 556)
    })
});

describe('Parse R23 data', function () {
    it('Parse roads2and3_all_23_2_2019.json', function () {
        let data = readAsJson(__dirname, 'data', 'roads2and3_all_23_2_2019.json')
        let parsed = toClosuresFromRoads23(data)
        assert.equal(parsed.length, 562)
    })
    it('Parse roads23-single.json', function () {
        let data = readAsJson(__dirname, 'data', 'roads23-single.json')
        let parsed = toClosuresFromRoads23(data)
        assert.equal(parsed.length, 1)
    })
    it('Parse roads24-single.json', function () {
        let data = readAsJson(__dirname, 'data', 'roads24-single.json')
        let parsed = toClosuresFromRoads23(data)
        assert.equal(parsed.length, 1)
    })
});


