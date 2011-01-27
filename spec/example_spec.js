if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.Example', function (){
    describe('run', function (){
      it('runs all befores, tests and afters in order', function (){
        var log = [];

        var example = new footest.Example('test', function (){
          log.push('test');
        });
        example.setBefores([
          function (){ log.push('before1'); }
        , function (){ log.push('before2'); }
        ]);

        example.run();

        expect(log.length).to(be, 3);
        expect(log[0]).to(be, 'before1');
        expect(log[1]).to(be, 'before2');
        expect(log[2]).to(be, 'test');
      });

      describe('when a before fails', function (){
        it('fails the example', function (){
        });
      });

      describe('when the test fails', function (){
        it('fails the test', function (){
        });
      });

      describe('when the after fails', function (){
        it('fails the test', function (){
        });
      });
    });
  });
}});
