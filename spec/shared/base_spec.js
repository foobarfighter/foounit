var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.base', function (){
    describe('.bind', function (){
      it('returns a function that is bound to a scope', function (){
        var scope = { foo: 'bar' };
        var actualScope, args;

        var func = footest.bind(scope, function (){
          args = arguments;
          actualScope = this;
          return 123;
        });

        var ret = func(1,2,3);
        expect(actualScope).to(be, scope);
        expect(args).to(equal, [1, 2, 3]);
        expect(ret).to(be, 123);
      });
    });

    describe('.addKeyword/.removeKeyword', function (){
      before(function (){
        expect(footest.getScope()).to(beUndefined);
      });

      after(function (){
        footest.scope(undefined);
      });

      it('adds keywords scoped to the setting in foounit.settings.kwScope', function (){
        var scope = {};
        footest.scope(scope)
        footest.addKeyword('bazBar', 'poopin');
        expect(scope.bazBar).to(equal, 'poopin');

        foounit.removeKeyword('bazBar');
        expect(scope.bazBar).to(beUndefined);
        expect(foounit.keywords.bazBar).to(beUndefined);
      });
    });

    describe('.addMatcher/.removeMatcher', function (){
      it('adds a matcher to the keywords as well as to the expectations', function (){
        foounit.addMatcher('beRainbow', function (){
          this.match = function (){ return true; }
          this.notMatch = function () { throw new Error('expected'); }
        });

        expect('unicorn eating').toBeRainbow();
        expect('unicorn eating').to(beRainbow);
        expect(function (){ expect('x').toNotBeRainbow(); }).to(throwError, /expected/);
        expect(function (){ expect('x').toNot(beRainbow); }).to(throwError, /expected/);

        foounit.removeMatcher('beRainbow');

        expect(typeof foounit.Expectation.prototype.toBeRainbow).toNot(be, 'function');
        expect(typeof foounit.Expectation.prototype.toNotBeRainbow).toNot(be, 'function');
        expect(typeof beRainbow).to(be, 'undefined');
      });
    });

    describe('scope', function (){
      it('mixes in the foounit keywords into the scope object that was passed', function (){
        var obj = {};
        footest.scope(obj);
        expect(obj).to(equal, footest.keywords);

        footest.scope(undefined);
        expect(footest.getScope()).to(beUndefined);
      });
    });

    describe('.build', function (){
      it('builds an array of all tests to be run', function (){
        var bc = footest.getBuildContext();
        footest.setBuildContext(new footest.BuildContext());

        var before0 = function (){ var x = 'before0'; }
          , before1 = undefined
          , before2 = function (){ var x = 'before2'; }
          , before3 = function (){ var x = 'before3'; }
          , after0 = function (){ var y = 'after0'; }
          , after1 = undefined
          , after2 = function (){ var y = 'after2'; }
          , after3 = function (){ var y = 'after3'; }
          , test0 = function (){ var z = 'test0'; }
          , test1 = function (){ var z = 'test1'; }
          , test2 = function (){ var z = 'test2'; }
          , test3 = function (){ var z = 'test3'; };

        footest.add(function (){
          before(before0);
          after(after0);
          it('test0', test0);
          describe('group1', function (){
            //before1 intentionally omitted
            //after1  intentionally omitted

            it('test1', test1);
            describe('group2', function (){
              before(before2);
              after(after2);
              it('test2', test2);
            });
          });
          describe('group3', function (){
            before(before3);
            after(after3);
            it('test3', test3);
          });
        });

        var examples = footest.build();
        expect(examples[0].getBefores()[0])  .to(be, before0);
        expect(examples[0].getTest())        .to(be, test0);
        expect(examples[0].getAfters()[0])   .to(be, after0);

        expect(examples[1].getBefores()[0])  .to(be, before0);
        expect(examples[1].getBefores()[1])  .to(beNull);
        expect(examples[1].getTest())        .to(be, test1);
        expect(examples[1].getAfters()[0])   .to(be, after0);
        expect(examples[1].getAfters()[1])   .to(beNull);

        expect(examples[2].getBefores()[0])  .to(be, before0);
        expect(examples[2].getBefores()[1])  .to(beNull);
        expect(examples[2].getBefores()[2])  .to(be, before2);
        expect(examples[2].getTest())        .to(be, test2);
        expect(examples[2].getAfters()[0])   .to(be, after0);
        expect(examples[2].getAfters()[1])   .to(beNull);
        expect(examples[2].getAfters()[2])   .to(be, after2);

        expect(examples[3].getBefores()[0])  .to(be, before0);
        expect(examples[3].getBefores()[1])  .to(be, before3);
        expect(examples[3].getTest())        .to(be, test3);
        expect(examples[3].getAfters()[0])   .to(be, after0);
        expect(examples[3].getAfters()[1])   .to(be, after3);

        footest.setBuildContext(bc);
      });
    });

    describe('.execute', function (){
      xit('executes the specs in the queue', function (){
      });
    });

    describe('.getFullDescription', function (){
      var bc;

      before(function (){
        bc = footest.getBuildContext();
        footest.setBuildContext(new footest.BuildContext());
      });

      after(function (){
        footest.setBuildContext(bc);
      });

      it('returns the description including parent descriptions as a string', function (){
        footest.add(function (){
          it('test0');
          describe('group1', function (){
            it('test1');
            describe('group2', function (){
              it('test2');
            });
          });
          describe('group3', function (){
            it('test3');
          });
        });

        var examples = footest.build();
        expect(examples[0].getFullDescription()).to(equal, 'test0');
        expect(examples[1].getFullDescription()).to(equal, 'group1 test1');
        expect(examples[2].getFullDescription()).to(equal, 'group1 group2 test2');
        expect(examples[3].getFullDescription()).to(equal, 'group3 test3');
      });
    });

    describe('.translatePath', function (){
      it('translates mounted paths', function (){
        var testPath = ':baz/bing/:bar/bang', actual;

        actual = footest.translatePath(testPath);
        expect(testPath).to(equal, actual);

        footest.mount('baz', 'quux');
        footest.mount('bar', 'boom');

        actual = footest.translatePath(testPath);
        expect(actual).to(equal, 'quux/bing/boom/bang');

        footest.unmount('baz');
        footest.unmount('bar');

        actual = footest.translatePath(testPath);
        expect(testPath).to(equal, actual);
      });
    });

  });
}});
