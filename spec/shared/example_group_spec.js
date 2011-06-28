var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.ExampleGroup', function (){
    describe('when the pending flag is true', function (){
      it('makes all examples as pending', function (){
        var group = new footest.ExampleGroup('parent', function (){}, true);
        
        expect(group.isPending()).to(beTrue);

        group.setBefore(function (){ runCount++; });
        group.setAfter(function (){ runCount++; });

        var example = new footest.Example('test1', function (){});
        group.addExample(example);
        expect(example.isPending()).to(beTrue);

        var subgroup = new footest.ExampleGroup('subgroup', function (){}); 
        group.addGroup(subgroup);
        expect(subgroup.isPending()).to(beTrue);

        var subexample = new footest.Example('test2', function (){});
        subgroup.addExample(subexample);
        expect(subexample.isPending()).to(beTrue);
      });
    });
  });
}});
