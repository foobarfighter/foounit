var footest = foounit.require(':src/foounit');

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
            expect(e.toString().indexOf('AssertionError:   "Missing expected exception. should fail match"')).to(beGt, -1);
          }

          // Should throw any error
          try {
            throwError.match(function (){}, null);
            throw new Error('unexpected');
          } catch (e){
            expect(e.toString().indexOf('AssertionError:   "Missing expected exception.."')).to(beGt, -1);
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

    describe('.be', function (){
      describe('.notMatch', function (){
        it('does NOT ===', function (){
          var matcher = new footest.keywords.be();
          matcher.notMatch('a', 'b');

          expect(function (){
            matcher.notMatch(null, null);
          }).to(throwError, /AssertionError: null !== null/);
        });
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


    describe('.beNull', function (){
      describe('.match', function (){
        it('asserts actual strictly equals null', function (){
          var matcher = new footest.keywords.beNull();
          matcher.match(null);

          expect(function (){
            matcher.match(undefined);
          }).to(throwError, /AssertionError: null ===/);
        });
      });

      describe('.notMatch', function (){
        it('asserts actual does NOT strictly equal null', function (){
          var matcher = new footest.keywords.beNull();
          matcher.notMatch(undefined);

          expect(function (){
            matcher.notMatch(null);
          }).to(throwError, /AssertionError: null !== null/);
        });
      });
    });

    describe('.beUndefined', function (){
      describe('.match', function (){
        it('asserts actual strictly equals undefined', function (){
          var matcher = new footest.keywords.beUndefined();
          matcher.match(undefined);

          expect(function (){
            matcher.match(null);
          }).to(throwError, /AssertionError:  === null/);
        });
      });

      describe('.notMatch', function (){
        it('asserts actual does NOT strictly equal null', function (){
          var matcher = new footest.keywords.beUndefined();
          matcher.notMatch(null);

          expect(function (){
            matcher.notMatch(undefined);
          }).to(throwError, /AssertionError:  !== /);
        });
      });
    });

    describe('.beGt', function (){
      describe('.match', function (){
        it('asserts actual is greater than expected', function (){
          var matcher = new footest.keywords.beGt();
          expect(function (){ matcher.match(4, 3); }).toNot(throwError);
          expect(function (){ matcher.match(4, 4); }).to(throwError, /4 > 4/);
          expect(function (){ matcher.match(4, 5); }).to(throwError, /5 > 4/);
        });
      });
      describe('.notMatch', function (){
        it('asserts expected is NOT greater than actual', function (){
          var matcher = new footest.keywords.beGt();
          expect(function (){ matcher.notMatch(3, 4); }).toNot(throwError);
          expect(function (){ matcher.notMatch(4, 4); }).toNot(throwError);
          expect(function (){ matcher.notMatch(5, 4); }).to(throwError, /4 <= 5/);
        });
      });
    });

    describe('.beLt', function (){
      describe('.match', function (){
        it('asserts actual is less than expected', function (){
          var matcher = new footest.keywords.beLt();
          expect(function (){ matcher.match(3, 4); }).toNot(throwError);
          expect(function (){ matcher.match(4, 4); }).to(throwError, /4 < 4/);
          expect(function (){ matcher.match(5, 4); }).to(throwError, /4 < 5/);
        });
      });

      describe('.notMatch', function (){
        it('asserts that expected is NOT less than actual', function (){
          var matcher = new footest.keywords.beLt();
          expect(function (){ matcher.notMatch(5, 4); }).toNot(throwError);
          expect(function (){ matcher.notMatch(4, 4); }).toNot(throwError);
          expect(function (){ matcher.notMatch(3, 4); }).to(throwError, /4 >= 3/);
        });
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
        it('asserts that actual is !== false', function (){
          var matcher = new footest.keywords.beFalse();
          matcher.notMatch(true);

          expect(function (){
            matcher.notMatch(false);
          }).to(throwError, /AssertionError: false !== false/);
        });
      });
      describe('.match', function (){
        it('asserts that actual === false', function (){
          var matcher = new footest.keywords.beFalse();
          matcher.match(false);

          expect(function (){
            matcher.match(true);
          }).to(throwError, /AssertionError: false === true/);
        });
      });
    });

    describe('.include', function (){
      describe('.notMatch', function (){
        it('asserts that actual does NOT have an element that is strictly equal to expected', function (){
          var matcher = new footest.keywords.include();
          matcher.notMatch([1,2,3], 4);

          expect(function (){
            matcher.notMatch([1,2,3], 2);
          }).to(throwError, /2 is included in \[1,2,3\]/);
        });
      });

      describe('.match', function (){
        it('asserts that actual has an element that is strictly equal to expected', function (){
          var matcher = new footest.keywords.include();
          matcher.match([1,2,3], 2);

          expect(function (){
            matcher.match([1,2,3], 4);
          }).to(throwError, /4 is not included in \[1,2,3\]/);
        });
      });
    });

    describe('equal', function (){
      var matcher;

      before(function (){
        matcher = new footest.keywords.equal();
      });

      describe('when actual or expected are arguments', function (){
        it('converts them to arrays for comparison', function (){
          expect(function (){
            var func = function (){
              expect(arguments).to(equal, [1,2,3]);
              expect([1,2,3]).to(equal, arguments);
            }
            func(1,2,3);
          }).toNot(throwError);
        });
      });

      describe('.notMatch', function (){
        it('does NOT deep equal', function (){
          var value = [1, { foo: 'bar' }, 3]
            , matcher = new footest.keywords.equal();
          
          matcher.notMatch(value.concat([1]), value);
          expect(function (){
            matcher.notMatch(value, value);
          }).to(throwError, /AssertionError:.*notDeepEqual.*/);
        });
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
