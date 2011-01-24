var foounit = require(__dirname + '/../dist/foo-unit');

var foo = foounit.require(':src/foo-unit');

// Note: These tests are a little bit weird because
// they are testing some of the building blocks of foounit.
// We are also not using node's assertions because
// these tests need to run in the browser.


/************** Bootstrap tests **************/
var testExample = function (){
  var example, context;

  example = new foo.Example(function (){}); 
  example.run(context);
  assertEqual(true, example.isSuccess());
  assertEqual(false, example.isFailure());

  example = new foo.Example(function (){
    throw new Error('fail!');
  });
  example.run(context);
  assertEqual(false, example.isSuccess());
  assertEqual(true, example.isFailure());
}

var testExampleGroup = function (){
  var initGroup = function (group){
    foounit.getBuildContext().setCurrentGroup(group);
    group.build();
  }

  var exampleGroup;

  exampleGroup = new foounit.ExampleGroup('test group 1', function (){
    foounit.keywords.it('example', function (){});
    foounit.keywords.it('example2', function (){});
  });
  initGroup(exampleGroup);
  assertEqual(2, exampleGroup.getExamples().length);

  exampleGroup = new foounit.ExampleGroup('test group 2', function (){
    with(foounit.keywords){
      describe('group1', function (){
        describe('group1.1', function(){});
      });
      describe('group2', function (){});
    }
  });

  initGroup(exampleGroup);
  assertEqual(2, exampleGroup.getGroups().length);
  assertEqual(1, exampleGroup.getGroups()[0].getGroups().length);
  assertEqual(0, exampleGroup.getGroups()[1].getGroups().length);
}

var testFoounitAdd = function (){
  foounit.add(function (kw){ with(kw){
    describe('group1', function (){
      it('example1.1', function (){
      });
      it('example1.2', function (){
      });
    });
    describe('group2', function (){
      it('example2.1', function (){
      });
    });
  }});

  var root = foounit.getBuildContext().getRoot();
  assertEqual(2, root.getGroups().length);
  assertEqual(2, root.getGroups()[0].getExamples().length);
  assertEqual(1, root.getGroups()[1].getExamples().length);
}

var testFoounitBuild = function (){
  foounit.add(function (kw){ with(kw){
    it('fails', function (){
      throw new Error('fail!');
    });
    describe('group1', function (){
      it('passes', function (){});
    });
  }});

  assertEqual(2, foounit.build().length);
}

var testFoounitRun = function (){
  foounit.add(function (kw){ with(kw){
    it('fails', function (){
      throw new Error('fail!');
    });
    describe('group1', function (){
      it('passes', function (){});
    });
  }});

  var runners = foounit.build();
  foounit.execute(runners);

  var root = foounit.getBuildContext().getRoot();
  assertEqual(false, root.getExamples()[0].isSuccess());
  assertEqual(true,  root.getExamples()[0].isFailure());
}


/************** /Bootstrap tests **************/

/****************** Helpers *******************/

/**
 * Asserts if two things are ===.  Note we aren't using
 * node assertions because these tests need to run in
 * the browser as well.
 */
var assertEqual = function (expected, actual, message){
  if (expected !== actual){
    message = message || 'assertion failed';
    message += ': expected ' + expected + ', but got ' + actual;
    throw new Error(message);
  }
}

var report = function (message){
  if (foounit.hostenv.type == 'node'){
    console.log(message);
  } else {
    document.body.innerHTML = message;
  }
}

var reset = function (){
  foounit.setBuildContext(new foounit.BuildContext());
}
/***************** /Helpers *******************/


try {
  reset();
  testExample();

  reset();
  testExampleGroup();
  
  reset();
  testFoounitAdd();

  reset();
  testFoounitBuild();

  reset();
  testFoounitRun();

  report('Bootstrap tests PASSED');
} catch (e){
  report('!!!!! Bootstrap tests FAILED: ' + e.message);
  report(e.stack);
}

 

