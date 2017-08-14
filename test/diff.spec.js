/* global describe it */
const assert = require('assert')
const diff = require('../src/diff')

const oldString = 'Hi\nBye!'
const newString = 'Hi\nAnd\nBye!'

describe('new Diff()', () => {
  describe('#getDiff(oldString, newString)', () => {
    it('compares two different strings and return an object with results', (cb) => {
      diff.getDiff(oldString, newString, (err, result) => {
        if (err) { throw new Error(err) }

        assert.equal(result.length, 3)

        assert.equal(result[0].value, 'Hi\n')
        assert.equal(result[0].added, undefined)

        assert.equal(result[1].removed, undefined)
        assert.equal(result[1].added, true)

        assert.equal(result[2].value, 'Bye!')
        assert.equal(result[2].added, undefined)
        cb()
      })
    })
  })
})
