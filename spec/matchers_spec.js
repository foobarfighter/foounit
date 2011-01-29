if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.matchers', function (){

    describe('.throwError', function (){
      it('asserts that an error is thrown', function (){
        throw new Error('todo');
      });
    });

    describe('.beGt', function (){
      it('asserts expected is greater than actual', function (){
        throw new Error('todo');
      });
    });

    describe('.beLt', function (){
      it('asserts expected is less than actual', function (){
        throw new Error('todo');
      });
    });

    describe('.beTrue', function (){
      it('asserts that actual is === true', function (){
        throw new Error('todo');
      });
    });

    describe('.beFalse', function (){
      it('asserts that actual is === false', function (){
        throw new Error('todo');
      });
    });

    describe('.include', function (){
      it('asserts that the actual array has an element === to expected', function (){
        throw new Error('todo');
      });
    });

    describe('.be', function (){
      it('does a strict equal', function (){
        var matcher = new footest.keywords.be();
        matcher.match('a', 'a');

        var thrown;
        try { matcher.match(undefined, null); }
        catch(e) { thrown = e; }
        if (!thrown){throw new Error('expected error to be thrown');}
      });
    });

    describe('equal', function (){
      it('does a deep ==', function (){
        var value = [1, { foo: 'bar' }, 3]
          , matcher = new footest.keywords.equal();
        matcher.match(value, value.concat());

        var thrown;
        try { matcher.match(value, value.concat([1])); }
        catch(e) { thrown = e; }
        if (!thrown){throw new Error('expected error to be thrown');}
      });
    });

  });
}});
