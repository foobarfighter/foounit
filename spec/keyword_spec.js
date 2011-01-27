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

    describe('matchers', function (){
      it('mixes them into the keywords', function (){
        var called = false;
        footest.add(function (kw){ with(kw){
          expect(kw.be).to(be, be);
          called = true;
        }});

        expect(called).to(be, true);
      });
    });

    describe('.before', function (){
      it('adds a before callback to current group context', function (){
        footest.setBuildContext(new footest.BuildContext());
        footest.add(function (kw){ with(kw){
          before(function (){ return 'root'; });

          describe('group1', function (){
            before(function (){ return 'group1'; });

            describe('group1.1', function (){
              before(function (){ return 'group1.1'; });
            });
          });

          describe('group2', function (){
            before(function (){ return 'group2'; });
          });
        }});

        var root = footest.getBuildContext().getRoot();
        expect(root.getBefore()()).to(be, 'root');
        expect(root.getGroups()[0].getBefore()()).to(be, 'group1');
        expect(root.getGroups()[0].getGroups()[0].getBefore()()).to(be, 'group1.1');
        expect(root.getGroups()[1].getBefore()()).to(be, 'group2');
      });
    });

  });
}});
