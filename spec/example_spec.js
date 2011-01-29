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
        example.setAfters([
          function (){ log.push('after1'); }
        , function (){ log.push('after2'); }
        ]);

        example.run();

        expect(log.length).to(be, 5);
        expect(log[0]).to(be, 'before1');
        expect(log[1]).to(be, 'before2');
        expect(log[2]).to(be, 'test');
        expect(log[3]).to(be, 'after2');
        expect(log[4]).to(be, 'after1');
      });

      describe('when a before fails', function (){

        it('fails the example', function (){
          var example = new footest.Example('test', function (){});
          example.setBefores([function (){
            throw new Error('fail');
          }]);
          example.run();
          expect(example.isFailure()).to(be, true);
        });

        it('runs the afters', function (){
          var example = new footest.Example('test', function (){});
          example.setBefores([function (){
            throw new Error('fail');
          }]);

          var afterCalled = false;
          example.setAfters([function (){
            afterCalled = true;
          }]);
          example.run();
          expect(example.isFailure()).to(be, true);
          expect(afterCalled).to(be, true);
        });
      });

      describe('when the test fails', function (){
        it('fails the test', function (){
          var example = new footest.Example('test', function (){
            throw new error('fail');
          });
          example.run();
          expect(example.isFailure()).to(be, true);
        });

        it('runs the afters', function (){
          var example = new footest.Example('test', function (){
            throw new error('fail');
          });

          var afterCalled = false;
          example.setAfters([
            function (){ afterCalled = true; }
          ]);

          example.run();
          expect(example.isFailure()).to(be, true);
          expect(afterCalled).to(be, true);
        });
      });

      describe('when the after throws', function (){
        it('throws', function (){
          var example = new footest.Example('test', function (){});
          example.setAfters([function (){
            throw new Error('expected');
          }]);

          var thrown;
          try {
            example.run();
            throw new Error('unexpected');
          } catch (e){
            thrown = e;
          }
          expect(thrown.message).to(be, 'expected');
        });
      });
    });
  });
}});
