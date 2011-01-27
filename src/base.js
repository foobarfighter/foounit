// Copyright Bob Remeika 2011-forever

// This file consists of some host environment bootstrapping and discovery.
foounit = typeof foounit === 'undefined' ?  {} : foounit;

// Appends .hostenv and .mixin to foounit
(function (foounit){

  /**
   * Throws a bootstrapping error
   */
  var _throwError = function (message){
    throw new Error('foounit: bootstrap: ' + message);
  }

  /**
   * Requisite host environment params
   */
  foounit.hostenv = (function (){
    var _type = 'unknown';

    // Host environment is browser-like
    if (typeof window !== 'undefined'){
      _type = 'browser';
    } else if (typeof global !== 'undefined'){
      _type = 'node';
    } else {
      _throwError('Unrecognized environment');
    }

    return { type: _type };
  })();

  /**
   * Does a shallow copy
   */
  foounit.mixin = function (target, source){
    for (var prop in source){
      if (source.hasOwnProperty(prop)){
        target[prop] = source[prop];
      }
    }
    return target;
  };


  /**
   * Function used while building up the tests
   */
  var _buildContext;
  foounit.setBuildContext = function (context){
    _buildContext = context;
  }

  foounit.getBuildContext = function (){
    _buildContext = _buildContext || new foounit.BuildContext();
    return _buildContext;
  }

  /**
   * Adds groups / tests to the root level ExampleGroup
   */
  foounit.add = function (func){
    var context = foounit.getBuildContext();
    context.setCurrentGroup(context.getRoot());
    func.call(context, foounit.keywords);
  }

  /**
   * Builds an array of tests to be run
   */
  foounit.build = function (){
    var addExamples = function (group){
      var examples = group.getExamples();
      for (var i = 0, ii = examples.length; i < ii; ++i){
        runners.push(examples[i]);
      }
    }

    var recurseGroup = function (group){
      var groups = group.getGroups();
      for (var i = 0, ii = groups.length; i < ii; ++i){
        addExamples(groups[i]);
        recurseGroup(groups[i]);
      }
    }

    var runners = []
      , root = foounit.getBuildContext().getRoot();
    addExamples(root);
    recurseGroup(root);

    return runners;
  }

  /**
   * Returns true if the test suite has failed
   */
  foounit.isFailure = function (){
    return foounit.getBuildContext().isFailure();
  }

  /**
   * Executes an array of tests
   */
  foounit.execute = function (runners){
    for (var i = 0, ii = runners.length; i < ii; ++i){
      var runner = runners[i];
      runner.run();
      // TODO: Implement report
      if (runner.isFailure()){
        foounit.getBuildContext().setFailure(true);
        console.log('test failed: ' + runner.getException().stack);
      } else if (runner.isSuccess()){
        var sys = require('sys');
        sys.print('.');
      }
    }

    console.log('');
    // TODO: This doesn't work
    //if (foounit.isFailure()){
    //  console.log('!!FAIL');
    //} else {
    //  console.log('All tests passed.');
    //}
  }

  /**
   * foounit keyword context
   */
  foounit.keywords = {};

  /**
   * Adds a keyword and some definition of functionality
   */
  foounit.addKeyword = function (keyword, definition){
    foounit.keywords[keyword] = definition;
  }

})(foounit);

// If this is node then we need to mixin and include
// the node adapter immediately.
if (foounit.hostenv.type == 'node'){
  module.exports = foounit;
}

