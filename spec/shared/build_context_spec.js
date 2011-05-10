var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with (kw){
  describe('foounit.BuildContext', function (){
    var context;

    before(function (){
      context = new foounit.BuildContext();
    });

    describe('.getCurrentGroup', function (){
      describe('when there is no current group', function (){
        it('returns the root', function (){
          expect(context._currentGroup).to(beUndefined);
          expect(context.getCurrentGroup()).to(be, context.getRoot());
        });
      });

      describe('when there is a current group', function (){
        var group;

        before(function (){
          group = new foounit.ExampleGroup('test', function (){});
          context.setCurrentGroup(group);
        });

        it('returns the current group', function (){
          expect(context.getCurrentGroup()).to(be, group);
        });
      });
    });
  });
}});
