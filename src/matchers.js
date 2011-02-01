if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

/**
 * Asserts that a function throws an error
 */
foounit.addKeyword('throwError', function (){
  this.match = function (expected, actual){
    // actual == block
    // expected == error
    expected = expected || Error;
    assert.throws(actual, expected);
  }
});

/**
 * Asserts type and object
 */
foounit.addKeyword('be', function (){
  this.match = function (expected, actual){
    assert.strictEqual(actual, expected);
  }
});

/**
 * Asserts === on true
 */
foounit.addKeyword('beTrue', function (){
  // expected is unused
  this.match = function (expected, actual){
    assert.strictEqual(actual, true);
  }
});

/**
 * Asserts deep equality
 */
foounit.addKeyword('equal', function (){
  this.match = function (expected, actual){
    assert.deepEqual(actual, expected);
  }
});
