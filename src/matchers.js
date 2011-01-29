if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

/**
 * Asserts type and object
 */
foounit.addKeyword('be', function (){
  this.match = function (expected, actual){
    assert.strictEqual(actual, expected);
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
