if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.matchers', function (){

    describe('.throwError', function (){
      it('asserts that an error is thrown', function (){
        var thrown = false
          , throwError = new footest.keywords.throwError();

        // Should pass because the block throws
        throwError.match('expected error', function (){
          thrown = true;
          throw new Error('expected error');
        });
        expect(thrown).to(beTrue);

        // Should throw an expected error
        try {
          throwError.match('should fail match', function (){});
          throw new Error('unexpected');
        } catch (e){
          expect(e.toString()).to(be, 'AssertionError:   "Missing expected exception. should fail match"');
        }

        // Should throw any error
        try {
          throwError.match(null, function (){});
          throw new Error('unexpected');
        } catch (e){
          expect(e.toString()).to(be, 'AssertionError:   "Missing expected exception (Error)."');
        }
      });
    });

    describe('.beGt', function (){
      xit('asserts expected is greater than actual', function (){
        throw new Error('todo');
      });
    });

    describe('.beLt', function (){
      xit('asserts expected is less than actual', function (){
        throw new Error('todo');
      });
    });

    describe('.beTrue', function (){
      it('asserts that actual is === true', function (){
        var matcher = new footest.keywords.beTrue();
        matcher.match(true, true);

        expect(function (){
          matcher.match('unused', false);
        }).to(throwError);
      });
    });

    describe('.beFalse', function (){
      xit('asserts that actual is === false', function (){
        throw new Error('todo');
      });
    });

    describe('.include', function (){
      xit('asserts that the actual array has an element === to expected', function (){
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
