var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.Example', function (){
    before(function (){
      mock(foounit, 'setTimeout', function (func, timeout){ func(); });
    });

    describe('.getStack', function (){
      it('always retrieves a stack trace', function (){
        var example = new footest.Example('example', function (){
          throw new Error('stack should be here');
        });
        example.run();
        expect(example.getStack()).toNot(beUndefined);
      });
    });
  });
}});
