if (typeof global !== 'undefined'){
  var foounit = require('../../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.mock.screw_compat', function (){
    describe('mock', function (){
      var obj;

      before(function (){
        obj = {};
        obj.foo = function (){ throw new Error('should not be called'); }
      });

      it('replaces the target with a function that keeps track of its call history', function (){
        mock(obj, 'foo');
        expect(obj.foo.totalCalls).to(beUndefined);
        expect(obj.foo.callArgs).to(beUndefined);

        obj.foo();
        expect(obj.foo.totalCalls).to(be, 1);
        expect(obj.foo.callArgs[0]).to(equal, []);

        obj.foo(1, 2, 3);
        expect(obj.foo.totalCalls).to(be, 2);
        expect(obj.foo.callArgs[1]).to(equal, [1, 2, 3]);
      });

      describe('when the target function does not exist', function (){
        it('raises an error', function (){
          expect(function (){
            mock(obj, 'bar');
          }).to(throwError, /"bar" is not a function that can be mocked/);
        });
      });

      describe('when there is a stub function', function (){
        var scope, args;

        before(function (){
          obj.baz = function (){ return 123; };
        });

        it('calls the stub function', function (){
          mock(obj, 'baz', function (){
            scope = this;
            args  = arguments;
            return 456
          });

          expect(obj.baz(1, 2, 3)).to(be, 456);
          expect(scope).to(be, obj);
          expect(args).to(equal, [1,2,3]);
        });
      });
    });

  });
}});
