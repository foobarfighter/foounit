if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

/**
 * Asserts that a function throws an error
 */
foounit.addKeyword('throwError', function (){
  this.match = function (actual, expected){
    // actual == block
    // expected == error
    assert.throws(actual, expected);
  }

  this.notMatch = function (actual, expected){
    // actual == block
    // expected == error
    assert.doesNotThrow(actual, expected);
  }
});

/**
 * Asserts type and object
 */
foounit.addKeyword('be', function (){
  this.match = function (actual, expected){
    assert.strictEqual(actual, expected);
  }

  this.notMatch = function (actual, expected){
    assert.notStrictEqual(actual, expected);
  }
});

/**
 * Assert that actual is greater than expected
 */
foounit.addKeyword('beGt', function (){
  this.format = function (actual, expected, not){
    var notStr = not ? ' not' : '';
    return 'Expected ' + actual + ' to' + notStr  +  ' be greater than ' + expected;
  }

  this.match = function (actual, expected){
    if (actual > expected){ return; }
    assert.fail(actual, expected, this.format(actual, expected), '>', this.match);
  }

  this.notMatch = function (actual, expected){
    if (actual > expected){
      assert.fail(actual, expected, this.format(actual, expected, true), '<=', this.notMatch);
    }
  }
});

/**
 * Assert that actual is less than expected
 */
foounit.addKeyword('beLt', function (){
  this.format = function (actual, expected, not){
    var notStr = not ? ' not' : '';
    return 'Expected ' + actual + ' to' + notStr  +  ' be less than ' + expected;
  }

  this.match = function (actual, expected){
    if (actual < expected){ return; }
    assert.fail(actual, expected, this.format(actual, expected), '<', this.match);
  }

  this.notMatch = function (actual, expected){
    if (actual < expected){
      assert.fail(actual, expected, this.format(actual, expected, true), '<=', this.notMatch);
    }
  }
});

/**
 * Asserts true === actual
 */
foounit.addKeyword('beTrue', function (){
  // expected is unused
  this.notMatch = function (actual){
    assert.notStrictEqual(actual, true);
  }

  // expected is unused
  this.match = function (actual){
    assert.strictEqual(actual, true);
  }
});

/**
 * Asserts true === actual
 */
foounit.addKeyword('beFalse', function (){
  // expected is unused
  this.notMatch = function (actual){
    assert.notStrictEqual(actual, false);
  }

  // expected is unused
  this.match = function (actual){
    assert.strictEqual(actual, false);
  }
});

/**
 * Asserts deep equality
 */
foounit.addKeyword('equal', function (){
  this.match = function (actual, expected){
    assert.deepEqual(actual, expected);
  }

  this.notMatch = function (actual, expected){
    assert.notDeepEqual(actual, expected);
  }
});
