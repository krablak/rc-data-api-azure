const { parseValidityFromCustomFormats } = require('../dist/RcDataApiHttpTrigger/validityParser')

var assert = require('assert')

describe('Custom date formats validity parsing', function () {
    it('parseShortDate MM/YYYYY', function () {
        let validity = parseValidityFromCustomFormats(item('10/2016', '01/2018'))
        assert.equal(validity.from.getMonth(), 9)
        assert.equal(validity.from.getFullYear(), 2016)
        assert.equal(validity.to.getMonth(), 0)
        assert.equal(validity.to.getFullYear(), 2018)
    });
    it('parseShortDate M.YY', function () {
        let validity = parseValidityFromCustomFormats(item('10/16', '01/18'))
        assert.equal(validity.from.getMonth(), 9)
        assert.equal(validity.from.getFullYear(), 2016)
        assert.equal(validity.to.getMonth(), 0)
        assert.equal(validity.to.getFullYear(), 2018)
    });
    it('parseShortDate D.M.YYYY', function () {
        let validity = parseValidityFromCustomFormats(item('2.5.2016', '30.12.2020'))
        assert.equal(validity.from.getDate(), 2)
        assert.equal(validity.from.getMonth(), 4)
        assert.equal(validity.from.getFullYear(), 2016)
        assert.equal(validity.to.getDate(), 30)
        assert.equal(validity.to.getMonth(), 11)
        assert.equal(validity.to.getFullYear(), 2020)
    });
    it('parseShortDate 6 - 11/2016', function () {
        let validity = parseValidityFromCustomFormats(item('6 - 11/2016', undefined))
        assert.equal(validity.from.getDate(), 1)
        assert.equal(validity.from.getMonth(), 5)
        assert.equal(validity.from.getFullYear(), 2016)
        assert.equal(validity.to.getDate(), 30)
        assert.equal(validity.to.getMonth(), 10)
        assert.equal(validity.to.getFullYear(), 2016)
    });
    it('parseShortDate 1 - 2/2019', function () {
        let validity = parseValidityFromCustomFormats(item('1 -2/2019', undefined))
        assert.equal(validity.from.getDate(), 1)
        assert.equal(validity.from.getMonth(), 0)
        assert.equal(validity.from.getFullYear(), 2019)
        assert.equal(validity.to.getDate(), 28)
        assert.equal(validity.to.getMonth(), 1)
        assert.equal(validity.to.getFullYear(), 2019)
    });
});

function item(from, to) {
    return {
        properties: { ZAC_OMEZ: from, KON_OMEZ: to }
    }
}