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

/** Alias for xit **/
foounit.addKeyword('fuckit', foounit.keywords.xit);

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

/*
 * Defines a pending group in the BuildContext.
 * All examples and nested groups within this group will
 * be marked as pending.
 */
foounit.addKeyword('xdescribe', function (description, builder){
  var context = foounit.getBuildContext()
    , parentGroup = context.getCurrentGroup()
    , group = new foounit.ExampleGroup(description, builder, true);

  parentGroup.addGroup(group);

  context.setCurrentGroup(group);
  group.build();
  context.setCurrentGroup(parentGroup);
  return group;
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
foounit.addKeyword('waitFor', function (func, timeout){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.PollingBlock(func, timeout || foounit.settings.waitForTimeout);
  
  example.enqueue(block);
  return block;
});

/**
 * Adds a TimeoutBlock to the current block queue
 */
foounit.addKeyword('waitForTimeout', function (func, timeout){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.TimeoutBlock(func, timeout || foounit.settings.waitForTimeout);

  example.enqueue(block);
  return block;
});


/**
 * Adds a RunBlock to the current block queue that fails the test if it throws
 */
foounit.addKeyword('run', function (func){
  var example = foounit.getBuildContext().getCurrentExample()
    , block = new foounit.Block(func);

  example.enqueue(block);
  return block;
});
