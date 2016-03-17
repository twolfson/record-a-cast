// Load in dependencies
var assert = require('assert');
var recordAGif = require('../');

// Start our tests
describe('record-a-gif', function () {
  it('returns awesome', function () {
    assert.strictEqual(recordAGif(), 'awesome');
  });
});
