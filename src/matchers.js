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
 * Asserts that actual === null
 */
foounit.addKeyword('beNull', function (){
  this.match = function (actual){
    assert.strictEqual(actual, null);
  }

  this.notMatch = function (actual, expected){
    assert.notStrictEqual(actual, null);
  }
});

/**
 * Asserts that actual === undefined
 */
foounit.addKeyword('beUndefined', function (){
  this.match = function (actual){
    assert.strictEqual(actual, undefined);
  }

  this.notMatch = function (actual, expected){
    assert.notStrictEqual(actual, undefined);
  }
});

/**
 * Assert that actual is greater than expected
 */
foounit.addKeyword('beGt', function (){
  this.match = function (actual, expected){
    if (actual > expected){ return; }
    assert.fail(actual, expected, null, '>');
  }

  this.notMatch = function (actual, expected){
    if (actual <= expected){ return; }
    assert.fail(actual, expected, null, '<=');
  }
});

/**
 * Assert that actual is less than expected
 */
foounit.addKeyword('beLt', function (){
  this.match = function (actual, expected){
    if (actual < expected){ return; }
    assert.fail(actual, expected, null, '<');
  }

  this.notMatch = function (actual, expected){
    if (actual >= expected){ return };
    assert.fail(actual, expected, null, '>=');
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

/**
 * Asserts that actual has an element that === expected
 */
foounit.addKeyword('include', function (){
  this.find = function (actual, expected){
    var found = false;
    for (var i = 0; i < actual.length; ++i){
      if (actual[i] === expected){
        found = true;
        break;
      }
    }
    return found;
  }

  this.notMatch = function (actual, expected){
    if (!this.find(actual, expected)){ return; }
    assert.fail(actual, expected, null, 'is included in');
  }

  this.match = function (actual, expected){
    if (this.find(actual, expected)){ return; }
    assert.fail(actual, expected, null, 'is not included in');
  }
});
