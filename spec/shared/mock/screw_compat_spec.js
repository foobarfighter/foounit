var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.mock.screw_compat', function (){
    describe('mock', function (){
      var obj;

      before(function (){
        obj = {};
        obj.foo = function (){ throw new Error('should not be called'); }
      });

      it('replaces the target with a function that keeps track of its call history', function (){
        mock(obj, 'foo');
        expect(obj.foo.totalCalls).to(beUndefined);
        expect(obj.foo.callArgs).to(beUndefined);
        expect(obj.foo.mostRecentArgs).to(beUndefined);

        obj.foo();
        expect(obj.foo.totalCalls).to(be, 1);
        expect(obj.foo.callArgs[0]).to(equal, []);
        expect(obj.foo.mostRecentArgs).to(equal, []);

        obj.foo(1, 2, 3);
        expect(obj.foo.totalCalls).to(be, 2);
        expect(obj.foo.callArgs[1]).to(equal, [1, 2, 3]);
        expect(obj.foo.mostRecentArgs).to(equal, [1, 2, 3]);

      });

      describe('when the target function does not exist', function (){
        it('raises an error', function (){
          expect(function (){
            mock(obj, 'bar');
          }).to(throwError, /"bar" is not a function that can be mocked/);
        });
      });

      describe('when there is a stub function', function (){
        var scope, args;

        before(function (){
          obj.baz = function (){ return 123; };
        });

        it('calls the stub function', function (){
          mock(obj, 'baz', function (){
            scope = this;
            args  = arguments;
            return 456
          });

          expect(obj.baz(1, 2, 3)).to(be, 456);
          expect(scope).to(be, obj);
          expect(args).to(equal, [1,2,3]);
        });

        it('calls the stub function in "this" scope - issue #16', function (){
          mock(obj, 'baz', function (){
            scope = this;
            args  = arguments;
            return 456
          });

          var wrapperObj = { func: obj.baz };
          wrapperObj.func();
          expect(wrapperObj.func).to(haveBeenCalled, once);
          expect(scope).to(be, wrapperObj);
        });
      });

      describe('when the only argument is a function', function (){
        var foo, callback;

        before(function (){
          foo = 'baz';
          callback = mock(function (){ foo = 'bar' });
        });

        it('appends mocking data to the function but does not replace the function', function (){
          callback(1, 2, 3);
          expect(callback).to(haveBeenCalled, withArgs(1,2,3));

          expect(foo).to(be, 'bar');

          callback();
          expect(callback).to(haveBeenCalled, twice);

          expect(function (){
            expect(callback).to(haveBeenCalled, thrice);
          }).to(throwError, /mock was called 2 times, but was expected 3 times/);
        });
      });

    }); // end of mock

    describe('foounit.resetMocks', function (){
      xit('resets all mocked functions', function (){
      });
    });

    describe('haveBeenCalled', function (){
      var obj, matcher;

      before(function (){
        obj = {};
        obj.foo = function (){};
        matcher = new foounit.keywords.haveBeenCalled();
      });

      describe('.match', function (){

        describe('when the function is mocked', function (){
          describe('when haveBeenCalled has no params', function (){
            it('asserts that the mocked function was called once', function (){
              mock(obj, 'foo');

              var expectedMessage = /mock was called 0 times, but was expected 1 times/;
              expect(function (){ matcher.match(obj.foo); }).to(throwError, expectedMessage);
              obj.foo();
              matcher.match(obj.foo);
            });
          });

          describe('when haveBeenCalled has a number as a param', function (){
            it('asserts the mocked function was called N times', function (){
              mock(obj, 'foo');
              obj.foo();

              var expectedMessage = /mock was called 1 times, but was expected 2 times/;
              expect(function (){ matcher.match(obj.foo, twice); }).to(throwError, expectedMessage);

              obj.foo();
              matcher.match(obj.foo, twice);
              obj.foo();
              matcher.match(obj.foo, thrice);
            });
          });

          describe('when haveBeenCalled has an array as a param', function (){
            it('asserts that the mocked function has been called once with the args', function (){
              mock(obj, 'foo');

              expect(function (){
                matcher.match(obj.foo, [1,2,3]);
              }).to(throwError, /Function was not called with arguments: 1,2,3/);

              obj.foo(1,2,3);
              matcher.match(obj.foo, [1,2,3]);
            });
          });
        });

        describe('when the function has not been mocked', function (){
          it('throws an error that the function is not mocked', function (){
            expect(function (){
              matcher.match(obj.foo);
            }).to(throwError, /Function has not been mocked/);
          });
        });
      });


      describe('notMatch', function (){
        describe('when the function has not been mocked', function (){
          it('fails', function (){
            obj.foo();

            expect(function (){
              matcher.notMatch(obj.foo);
            }).to(throwError, /Function has not been mocked/);
          });
        });

        describe('when haveBeenCalled does not have a param', function (){
          it('fails when the function has been called', function (){
            mock(obj, 'foo');
            matcher.notMatch(obj.foo);

            obj.foo();
            expect(function (){
              matcher.notMatch(obj.foo);
            }).to(throwError, /mock was called 1 times, but was not expected 1 times/);
          });
        });

        describe('when haveBeenCalled has a number as a param', function (){
          xit('fails when the function has been called the expected amount of times', function (){
            mock(obj, 'foo');
            obj.foo();

            matcher.notMatch(obj.foo, twice);

            obj.foo();
            expect(function (){
              matcher.notMatch(obj.foo, twice);
            }).to(throwError, /mock was called 2 times, but was not expected 2 times/);
          });
        });

        describe('when haveBeenCalled has an array as a param', function (){
          it('fails when the function has been called at least once with the expected params', function (){
            mock(obj, 'foo');

            obj.foo(1,2);
            matcher.notMatch(obj.foo, [1,2,3]);

            obj.foo(1,2,3);
            expect(function (){
              matcher.notMatch(obj.foo, [1,2,3]);
            }).to(throwError, /Function was called with arguments: 1,2,3/);
          });
        });
      });  // notMatch

    });  // haveNotBeenCalled

  });
}});
