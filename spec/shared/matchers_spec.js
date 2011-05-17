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
            // FIXME: We shouldn't be doing this.  This normalization is to passify IE8.
            var message = e.message || e.toString();
            expect(message.indexOf('AssertionError:   "Missing expected exception. should fail match"')).to(beGt, -1);
          }

          // Should throw any error
          try {
            throwError.match(function (){}, null);
            throw new Error('unexpected');
          } catch (e){
            // FIXME: We shouldn't be doing this.  This normalization is to passify IE8.
            var message = e.message || e.toString();
            expect(message.indexOf('AssertionError:   "Missing expected exception.."')).to(beGt, -1);
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

    describe('.beTruthy', function (){
      describe('.match', function (){
        it('asserts that actual is a truthy value', function (){
          var matcher = new footest.keywords.beTruthy();
          matcher.match(true);
          matcher.match('test');
          matcher.match(1);
          
          expect(function (){ matcher.match(false); })
            .to(throwError, /Expected.*false.*to be truthy/);
          expect(function (){ matcher.match(null); })
            .to(throwError, /Expected.*null.*to be truthy/);
          expect(function (){ matcher.match(''); })
            .to(throwError, /Expected \\"\\" to be truthy/);
          expect(function (){ matcher.match(0); })
            .to(throwError, /Expected.*0.*to be truthy/);
        });
      });

      describe('notMatch', function (){
        it('asserts the actual is NOT a truthy value', function (){
          var matcher = new footest.keywords.beTruthy();
          matcher.notMatch(null);
          matcher.notMatch(false);
          matcher.notMatch(0);
          matcher.notMatch(undefined);
          matcher.notMatch('');

          expect(function (){
            matcher.notMatch('test');
          }).to(throwError, /Expected.*to NOT be truthy/);
        });
      });
    });

    describe('beFalsy', function (){
      describe('.match', function (){
        it('asserts that actual is a falsy value', function (){
          var matcher = new footest.keywords.beFalsy();
          matcher.match(null);

          expect(function (){
            matcher.match(true);
          }).to(throwError, /Expected.*to be falsy/);
        });
      });

      describe('.notMatch', function (){
        it('asserts that actual is NOT a falsy value', function (){
          var matcher = new footest.keywords.beFalsy();
          matcher.notMatch('test');

          expect(function (){
            matcher.notMatch(0);
          }).to(throwError, /Expected.*to NOT be falsy/);
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

          // Is this bad? We didn't find both elements so we pass
          // Should we assert that all elements are not found?
          matcher.notMatch([1,2,3], [4,2]);  

          expect(function (){
            matcher.notMatch([1,2,3], 2);
          }).to(throwError, /2 is included in \[1,2,3\]/);

          expect(function (){
            matcher.notMatch([1,2,3], [3,2]);
          }).to(throwError, /\[3,2\] is included in \[1,2,3\]/);
        });
      });

      describe('.match', function (){
        it('asserts that actual has elements that are strictly equal to expected', function (){
          var matcher = new footest.keywords.include();
          matcher.match([1,2,3], 2);
          matcher.match([1,2,3], [3,2]);

          expect(function (){
            matcher.match([1,2,3], 4);
          }).to(throwError, /4 is not included in \[1,2,3\]/);

          expect(function (){
            matcher.match([1,2,3], [4,5]);
          }).to(throwError, /\[4,5\] is not included in \[1,2,3\]/);
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

    describe('match', function (){
      var matcher;

      before(function (){
        matcher = new footest.keywords.match();
      });

      describe('.match', function (){
        it('matches actual against a regular expression (expected)', function (){
          matcher.match('foo123', /^foo/);

          expect(function (){
            matcher.match('bar123', /foo/);
          }).to(throwError, /AssertionError:  \/foo\/ does not match "bar123"/);
        });
      });

      describe('.notMatch', function (){
        it('does not match actual against a regular expression (expected)', function (){
          matcher.notMatch('bar123', /^foo/);

          expect(function (){
            matcher.notMatch('foo', /foo/);
          }).to(throwError, /AssertionError:  \/foo\/ matches "foo"/);
        });
      });
    });

  });
}});
