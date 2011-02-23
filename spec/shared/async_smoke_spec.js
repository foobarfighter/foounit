var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('async testing smoke test', function (){
    var _log, beforeCondition;

    function log(msg){
      _log.push(msg);
    }

    before(function (){
      beforeCondition = false;
      _log = [];
    });

    after(function (){
      expect(_log).to(include, 'inner after was called');
    });

    describe('successful tests', function (){
      before(function (){
        log('sync before');

        setTimeout(function (){
          beforeCondition = true;
        }, 100);

        waitFor(function (){
          expect(beforeCondition).to(beTrue);
          log('async before finished');
        });
      });

      after(function (){
        expect(_log).to(equal, ['sync before', 'async before finished', 'sync test', 'async test waitFor']);
        log('inner after was called');
      });

      it('waits on before to finish before the example runs', function (){
        log('sync test');
        
        waitFor(function (){
          log('async test waitFor');
        });

        expect(_log).to(equal, ['sync before', 'async before finished', 'sync test']);
      });
    });

    // FIXME: The inner after doesn't get called!!!
    describe('unsuccessful tests', function (){
      before(function (){
        console.log('>>>>> This test throws but should not fail with the message "inner after was called"');
        waitFor(function (){
          expect(beforeCondition).to(beTrue);
        }, 100);
      });

      after(function (){
        log('inner after was called');
      });

      it('never gets called because the before should fail', function (){
        // This should pass because we should never get here
        throw new Error('We should never execute this test!!!!!');
      });
    });

  });
}});
