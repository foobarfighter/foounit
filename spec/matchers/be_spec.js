if (typeof global !== 'undefined'){
  var foounit = require('../../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.matchers.be', function (){
    describe('.be', function (){
      describe('when the actual and expected are ===', function (){
        it('returns true', function (){
          var matcher = new footest.matchers.be();
          if (matcher.match('a', 'a') !== true){
            throw new Error('matcher should have matched');
          }
        });
      });

      describe('when the actual and expected are NOT ===', function (){
        it('returns false', function (){
          var matcher = new footest.matchers.be();
          try {
            matcher.match(undefined, null);
            throw new Error('shouldnt get here');
          } catch (e){
            // expected
          }
        });
      });
    });
  });
}});
