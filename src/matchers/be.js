foounit.matchers.be = function (){
  this.match = function (expected, actual){
    if (expected === actual){ return true; }
    throw new Error('expected "' + expected + '" but got "' + actual + '"');
  }
}
