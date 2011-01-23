var foounit = require(__dirname + '/../dist/foo-unit');

var foo = foounit.require(':src/foo-unit');

// Note: These tests are a little bit weird because
// they are testing some of the building blocks of foounit.
// We are also not using node's assertions because
// these tests need to run in the browser.

/**
 * Asserts if two things are ===.  Note we aren't using
 * node assertions because these tests need to run in
 * the browser as well.
 */
var assertEqual = function (expected, actual, message){
  if (expected !== actual){
    throw new Error(message || 'assertion failed');
  }
}

var report = function (message){
  if (foounit.hostenv.type == 'node'){
    console.log(message);
  } else {
    document.body.innerHTML = message;
  }
}

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
  var exampleGroup;

  exampleGroup = new foounit.ExampleGroup('test group', function (){
    foounit.keywords.it('example', function (){});
    foounit.keywords.it('example2', function (){});
  });
  assertEqual(2, exampleGroup.getExamples().length);

  exampleGroup = new foounit.ExampleGroup('test group', function (){
    foounit.keywords.describe('group1', function (){
      foounit.keywords.describe('group1.1', function(){
      });
    });

    foounit.keywords.describe('group2', function (){
    });
  });
  assertEqual(2, exampleGroup.getGroups().length);
  assertEqual(1, exampleGroup.getGroups()[0].length);
  assertEqual(2, exampleGroup.getGroups()[1].length);
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
}

/************** /Bootstrap tests **************/

try {
  testExample();
  testExampleGroup();
  testFoounitAdd();

} catch (e){
  report('!!!!! Bootstrap tests FAILED: ' + e.message);
  report(e.stack);
}

 

