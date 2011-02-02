if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function(kw) { with(kw){

  describe('foounit.Expectation', function (){
    describe('.to', function (){
      it('uses a matcher to assert "expected" equals "actual"', function (){
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

  describe('.toNot', function (){
    it('uses a matcher to assert that "expected" does not equal "actual"', function (){
        var expectation = new footest.Expectation('a');
        var matcher = function (){
          this.match = function (expected, actual){ /* noop */ }
          this.notMatch = function (expected, actual){
            if (expected == actual){
              throw new Error('expected "' + expected + '" but got "' + actual + '"');
            }
          }
        };

        expectation.toNot(matcher, 'b');

        expect(function (){
          expectation.toNot(matcher, 'a');
        }).to(throwError);
    });
  });
}});
