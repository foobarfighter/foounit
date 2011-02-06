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
    assert.throws(actual, expected);
  }

  this.notMatch = function (expected, actual){
    // actual == block
    // expected == error
    assert.doesNotThrow(actual, expected);
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
 * Assert that a number (or object) is greater
 * than another number (or object).
 */
foounit.addKeyword('beGt', function (){
  this.format = function (actual, expected, not){
    var notStr = not ? ' not' : '';
    return 'Expected ' + actual + ' to' + notStr  +  ' be greater than ' + expected;
  }

  this.match = function (actual, expected){
    if (actual > expected){ return; }
    assert.fail(actual, expected, this.format(actual, expected), "beGt", this.match);
  }

  this.notMatch = function (actual, expected){
    if (actual > expected){
      assert.fail(actual, expected, this.format(actual, expected, true), 'notBeGt', this.notMatch);
    }
  }
});

/**
 * Asserts === on true
 */
foounit.addKeyword('beTrue', function (){
  // expected is unused
  this.notMatch = function (expected, actual){
    assert.notStrictEqual(actual, true);
  }

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
