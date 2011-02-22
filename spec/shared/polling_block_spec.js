var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.PollingBlock', function (){
    var cleared, origSetInterval, origClearInterval;

    before(function (){
      cleared = false;
      origSetInterval = footest.setInterval;
      origClearInterval = footest.clearInterval;

      footest.setInterval = function (callback, period){
        if (!cleared){ callback(); }
        if (!cleared){ callback(); }
        if (!cleared){ callback(); }
        if (!cleared){ callback(); }
        if (!cleared){ callback(); }
      };

      footest.clearInterval = function (){
        cleared = true;
      }
    });

    after(function (){
      footest.setInterval = origSetInterval;
      footest.clearInterval = origClearInterval;
    });

    describe('.run', function (){
      describe('when the function eventually does not throw', function (){
        it('calls onComplete', function (){
          var actual, calls = 0;

          var block = new footest.PollingBlock(function (){
            calls++;
            if (calls < 3){ throw new Error('errar!'); }
          }, 5000);

          block.onComplete = function (b){ actual = b; }
          block.run();

          expect(actual).to(be, block);
          expect(cleared).to(beTrue);
        });
      });

      describe('when the function times out', function (){
        var origGetTime;

        before(function (){
          origGetTime = footest.getTime;

          var time = 0;
          footest.getTime = function (){
            return time += 1000;
          };
        });

        after(function (){
          footest.getTime = origGetTime;
        });

        it('calls onFailure', function (){
          var actual, called = 0;
          var block = new footest.PollingBlock(function (){
            called++
            throw new Error('errar');
          }, 5000);

          block.onFailure = function (b){ actual = b; };
          block.run();

          expect(cleared).to(beTrue);
          expect(called).to(beGt, 1);
          expect(actual).to(be, block);
          expect(actual.getException().message).to(equal, 'waitFor timeout: errar');
        });
      });
    });
  });
}});
