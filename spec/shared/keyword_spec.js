var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.keywords', function (){

    // Create assertion building blocks
    describe('expect', function (){
      it('creates an expectation', function (){
        var foo = footest.keywords.expect('foo');
        if (foo.constructor !== footest.Expectation){
          throw new Error('expected foo to be a footest.Expectation');
        }
      });
    });

    describe('xit', function (){
      it('creates a pending example', function (){
        foo = footest.keywords.xit('pending', function (){
          throw new Error('pending test should not run');
        });
        expect(foo.isPending()).to(beTrue);
      });
    });

    describe('fuckit', function (){
      it('creates a pending example', function (){
        foo = footest.keywords.fuckit('pending', function (){
          throw new Error('pending test should not run');
        });
        expect(foo.isPending()).to(beTrue);
      });
    });

    describe('xdescribe', function (){
      it('creats a pending group', function (){
        foo = footest.keywords.xdescribe('pending', function (){});
        expect(foo.isPending()).to(beTrue);
      });
    });

    describe('matchers', function (){
      it('mixes them into the keywords', function (){
        var called = false;
        footest.add(function (kw){ with(kw){
          expect(kw.be).to(be, be);
          called = true;
        }});

        expect(called).to(be, true);
      });
    });

    describe('.before', function (){
      it('adds a before callback to current group context', function (){
        var bc = footest.getBuildContext();
        footest.setBuildContext(new footest.BuildContext());

        footest.add(function (kw){ with(kw){
          before(function (){ return 'root'; });

          describe('group1', function (){
            before(function (){ return 'group1'; });

            describe('group1.1', function (){
              before(function (){ return 'group1.1'; });
            });
          });

          describe('group2', function (){
            before(function (){ return 'group2'; });
          });
        }});

        var root = footest.getBuildContext().getRoot();
        expect(root.getBefore()()).to(be, 'root');
        expect(root.getGroups()[0].getBefore()()).to(be, 'group1');
        expect(root.getGroups()[0].getGroups()[0].getBefore()()).to(be, 'group1.1');
        expect(root.getGroups()[1].getBefore()()).to(be, 'group2');

        footest.setBuildContext(bc);
      });
    });

    describe('.after', function (){
      it('adds a after callback to current group context', function (){
        var bc = footest.getBuildContext();
        footest.setBuildContext(new footest.BuildContext());

        footest.add(function (kw){ with(kw){
          after(function (){ return 'root'; });

          describe('group1', function (){
            after(function (){ return 'group1'; });

            describe('group1.1', function (){
              after(function (){ return 'group1.1'; });
            });
          });

          describe('group2', function (){
            after(function (){ return 'group2'; });
          });
        }});

        var root = footest.getBuildContext().getRoot();
        expect(root.getAfter()()).to(be, 'root');
        expect(root.getGroups()[0].getAfter()()).to(be, 'group1');
        expect(root.getGroups()[0].getGroups()[0].getAfter()()).to(be, 'group1.1');
        expect(root.getGroups()[1].getAfter()()).to(be, 'group2');

        footest.setBuildContext(bc);
      });
    });

    describe('.waitFor', function (){
      var bc, expectation;

      before(function (){
        footest.setBuildContext(new footest.BuildContext());
        mock(foounit, 'setTimeout', function (func){ func(); });
      });

      after(function (){
        footest.setBuildContext(bc);
      });

      it('adds a PollingBlock to the current block queue', function (){
        var waitForBlock1, waitForBlock2;

        var example = new footest.Example('example', function (){
          var blockQueue = footest.getBuildContext()
            .getCurrentExample()
            .getCurrentBlockQueue();

          footest.keywords.waitFor(function (){
            expect(foo).to(equal, 'quux');
          });
          waitForBlock1 = blockQueue.dequeue();

          footest.keywords.waitFor(function (){}, 123);
          waitForBlock2 = blockQueue.dequeue();
        });

        example.run();

        expect(example.getException()).to(beUndefined);
        expect(waitForBlock1.constructor).to(be, footest.PollingBlock);
        expect(waitForBlock1.getTimeout()).to(equal, footest.settings.waitForTimeout);

        expect(waitForBlock2).toNot(be, waitForBlock1);
        expect(waitForBlock2.constructor).to(be, footest.PollingBlock);
        expect(waitForBlock2.getTimeout()).to(equal, 123);
      });
    });

    describe('.waitForTimeout', function (){
      var bc;
      before(function (){
        footest.setBuildContext(new footest.BuildContext());
        mock(foounit, 'setTimeout', function (func){ func(); });
      });

      after(function (){
        footest.setBuildContext(bc);
      });

      it('adds a TimeoutBlock to the current block queue', function (){
        var waitForTimeoutBlock1, waitForTimeoutBlock2;

        var example = new footest.Example('example', function (){
          var blockQueue = footest.getBuildContext()
            .getCurrentExample()
            .getCurrentBlockQueue();

          footest.keywords.waitForTimeout(function (){
            expect(foo).to(equal, 'quux');
          });
          waitForTimeoutBlock1 = blockQueue.dequeue();

          footest.keywords.waitForTimeout(function (){
            expect(foo).to(equal, 'quux');
          }, 123);
          waitForTimeoutBlock2 = blockQueue.dequeue();
        });

        example.run();

        expect(waitForTimeoutBlock1.constructor).to(be, footest.TimeoutBlock);
        expect(waitForTimeoutBlock1.getTimeout()).to(equal, footest.settings.waitForTimeout);

        expect(waitForTimeoutBlock2.constructor).to(be, footest.TimeoutBlock);
        expect(waitForTimeoutBlock2.getTimeout()).to(equal, 123);
      });
    });

    describe('.run', function (){
      var bc;
      before(function (){
        footest.setBuildContext(new footest.BuildContext());
        mock(foounit, 'setTimeout', function (func){ func(); });
      });

      after(function (){
        footest.setBuildContext(bc);
      });

      it('adds a Block to the current block queue', function (){
        var runBlock1, runBlock2;

        var example = new footest.Example('example', function (){
          var blockQueue = footest.getBuildContext()
            .getCurrentExample()
            .getCurrentBlockQueue();

          footest.keywords.run(function (){
            expect(foo).to(equal, 'quux');
          });
          runBlock1 = blockQueue.dequeue();

          footest.keywords.run(function (){}, 123);
          runBlock2 = blockQueue.dequeue();
        });

        example.run();
        expect(runBlock1.constructor).to(be, footest.Block);
        expect(runBlock2.constructor).to(be, footest.Block);
      });
    });

  });
}});
