if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

/**
 * Asserts that a function throws an error
 */
foounit.addMatcher('throwError', function (){
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
foounit.addMatcher('be', function (){
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
foounit.addMatcher('beNull', function (){
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
foounit.addMatcher('beUndefined', function (){
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
foounit.addMatcher('beGt', function (){
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
foounit.addMatcher('beLt', function (){
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
foounit.addMatcher('beTrue', function (){
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
 * Asserts that actual is truthy
 */
foounit.addMatcher('beTruthy', function (){
  this.notMatch = function (actual){
    if (!actual){ return };
    assert.fail('Expected "' + actual + '" to NOT be truthy');
  }

  this.match = function (actual){
    if (actual){ return; }
    assert.fail('Expected "' + actual + '" to be truthy');
  }
});

/**
 * Asserts true === actual
 */
foounit.addMatcher('beFalse', function (){
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
 * Asserts that actual is falsy
 */
foounit.addMatcher('beFalsy', function (){
  this.notMatch = function (actual){
    if (actual){ return; }
    assert.fail('Expected "' + actual + '" to NOT be falsy');
  }

  this.match = function (actual){
    if (!actual){ return; }
    assert.fail('Expected "' + actual + '" to be falsy');
  }
});

/**
 * Asserts deep equality
 */
foounit.addMatcher('equal', function (){
  var pSlice = Array.prototype.slice;

  var isArguments = function (value){
    return value && !!value.callee;
  }

  var exec = function (actual, expected, not){
    if (isArguments(actual)){
      actual = pSlice.call(actual);
    }

    if (isArguments(expected)){
      expected = pSlice.call(expected);
    }

    var deepEqualFunc = not ? 'notDeepEqual' : 'deepEqual';
    assert[deepEqualFunc](expected, actual);
  }

  this.match = function (actual, expected){
    exec(actual, expected, false);
  }

  this.notMatch = function (actual, expected){
    exec(actual, expected, true);
  }
});

/**
 * Asserts that actual has an element that === expected
 */
foounit.addMatcher('include', function (){
  var find = function (actual, expected){
    if (!expected || (expected.constructor != Array && !expected.callee)){
      expected = [expected];
    }

    for (var i = 0; i < expected.length; ++i){
      var found = false;
      for (var j = 0; j < actual.length; ++j){
        if (expected[i] === actual[j]){
          found = true;
          break;
        }
      }
      if (!found){ return false; }
    }

    return true;
  }

  this.notMatch = function (actual, expected){
    if (!find(actual, expected)){ return; }
    assert.fail(actual, expected, null, 'is included in');
  }

  this.match = function (actual, expected){
    if (find(actual, expected)){ return; }
    assert.fail(actual, expected, null, 'is not included in');
  }
});

foounit.addMatcher('match', function (){
  this.notMatch = function (actual, expected){
    if (!expected.exec(actual)){ return; }
    assert.fail(actual, expected, null, expected + ' matches');
  }

  this.match = function (actual, expected){
    if (expected.exec(actual)){ return; }
    assert.fail(actual, expected, null, expected + ' does not match');
  }
});

