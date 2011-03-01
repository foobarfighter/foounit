var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.TimeoutBlock', function (){
    var block, callCount;

    before(function (){
      callCount = 0;
    });

    describe('when the block always throws an error and times out', function (){
      before(function (){
        block = new footest.TimeoutBlock(function (){
          callCount++;
          throw new Error('expected');
        }, 200);
      });

      it('calls onComplete', function (){
        var complete = false;
        block.onComplete = function (){ complete = true; };
        block.run();

        expect(complete).to(beFalse);
        waitFor(function (){
          expect(complete).to(beTrue);
          expect(callCount).to(beGt, 1);
        });
      });
    });

    describe('when the block runs without throwing an error', function (){
      before(function (){
        block = new footest.TimeoutBlock(function (){
          callCount++;
          if (callCount < 2){ throw new Error('expected'); }
        }, 200);
      });

      it('calls onFailure', function (){
        var failure = false;
        block.onFailure = function (){ failure = true; };
        block.run();

        expect(failure).to(beFalse);
        waitFor(function (){
          expect(failure).to(beTrue);
          expect(callCount).to(equal, 2);
          expect(block.getException().message).to(equal, 'timeout was not reached');
        });
      });
    });
  });
}});
