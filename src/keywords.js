/**
 * Creates an example to be added to the current group in the BuildContext
 */
foounit.addKeyword('it', function (description, test){
  var example = new foounit.Example(description, test);
  foounit
    .getBuildContext()
    .getCurrentGroup()
    .addExample(example);
  return example;
});

/**
 * Creates a pending example
 */
foounit.addKeyword('xit', function (description, test){
  var example = new foounit.Example(description, test, true);
  foounit
    .getBuildContext()
    .getCurrentGroup()
    .addExample(example);
  return example;
});

/**
 * Defines a before function in the context of the current group
 */
foounit.addKeyword('before', function (func){
  var group = foounit.getBuildContext().getCurrentGroup();
  group.setBefore(func);
});

/**
 * Defines an after function in the context of the current group
 */
foounit.addKeyword('after', function (func){
  var group = foounit.getBuildContext().getCurrentGroup();
  group.setAfter(func);
});


/**
 * Defines a group in the BuildContext
 */
foounit.addKeyword('describe', function (description, builder){
  var context = foounit.getBuildContext()
    , parentGroup = context.getCurrentGroup()
    , group = new foounit.ExampleGroup(description, builder);

  parentGroup.addGroup(group);

  context.setCurrentGroup(group);
  group.build();
  context.setCurrentGroup(parentGroup);
});

/**
 * Creates a foounit.Expectation
 */
foounit.addKeyword('expect', function (actual){
  return new foounit.Expectation(actual);
});

/**
 * Adds a polling block to the current block queue
 */
foounit.addKeyword('waitFor', function (func){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.PollingBlock(func);
  
  example.enqueue(block);
  return block;
});

