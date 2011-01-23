foounit.keywords = {
  it: function (description, test){
    var example = new foounit.Example(test);
    foounit
      .getBuildContext()
      .getCurrentGroup()
      .addExample(example);
  }

  , describe: function (description, builder){
    var parentGroup = foounit.getBuildContext().getCurrentGroup();
    var group = new foounit.ExampleGroup(description, builder);
    parentGroup.addGroup(group);
    //foounit.getBuildContext().setCurrentGroup(parentGroup);
  }
};
