var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.TimedDeferredBlock', function (){
    describe('run', function (){
      var block, callback;
      
      before(function (){
        callback = mockEmpty();
        block = new footest.TimedDeferredBlock(callback, 100);
        block.run();
        mock(foounit, 'clearTimeout');
      });

      after(function (){
        expect(callback).to(haveBeenCalled, withArgs(block));
        expect(foounit.clearTimeout.totalCalls).to(beGt, 0);
      });
      
      it('completes when complete is called', function (){
        var complete = block.onComplete = mock(function (){});
        block.complete();
        expect(complete).to(haveBeenCalled);
      });

      it('fails when fail is called', function (){
        var failure = block.onFailure = mockEmpty();

        block.fail('expected');
        expect(failure).to(haveBeenCalled);
        expect(block.getException()).to(match, /expected/);
      });

      it('fails when the timeout is reached', function (){
        var log = []
          , timeout = block.onTimeout = mock(function (){ log.push('timeout'); })
          , failure = block.onFailure = mock(function (){ log.push('failure'); });

        //block.run();

        waitFor(function (){
          expect(log).to(equal, ['timeout', 'failure']);
          expect(block.getException()).to(match, /timeout reached/);
        });
      });
    });
  });
}});
