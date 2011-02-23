var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.Example', function (){
    var origSetTimeout;

    before(function (){
      // Run all of these tests syncronously.  It just makes life easier that way.
      mock(foounit, 'setTimeout', function (func, timeout){ func(); });
    });

    describe('when the test is pending', function (){
      it('has a pending status', function (){
        var example = new footest.Example('test', function (){
          throw new Error('pending test should not be run');
        }, true);

        example.run();
        expect(example.isPending()).to(beTrue);
      });
    });

    describe('when the test is pending', function (){
      var example, called = false;

      before(function (){
        example = new footest.Example('test', function (){ called = true; }, true);
        expect(example.isPending()).to(beTrue);
      });

      it('does not run the test', function (){
        example.run();
        expect(called).to(beFalse);
      });

      it('executes the onComplete function', function (){
        var onCompleteCalled = false;
        example.onComplete = function (){
          onCompleteCalled = true;
        };
        example.run();
        expect(onCompleteCalled).to(beTrue);
      });
    });

    describe('when the example is successful', function (){
      var example;

      before(function (){
        example = new foounit.Example('test', function (){});
      });

      it('is successful', function (){
        example.run();
        expect(example.isSuccess()).to(beTrue);
      });

      it('executes the onComplete function', function (){
        var actual;
        example.onComplete = function (example){
          actual = example;
        };
        example.run();
        expect(actual).to(be, example);
      });

      it('resets mocks', function (){
        var obj = {};
        obj.foo = function (){ return 123; };
        obj.bar = function (){ return 456; };
        obj.baz = function (){ return 789; };

        var mockFooRet, mockBarRet, mockBazRet;

        var example = new foounit.Example('test', function (){
          mock(obj, 'foo', function (){ return 'abc'; });
          mockFooRet = obj.foo();
        });

        example.setBefores([function (){
          mock(obj, 'bar', function (){ return 'def'; });
          mockBarRet = obj.bar();
        }]);

        example.setAfters([function (){
          mock(obj, 'baz', function (){ return 'xyz'; });
          mockBazRet = obj.baz();
        }]);

        example.run();

        expect(mockFooRet).to(equal, 'abc');
        expect(obj.foo()).to(equal, 123);

        expect(mockBarRet).to(equal, 'def');
        expect(obj.bar()).to(equal, 456);

        expect(mockBazRet).to(equal, 'xyz');
        expect(obj.baz()).to(equal, 789);
      });
    });

    describe('when the example fails in a before block', function (){
      var example, _log;

      function log(msg){
        _log.push(msg);
      }

      before(function (){
        _log = [];
        example = new foounit.Example('example', function (){
          log('example');
        });
      });

      it('is a failure', function (){
        example.setBefores([function (){ log('before1'); throw new Error('expected'); }]);
        example.run();
        expect(example.isFailure()).to(beTrue);
        expect(_log).to(equal, ['before1']);
      });

      it('runs the afters created at the same level as all of the before blocks', function (){
        example.setBefores([
          function (){ log('before1'); }
          , null,
          , function (){ log('before3'); throw new Error('expected') }
          , function (){ log('before4'); }
        ]);

        example.setAfters([
          function (){ log('after1'); }
          , function (){ log('after2'); }
          , function (){ log('after3'); }
          , function (){ log('after4'); }
        ]);

        example.run();
        expect(_log).to(equal, [
          'before1', 'before3', 'after3', 'after2', 'after1'
        ]);
      });

      it('executes the onComplete function', function (){
        var actual;
        example.onComplete = function (example){
          actual = example;
        };

        example.setBefores([ function (){ throw new Error('expected'); } ]);
        example.run();
        expect(actual).to(be, example);
      });

      xit('resets mocks', function (){});
    });

    describe('when the example fails in an after', function (){
      var example;

      before(function (){
        example = new foounit.Example('example', function (){});
      });

      it('is a failure', function (){
        example.setAfters([ function (){ throw new Error('expected'); } ]);
        example.run();
        expect(example.isFailure()).to(beTrue);
      });

      it('runs the remaining afters', function (){
        var called = 0;
        example.setAfters([
          function (){ called++; }
        , function (){ throw new Error('expected'); }
        , function (){ called++;  }
        ]);
        example.run();
        expect(called).to(be, 2);
      });

      it('executes the onComplete function', function (){
        var actual;
        example.onComplete = function (example){
          actual = example;
        };

        example.setAfters([ function (){ throw new Error('expected'); } ]);
        example.run();
        expect(actual).to(be, example);
      });

      xit('resets mocks', function (){});

      describe('when there has already been a failure', function (){
        xit('reports the first exception', function (){
        });
      });

      describe('when a previous after block has failed', function (){
        xit('reports the first exception', function (){
        });
      });
    });

    describe('when the examples test fails', function (){
      var example;

      before(function (){
        example = new foounit.Example('example', function (){
          throw new Error('expected');
        });
      });

      it('is a failure', function (){
        example.run();
        expect(example.isFailure()).to(beTrue);
      });

      it('runs all afters', function (){
        var called = 0;
        example.setAfters([
          function (){ called++; }
        , function (){ called++; }
        ]);
        example.run();
        expect(called).to(be, 2);
      });

      it('executes the onComplete function', function (){
        var actual;
        example.onComplete = function (example){
          actual = example;
        };

        example.run();
        expect(actual).to(be, example);
      });

      xit('resets mocks', function (){});
    });


    describe('when the test is NOT pending', function (){
      describe('.run', function (){
        it('runs all befores, tests, afters and the onComplete function in order', function (){
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
          example.onComplete = function (example){
            log.push(example);
          }

          example.run();

          expect(log.length).to(be, 6);
          expect(log[0]).to(be, 'before1');
          expect(log[1]).to(be, 'before2');
          expect(log[2]).to(be, 'test');
          expect(log[3]).to(be, 'after2');
          expect(log[4]).to(be, 'after1');
          expect(log[5]).to(be, example);
        });


        describe('when a before fails', function (){
          var example;

          before(function (){
            example = new footest.Example('test', function (){});
            example.setBefores([function (){
              throw new Error('fail');
            }]);
          });

          it('fails the example', function (){
            example.run();
            expect(example.isFailure()).to(be, true);
          });

          it('runs the afters', function (){
            var afterCalled = false;
            example.setAfters([function (){
              afterCalled = true;
            }]);
            example.run();
            expect(example.isFailure()).to(be, true);
            expect(afterCalled).to(be, true);
          });

          it('executes the onComplete function', function (){
            var actualExample;
            example.onComplete = function (example){ actualExample = example; }
            example.run();
            expect(actualExample).to(be, example);
          });
        });

        describe('when the test fails', function (){
          var example;
          before(function (){
            example = new footest.Example('test', function (){
              throw new error('fail');
            });
          });

          it('fails the test', function (){
            example.run();
            expect(example.isFailure()).to(be, true);
          });

          it('runs the afters', function (){
            var afterCalled = false;
            example.setAfters([
              function (){ afterCalled = true; }
            ]);

            example.run();
            expect(example.isFailure()).to(be, true);
            expect(afterCalled).to(be, true);
          });

          it('executes the onComplete function', function (){
            var actualExample;
            example.onComplete = function (example){ actualExample = example; }
            example.run();
            expect(actualExample).to(be, example);
          });
        });

        describe('when the after throws', function (){
          it('throws', function (){
            var example = new footest.Example('test', function (){});
            example.setAfters([function (){
              throw new Error('expected');
            }]);

            example.run();
            expect(example.getException().message).to(be, 'expected');
          });
        });
      });
    }); // when the test is NOT pending


    describe('when an example is running', function (){
      var bc;

      before(function (){
        bc = footest.getBuildContext();
        footest.setBuildContext(new footest.BuildContext());
      });

      after(function (){
        footest.setBuildContext(bc);
      });

      it('sets the current example', function (){
        var example = new footest.Example('example', function (){
          currentExample = footest.getBuildContext().getCurrentExample();
        });
        example.run();

        expect(footest.getBuildContext().getCurrentExample()).to(beUndefined);
        expect(currentExample).to(be, example);
      });

      it('sets the current block queue for each currently executing block', function (){
        var beforeQueue1, beforeQueue2, testQueue, afterQueue;
        
        var example = new footest.Example('example', function (){
          testQueue = footest.getBuildContext().getCurrentExample().getCurrentBlockQueue();
        });

        // Assert that each before block has it's own BlockQueue
        example.setBefores([
          function (){ beforeQueue1 = footest.getBuildContext().getCurrentExample().getCurrentBlockQueue(); }
        , function (){ beforeQueue2 = footest.getBuildContext().getCurrentExample().getCurrentBlockQueue(); }
        ]);

        example.setAfters([function (){
          afterQueue = footest.getBuildContext().getCurrentExample().getCurrentBlockQueue(); 
        }]);

        example.run();

        expect(testQueue.constructor).to(be, footest.BlockQueue);
        expect(beforeQueue1.constructor).to(be, footest.BlockQueue);
        expect(beforeQueue2.constructor).to(be, footest.BlockQueue);
        expect(afterQueue.constructor).to(be, footest.BlockQueue);

        expect(testQueue).toNot(be, beforeQueue1);
        expect(testQueue).toNot(be, afterQueue);
        expect(beforeQueue1).toNot(be, afterQueue);
        expect(beforeQueue1).toNot(be, beforeQueue2);
      });

      describe('when a block is added to the current block queue', function (){
        it('adds a block to the current BlockQueue', function (){
          var blockQueue, initialSize, afterAddSize
            , block = new footest.Block(function (){});

          var example = new footest.Example('example', function (){
            var ex = footest.getBuildContext().getCurrentExample();
            blockQueue = ex.getCurrentBlockQueue();

            initialSize = blockQueue.size();
            ex.enqueue(block);
            afterAddSize = blockQueue.size();
          });

          example.run();

          expect(blockQueue).toNot(beUndefined);

          expect(example.isSuccess()).to(beTrue);
          expect(initialSize).to(be, 0);
          expect(afterAddSize).to(be, 1);
        });
      });
    });  // when an example is running

  });  // foounit.Example
}});
