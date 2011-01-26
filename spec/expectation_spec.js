if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function(kw) { with(kw){

  describe('foounit.Expectation', function (){
    describe('.to', function (){
      it('uses a matcher to compare "expected" with "actual"', function (){
        var expectation = new footest.Expectation('a');
        var matcher = function (){
          this.match = function (expected, actual){
            if (expected != actual){
              throw new Error('expected "' + expected + '" but got "' + actual + '"');
            }
          }
        };
        expectation.to(matcher, 'a');

        try {
          expectation.to(matcher, 'b');
          throw new Error('shouldnt get here');
        } catch (e){
          if (e.message != 'expected "b" but got "a"'){
            throw new Error(e);
          }
        }
      });
    });
  });

}});
