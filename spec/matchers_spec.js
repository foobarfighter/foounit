if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.matchers', function (){

    describe('.throwError', function (){
      describe('.notMatch', function (){
        xit('asserts that an error is NOT thrown');
      });

      describe('.match', function (){
        it('asserts that an error is thrown', function (){
          var thrown = false
            , throwError = new footest.keywords.throwError();

          // Should pass because the block throws
          throwError.match('expected error', function (){
            thrown = true;
            throw new Error('expected error');
          });
          expect(thrown).to(beTrue);

          // Should throw an expected error
          try {
            throwError.match('should fail match', function (){});
            throw new Error('unexpected');
          } catch (e){
            expect(e.toString()).to(be, 'AssertionError:   "Missing expected exception. should fail match"');
          }

          // Should throw any error
          try {
            throwError.match(null, function (){});
            throw new Error('unexpected');
          } catch (e){
            expect(e.toString()).to(be, 'AssertionError:   "Missing expected exception (Error)."');
          }
        });
      });
    });

    describe('.beGt', function (){
      describe('.notMatch', function (){
        xit('asserts expected is NOT greater than actual');
      });
      describe('.match', function (){
        xit('asserts expected is greater than actual');
      });
    });

    describe('.beLt', function (){
      describe('.notMatch', function (){
        xit('asserts that expected is NOT less than actual');
      });
      describe('.match', function (){
        xit('asserts expected is less than actual');
      });
    });

    describe('.beTrue', function (){
      describe('.notMatch', function (){
        xit('asserts that actual is !== true');
      });

      describe('.match', function (){
        it('asserts that actual is === true', function (){
          var matcher = new footest.keywords.beTrue();
          matcher.match(true, true);

          expect(function (){
            matcher.match('unused', false);
          }).to(throwError);
        });
      });
    });

    describe('.beFalse', function (){
      describe('.notMatch', function (){
        xit('asserts that actual is !== false');
      });
      describe('.match', function (){
        xit('asserts that actual is === false');
      });
    });

    describe('.include', function (){
      describe('.notMatch', function (){
        xit('asserts that the actual array does NOT have an element === to expected');
      });
      describe('.match', function (){
        xit('asserts that the actual array has an element === to expected');
      });
    });

    describe('.be', function (){
      describe('.notMatch', function (){
        xit('does NOT ===');
      });

      describe('.match', function (){
        it('does a strict equal', function (){
          var matcher = new footest.keywords.be();
          matcher.match('a', 'a');

          var thrown;
          try { matcher.match(undefined, null); }
          catch(e) { thrown = e; }
          if (!thrown){throw new Error('expected error to be thrown');}
        });
      });
    });

    describe('equal', function (){
      describe('.notMatch', function (){
        xit('does NOT deep equal');
      });

      describe('.match', function (){
        it('does a deep ==', function (){
          var value = [1, { foo: 'bar' }, 3]
            , matcher = new footest.keywords.equal();
          matcher.match(value, value.concat());

          var thrown;
          try { matcher.match(value, value.concat([1])); }
          catch(e) { thrown = e; }
          if (!thrown){throw new Error('expected error to be thrown');}
        });
      });
    });

  });
}});
