try { foo = require('foo-unit'); } catch (e){ if (process && module.exports){throw e;} }
foo.require('code/lib/foo-unit', 'foo');

foo.unit.exports(foo.unit, function (kw){ with(kw){
  describe('top level description', function (){
    it('loads', function (){
      expect(foo.unit).toNot(beNull);
    });
  });
}});
