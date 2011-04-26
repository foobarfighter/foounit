foounit.add(function (kw){ with (kw){
  describe('foounit.load', function (){
    before(function (){
      expect(typeof fixture).to(be, 'undefined');
    });

    after(function (){
      delete global['fixture'];
      expect(typeof fixture).to(be, 'undefined');
    });

    it('loads a JS file in the global scope', function (){
      foounit.load(':test/fixture/noncommonjs_module');
      expect(fixture.test.module).toNot(beUndefined);
    });
  });
}});
