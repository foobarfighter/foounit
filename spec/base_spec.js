if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  describe('foounit.base', function (){
    describe('.build', function (){
      it('builds an array of all tests to be run', function (){
        var bc = footest.getBuildContext();
        footest.setBuildContext(new footest.BuildContext());

        var log = []
          , before0 = function (){ var x = 'before0'; }
          , before1 = function (){ var x = 'before1'; }
          , before2 = function (){ var x = 'before2'; }
          , before3 = function (){ var x = 'before3'; }
          , test0 = function (){ var y = 'test0'; }
          , test1 = function (){ var y = 'test1'; }
          , test2 = function (){ var y = 'test2'; }
          , test3 = function (){ var y = 'test3'; };

        footest.add(function (){
          before(before0);
          it('test0', test0);
          describe('group1', function (){
            before(before1);
            it('test1', test1);
            describe('group2', function (){
              before(before2);
              it('test2', test2);
            });
          });
          describe('group3', function (){
            before(before3);
            it('test3', test3);
          });
        });

        var examples = footest.build();
        expect(examples[0].getBefores()[0])  .to(be, before0);
        expect(examples[0].getTest())        .to(be, test0);

        expect(examples[1].getBefores()[0])  .to(be, before0);
        expect(examples[1].getBefores()[1])  .to(be, before1);
        expect(examples[1].getTest())        .to(be, test1);

        expect(examples[2].getBefores()[0])  .to(be, before0);
        expect(examples[2].getBefores()[1])  .to(be, before1);
        expect(examples[2].getBefores()[2])  .to(be, before2);
        expect(examples[2].getTest())        .to(be, test2);

        expect(examples[3].getBefores()[0])  .to(be, before0);
        expect(examples[3].getBefores()[1])  .to(be, before3);
        expect(examples[3].getTest())        .to(be, test3);

        footest.setBuildContext(bc);
      });
    });

  });
}});
