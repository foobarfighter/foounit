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
      _global = window;
    } else if (typeof global !== 'undefined'){
      _type = 'node';
      _global = global;
    } else {
      _throwError('Unrecognized environment');
    }

    return { type: _type, global: _global };
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
   * Default settings
   */
  foounit.defaults = {
    waitForTimeout: 5000
  };

  // TODO: Make settings configurable
  foounit.settings = {};
  foounit.mixin(foounit.settings, foounit.defaults);

  /**
   * Ressettable wrappers for your pleasure
   */
  foounit.setInterval   = foounit.hostenv.global.setInterval;
  foounit.clearInterval = foounit.hostenv.global.clearInterval;
  foounit.setTimeout    = foounit.hostenv.global.setTimeout;
  foounit.clearTimeout  = foounit.hostenv.global.clearTimeout;
  foounit.getTime       = function (){ return new Date().getTime(); };

  /**
   * Returns a function bound to a scope
   */
  foounit.bind = function (scope, func){
    return function (){
      return func.apply(scope, arguments);
    }
  }

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
    var befores = [], afters = [];

    var addExamples = function (group){
      var examples = group.getExamples();
      for (var i = 0, ii = examples.length; i < ii; ++i){
        examples[i].setBefores(befores.concat());
        examples[i].setAfters(afters.concat());
        runners.push(examples[i]);
      }
    }

    var recurseGroup = function (group){
      befores.push(group.getBefore());
      afters.push(group.getAfter());

      addExamples(group);

      var groups = group.getGroups();
      for (var i = 0, ii = groups.length; i < ii; ++i){
        recurseGroup(groups[i]);
      }

      befores.pop();
      afters.pop();
    }

    var runners = [];
    recurseGroup(foounit.getBuildContext().getRoot());

    return runners;
  }

  /**
   * Report the results of a single example.  This is called
   * after an example has finished running and before the next
   * example begins.
   */
  foounit.reportExample = function (example){
    var sys = require('sys');
    if (example.isFailure()){
      console.log('test failed: ' + example.getException().stack);
    } else if (example.isSuccess()){
      sys.print('.');
    } else if (example.isPending()){
      sys.print('P');
    }
  }

  /**
   * Report the results of the entire test suite.
   */
  foounit.report = function (info){
    if (info.pending.length){
      var pending = info.pending;
      console.log("\n");
      for (var i = 0, ii = pending.length; i < ii; ++i){
        console.log('PENDING: ' + pending[i]);
      }
    }

    if (info.failCount){
      console.log("\n" + info.failCount + ' tests FAILED!!!!!!!!!!!!');
    } else {
      console.log("\nAll tests passed.");
    }

    var endMessage = info.totalCount + ' total.';
    if (info.pending.length){
      endMessage += '  ' + info.pending.length + ' pending.';
    }
    console.log(endMessage);
  }

  /**
   * Executes an array of tests
   */
  foounit.execute = function (examples){
    var pending = []
      , passCount = 0, failCount = 0 
      , queue = new foounit.WorkQueue(examples);

    queue.onTaskComplete = function (example){
      try {
        if (example.isSuccess()){
          ++passCount;
        } else if (example.isFailure()){
          ++failCount;
        } else if (example.isPending()){
          pending.push(example.getDescription());
        }

        foounit.reportExample(example);
      } catch (e) {
        console.log('Error in onTaskComplete: ', e);
      }
    };

    queue.onComplete = function (queue){
      try {
        foounit.report({
          passCount:  passCount
        , failCount:  failCount
        , totalCount: passCount + failCount + pending.length
        , pending:    pending
        });
      } catch (e){
        console.log('Error in onComplete: ', e);
      }
    };

    queue.run();
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

