if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.matchers', function (){

    describe('.throwError', function (){
      describe('.match', function (){
        it('asserts that an error is thrown', function (){
          var thrown = false
            , throwError = new footest.keywords.throwError();

          // Should pass because the block throws
          throwError.match(function (){
            thrown = true;
            throw new Error('expected error');
          }, 'expected error');
          expect(thrown).to(beTrue);

          // Should throw an expected error
          try {
            throwError.match(function (){}, 'should fail match');
            throw new Error('unexpected');
          } catch (e){
            expect(e.toString()).to(be, 'AssertionError:   "Missing expected exception. should fail match"');
          }

          // Should throw any error
          try {
            throwError.match(function (){}, null);
            throw new Error('unexpected');
          } catch (e){
            expect(e.toString()).to(be, 'AssertionError:   "Missing expected exception.."');
          }
        });
      });

      describe('.notMatch', function (){
        it('asserts that an error is NOT thrown', function (){
          var matcher = new foounit.keywords.throwError();
          matcher.notMatch(function (){}, null);

          expect(function (){
            matcher.notMatch(function (){
              throw new Error('foo');
            }, 'foo');
          }).to(throwError, /foo/);
        });
      });
    });

    describe('.beGt', function (){
      describe('.match', function (){
        it('asserts expected is greater than actual', function (){
          var matcher = new foounit.keywords.beGt();
          expect(function (){ matcher.match(4, 3); }).toNot(throwError);
          expect(function (){ matcher.match(4, 4); }).to(throwError, /Expected 4 to be greater than 4/);
          expect(function (){ matcher.match(4, 5); }).to(throwError, /Expected 4 to be greater than 5/);
        });
      });
      describe('.notMatch', function (){
        it('asserts expected is NOT greater than actual', function (){
          var matcher = new foounit.keywords.beGt();
          expect(function (){ matcher.notMatch(3, 4); }).toNot(throwError);
          expect(function (){ matcher.notMatch(4, 4); }).toNot(throwError);
          expect(function (){ matcher.notMatch(5, 4); }).to(throwError, /Expected 5 to not be greater than 4/);
        });
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
        it('asserts that actual is !== true', function (){
          var matcher = new footest.keywords.beTrue();
          matcher.notMatch(false);

          expect(function (){
            matcher.notMatch(true);
          }).to(throwError, /AssertionError: true !== true/);
        });
      });

      describe('.match', function (){
        it('asserts that actual is === true', function (){
          var matcher = new footest.keywords.beTrue();
          matcher.match(true);

          expect(function (){
            matcher.match(false);
          }).to(throwError, /AssertionError: true === false/);
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

          expect(function (){
            matcher.match(null, undefined);
          }).to(throwError, /AssertionError:  === null/);
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

          expect(function (){
            matcher.match(value.concat([1]), value);
          }).to(throwError, /AssertionError:.*deepEqual.*/);
        });
      });
    });

  });
}});
