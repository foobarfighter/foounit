if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.base', function (){
    describe('.build', function (){
      it('builds an array of all tests to be run', function (){
        console.log('--------> test2');
        footest.setBuildContext(new foounit.BuildContext());

        var log = []
          , before0 = function (){}
          , test0 = function (){};

        footest.add(function (){
          before(before0);
          it('test0', test0);
        });

        var examples = footest.build();
        expect(examples[0].getBefores()[0])  .to(be, test0);
        expect(examples[0].getTest())        .to(be, test0);
      });
    });

  });
}});
