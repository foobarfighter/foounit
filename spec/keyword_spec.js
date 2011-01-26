if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.keywords', function (){

    // Create assertion building blocks
    describe('expect', function (){
      it('creates an expectation', function (){
        var foo = footest.keywords.expect('foo');
        if (foo.constructor !== footest.Expectation){
          throw new Error('expected foo to be a footest.Expectation');
        }
      });
    });

    //describe('.before', function (){
    //  it('executes a function before each example', function (){
    //    var order1 = [];
    //     
    //    footest.setBuildContext(new footest.BuildContext());
    //    footest.add(function (test){ with(test){
    //      before(function (){
    //        order1.push('before_root');
    //      });

    //      describe('group1', function (){
    //        before(function (){
    //          order1.push('before_group1');
    //        });

    //        it('execute1', function (){
    //          order1.push('execute1');
    //        });

    //        it('execute2', function (){
    //          order1.push('execute1');
    //        });
    //      });
    //    }});

    //    expect(order1).to(equal, [
    //      'before_root', 'before_group1', 'execute1',
    //      'before_root', 'before_group1', 'execute2'
    //    ]);
    //  });
    //});
  });
}});
