foounit.keywords = {
  it: function (description, test){
    var example = new foounit.Example(test);
    foounit
      .getBuildContext()
      .getCurrentGroup()
      .addExample(example);
  }

  , describe: function (description, builder){
    var context = foounit.getBuildContext()
      , parentGroup = context.getCurrentGroup()
      , group = new foounit.ExampleGroup(description, builder);

    parentGroup.addGroup(group);

    context.setCurrentGroup(group);
    group.build();
    context.setCurrentGroup(parentGroup);
  }

  , expect: function (actual){
    return new foounit.Expectation(actual);
  }
};
