var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with (kw) {
  describe('foounit.browser.XhrLoaderStrategy', function (){
    var strategy;

    before(function (){
      strategy = footest.browser.XhrLoaderStrategy();
    });

    describe('.require', function (){
      it('does not break stacktraces when an error is thrown from within the module', function (){
        var module = footest.require(__dirname + '/../../fixture/commonjs_module');
        try {
          module.throwError();
          throw new Error('unexpected');
        } catch (e){
          expect(e.message).toNot(match, /unexpected/);
          expect(e.stack).to(match, /commonjs_module\.js/);
        }
      });
    });

    describe('.load', function (){
      it('does not break stacktraces when an error is thrown from within the module', function (){
        footest.load(__dirname + '/../../fixture/noncommonjs_module');

        try {
          fixture.test.module.throwError();
          throw new Error('unexpected');
        } catch (e){
          expect(e.message).toNot(match, /unexpected/);
          expect(e.stack).to(match, /noncommonjs_module\.js/);
        }
      });
    })
  });
}});