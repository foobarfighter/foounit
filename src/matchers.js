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

    // FIXME: Node's assert.throws has a bug in which the expected
    //        error is not checked against the error message if
    //        the expected error is a string
    //        This looks like it may be fixed in master 2/3/2011
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
