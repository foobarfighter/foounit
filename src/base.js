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
    // Default timeout setting for waitFor keyword
    waitForTimeout: 5000
  };

  // TODO: Make settings configurable
  foounit.settings = {};
  foounit.mixin(foounit.settings, foounit.defaults);

  /**
   * Ressettable wrappers for your pleasure
   */
  foounit.setInterval   = function (func, interval) {
    return foounit.hostenv.global.setInterval(func, interval);
  };
  foounit.clearInterval = function (handle) {
    return foounit.hostenv.global.clearInterval(handle);
  };
  foounit.setTimeout    = function (func, timeout) {
    return foounit.hostenv.global.setTimeout(func, timeout)
  };
  foounit.clearTimeout  = function (handle) {
    return foounit.hostenv.global.clearTimeout(handle);
  };
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
   * Gets the test foounit.Suite object.  If the suite has
   * not been set then it creates a new test suite
   */
  var _suite;
  foounit.getSuite = function (){
    _suite = _suite || new foounit.Suite();
    return _suite;
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
   * Set the loader strategy
   */
  foounit.setLoaderStrategy = function (strategy){
  }

  /**
   * Mounts a special path for use in foounit.require and foounit.load
   */
  var _mounts = {};
  foounit.mount = function (key, path){
    _mounts[key] = path;
  }

  /**
   * Unmounts a special path to be used by foounit.require and foounit.load
   */
  foounit.unmount = function (key, path){
    delete _mounts[key];
  }

  /**
   * Returns the mount structure
   */
  foounit.getMounts = function (){
    return _mounts;
  }

  /**
   * Translates mounted paths into a physical path
   */
  foounit.translatePath = (function (){
    var regex = /:(\w+)/g;

    return function (path){
      var file = path.replace(regex, function (match, mount){
        return _mounts[mount] ? _mounts[mount] : match;
      });
      return file;
    }
  })();

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
    var befores = [], afters = [], descriptions = [];

    var addExamples = function (group){
      var examples = group.getExamples();
      for (var i = 0, ii = examples.length; i < ii; ++i){
        examples[i].setBefores(befores.concat());
        examples[i].setAfters(afters.concat());
        examples[i].setDescriptions(descriptions.concat());
        runners.push(examples[i]);
      }
    }

    var recurseGroup = function (group){
      befores.push(group.getBefore());
      afters.push(group.getAfter());
      descriptions.push(group.getDescription());

      addExamples(group);

      var groups = group.getGroups();
      for (var i = 0, ii = groups.length; i < ii; ++i){
        recurseGroup(groups[i]);
      }

      befores.pop();
      afters.pop();
      descriptions.pop();
    }

    var runners = [];

    var tic = new Date().getTime();
    recurseGroup(foounit.getBuildContext().getRoot());
    console.log('>> foounit build time: ', new Date().getTime() - tic);

    return runners;
  }

  /**
   * Report the results of a single example.  This is called
   * after an example has finished running and before the next
   * example begins.
   */
  foounit.reportExample = function (example){
    throw new Error('foounit.reportExample is abstract');
  }

  /**
   * Report the results of the entire test suite.
   */
  foounit.report = function (info){
    throw new Error('foounit.report is abstract');
  }

  /**
   * Executes an array of tests
   */
  foounit.execute = function (examples){
    var pending = []
      , passCount = 0, failCount = 0 
      , queue = new foounit.WorkQueue(examples);

    var tic = new Date().getTime();

    queue.onTaskComplete = function (example){
      try {
        if (example.isSuccess()){
          ++passCount;
        } else if (example.isFailure()){
          ++failCount;
        } else if (example.isPending()){
          pending.push(example.getFullDescription());
        }

        foounit.reportExample(example);
      } catch (e) {
        console.log('Error in onTaskComplete: ', e.message);
      }
    };

    queue.onComplete = function (queue){
      try {
        foounit.report({
          passCount:  passCount
        , failCount:  failCount
        , totalCount: passCount + failCount + pending.length
        , pending:    pending
        , runMillis:  new Date().getTime() - tic
        });
      } catch (e){
        console.log('Error in onComplete: ', e);
      }
    };

    queue.run();
  }

  /**
   * Private scope variable for hosting the foounit keywords
   */
  var _kwScope;

  /**
   * foounit keyword context
   */
  foounit.keywords = {};

  /**
   * Adds a keyword and some definition of functionality
   */
  foounit.addKeyword = function (keyword, definition){
    foounit.keywords[keyword] = definition;
    if (_kwScope){ _kwScope[keyword] = definition; }
  }

  /**
   * Removes a keyword from the foounit.keywords object
   * and from the kwScope
   */
  foounit.removeKeyword = function (keyword){
    delete foounit.keywords[keyword];
    if (_kwScope){ delete _kwScope[keyword]; }
  };

  (function (){

    // Return a matcher keyword suffix
    // keyword = haveBeenCalled returns HaveBeenCalled
    var sfix = function (keyword) {
      return keyword.substr(0, 1).toUpperCase() + keyword.substr(1)
    };

    /**
     * Adds a matcher
     */
    foounit.addMatcher = function (matcherKeyword, definition){
      foounit.addKeyword(matcherKeyword, definition);   // Add the keyword to the kw scope

      var suffix = sfix(matcherKeyword)
        , instance = new definition()
        , proto = foounit.Expectation.prototype;
      
      proto['to'    + suffix] = instance.match;
      proto['toNot' + suffix] = instance.notMatch;
    }

    /**
      * Removes a matcher
      */
    foounit.removeMatcher = function (matcherKeyword){
      foounit.removeKeyword(matcherKeyword);            // Remove the keyword from the kw scope

      var suffix = sfix(matcherKeyword)
        , proto = foounit.Expectation.prototype;
      
      delete proto['to'    + suffix];
      delete proto['toNot' + suffix];
    }

  })();

  /**
   * Puts all of the foounit keywords in the global scope
   */
  foounit.globalize = function (){
    return this.scope(this.hostenv.global);
  }

  /**
   * Mixes in all of the foounit keywords into scope object that was passed
   */
  foounit.scope = function (obj){
    _kwScope = obj ? foounit.mixin(obj, foounit.keywords) : obj;
    return this;
  }

  /**
   * Retrieve the object that was set for the keyword scope
   */
  foounit.getScope = function (){
    return _kwScope;
  };


})(foounit);

// If this is node then we need to mixin and include
// the node adapter immediately.
if (foounit.hostenv.type == 'node'){
  module.exports = foounit;
}
