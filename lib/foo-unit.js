
var foo = (function (){

  // Utility functions
  var mixin = function (target, source){
    for (var prop in source){
      if (source.hasOwnProperty(prop)){
        target[prop] = source[prop];
      }
    }
    return target;
  };

  var safeset = function (){
    var topObj, modulePath, mixins = [], obj;

    if (arguments.length <= 3){
      topObj     = arguments[0];
      modulePath = arguments[1];
      obj        = arguments[2];
    } else if (arguments.length == 4){
      topObj     = arguments[0];
      modulePath = arguments[1];
      mixins     = arguments[2];
      obj        = arguments[3];
    }

    if (obj && mixins.length){
      var target = obj;
      if (typeof obj == 'function'){ target = obj.prototype; }
      for (var i = 0, ii = mixins.length; i < ii; i++){
        mixin(target, mixins[i]);
      }
    }

    var modules = modulePath.split('.');
    var parentObj = topObj;

    for (var i = 0, ii = modules.length; i < ii; i++){
      var part = modules[i];
      if (!parentObj[part]){
        if (i == modules.length - 1){
          parentObj[part] = obj;
        } else {
          parentObj[part] = {};
        }
      } else if (i == modules.length - 1){
        var target = parentObj[part];
        parentObj[part] = mixin(obj, target);
      }
      parentObj = parentObj[part];
    }
  };

  var sniff = function (ns){
    try {
      var sys = require('sys');

      // Running under node
      safeset(ns, 'global', global);
      safeset(ns, 'puts',   sys.puts);
      safeset(ns, 'env',    'node.js');
      safeset(ns, 'onload', function (func){ func.apply(foo.global, []); });
      return;
    } catch (e){}

    
    safeset(ns, 'global', window);
    safeset(ns, 'puts',   function (){ console.log.apply(console, arguments); }); 
    safeset(ns, 'env',    'browser');
    safeset(ns, 'onload', function (func){ foo.global.onload = func; });
  }

  var setupConsole = function (){
    // Set up console
    var g = foo.global;
    if (g.console){ return; }

    if (g.air && g.air.Introspector && g.air.Introspector.Console){
      g.console = air.Introspector.Console;
      g.console.debug = console.log;
    }
  }

  var foo = {};

  // Determine the runtime environment and set
  // environment specific variables
  sniff(foo);
  setupConsole();
  safeset(foo, 'require');
  safeset(foo, 'mixin', mixin);

  var fm = function (str, not){
    var negation = (not) ? 'not' : '';
    return str.replace(':negation', negation);
  }

  safeset(foo, 'unit.matchers', {
    beTrue: {
      failureMessage: function (not, actual, expected){
        return fm('Expected ' + actual + ' to :negation be true', not);
      }

      , match: function(actual, expected){
        return actual === true;
      }
    }

    , beFalse: {
      failureMessage: function (not, actual, expected){
        return fm('Expected ' + actual + ' to :negation be false', not);
      }

      , match: function(actual, expected){
        return actual === false;
      }
    }

    , beNull: {
      failureMessage: function (not, actual){
        return fm('Expected ' + actual + ' to :negation be null', not);
      }

      , match: function(actual, strict){
        if (strict) return actual === null;
        return actual == null;
      }
    }

    , throwError: {
      _actualMessage: null,

      failureMessage: function (not, actual, expected){
        return fm('Expected "' + this._actualMessage + '" to :negation throw an error with message: "' + expected + '"', not);
      }

      , match: function(actual, expected){
        try {
          actual();
        } catch (e) {
          this._actualMessage = e.message;
          return e.message == expected;
        }
        return false;
      }
    }

    , occur: {
      // for expect(function() { return true; }).to(occur, in('10 seconds'));
    }
  });

  // foo unit keywords
  safeset(foo, 'unit.keywords', [foo.unit.matchers], {
    describe: function (description, func){
      var group = new foo.unit.ExampleGroup(this.getCurrentGroup(), description);
      this.getCurrentGroup().addGroup(group);
      this.setCurrentGroup(group);
      func.apply(this, []);
      this.setCurrentGroup(group.getParent());
    }

    , it: function (description, func){
      var example = new foo.unit.Example(this.getCurrentGroup(), description, func); 
      this.getCurrentGroup().addExample(example, func);
    }

    , expect: function (actual){
      return new foo.unit.Expectation(actual);
    }

    , before: function (func){
      this.getCurrentGroup().setBefore(func);
    }

    , after: function (func){
      this.getCurrentGroup().setAfter(func);
    }
  });

  safeset(foo, 'unit.Expectation', function (actual){
    this._actual = actual;

    this.to = function (matcher){
      var args = [this._actual].concat(Array.prototype.slice.call(arguments, 1));
      this.assert(false, matcher, args);
    }

    this.toNot = function (matcher){
      var args = [this._actual].concat(Array.prototype.slice.call(arguments, 1));
      this.assert(true, matcher, args);
    }

    this.assert = function (not, matcher, matcherArgs){
      var matched = matcher.match.apply(matcher, matcherArgs);
      if (!matched && !not){
        var failureMessageArgs = [not].concat(matcherArgs);
        throw new Error(matcher.failureMessage.apply(matcher, failureMessageArgs));
      }
    }
  });

  safeset(foo, 'unit.RunContext', function (){
  });

  // TODO: Add events handling for pass, fail and complete.
  safeset(foo, 'unit.Runner', function (example, level){
    this._example = example;
    this._level = level;
    this._passed = undefined;

    this.run = function (){
      var befores = this._example.getBefores();
      var afters = this._example.getAfters();
      var test = this._example.getTest();
      var context = new foo.unit.RunContext();

      this._passed = true; 
      try {
        for (var i = 0, ii = befores.length; i < ii; i++){
          befores[i].apply(context, []);
        }

        test.apply(context, []);

        for (var i = 0, ii = afters.length; i < ii; i++){
          afters[i].apply(context, []);
        }
      } catch (e){
        this._passed = false;
        this._message = e.message;
      }
    }

    this.getLevel = function (){
      return this._level;
    }

    this.getFullDescription = function (){
      return this._example.getFullDescription();
    }

    this.getMessage = function (){
      return this._message;
    }

    this.isSuccess = function (){
      return this._passed;
    }
  });

  safeset(foo, 'unit.ExampleGroup', function(parentGroup, description){
    this._groups = [];
    this._examples = [];
    this._before = null;
    this._after  = null;
    this._parent = parentGroup;
    this._description = description;

    this.setBefore = function (before){
      this._before = before;
    }

    this.getBefore = function (){
      return this._before;
    }

    this.setAfter = function (after){
      this._after = after;
    }

    this.getAfter = function (){
      return this._after;
    }

    this.getParent = function (){
      return this._parent;
    }

    this.getDescription = function (){
      return this._description;
    }

    this.addGroup = function (group){
      this._groups.push(group);
    }

    this.addExample = function (example){
      this._examples.push(example);
    }

    this.getExamples = function (){
      return this._examples;
    }

    this.getGroups = function (){
      return this._groups;
    }
  });

  safeset(foo, 'unit.Context', [foo.unit.keywords], function (group){
    this._currentGroup = group;

    this.getCurrentGroup = function (){
      return this._currentGroup;
    }

    this.setCurrentGroup = function (currentGroup){
      this._currentGroup = currentGroup;
    }
  });

  safeset(foo, 'unit.Example', function (parentGroup, description, func){
    this._parent = parentGroup;
    this._description = description;
    this._test = func;

    this.getBefores = function (){
      var befores = [];
      for (var group = this.getParent(); group; group = group.getParent()){
        var before = group.getBefore();
        if (!before){ continue; }
        befores.unshift(before);
      }
      return befores;
    }

    this.getAfters = function (){
      var afters = [];
      for (var group = this.getParent(); group; group = group.getParent()){
        var after = group.getAfter();
        if (!after){ continue; }
        afters.unshift(after);
      }
      return afters;
    }

    this.getFullDescription = function (){
      var exampleDescription = ' it ' + this.getDescription();
      var description = exampleDescription;
      for (var group = this.getParent(); group; group = group.getParent()){
        var groupDescription = group.getDescription();
        if (!groupDescription){ continue; }
        var conjunction = description == exampleDescription ? '' : ' and ';
        description = group.getDescription() + conjunction + description;
      }
      return description;
    }

    this.getTest = function (){
      return this._test;
    }

    this.getParent = function (){
      return this._parent;
    }

    this.getDescription = function (){
      return this._description;
    }
  });

  safeset(foo, 'unit', {
    _root: new foo.unit.ExampleGroup()

    // NOTE: When you want to add a root level test use add
    , add: function (func){
      var group = new foo.unit.ExampleGroup(this._root);
      this._root.addGroup(group);
      func.apply(group, [new foo.unit.Context(group)]);
    }

    , build: function (group, level){
      if (!group){return this.build(this._root, 0); }
      var runners = [];
     
      var examples = group.getExamples();
      for (var i = 0, ii = examples.length; i < ii; i++){
        var example = examples[i];
        var runner = new foo.unit.Runner(example, level);
        runners.push(runner);
      }

      var nextLevel = level+1;
      var groups = group.getGroups();
      for (var i = 0, ii = groups.length; i < ii; i++){
        runners = runners.concat(this.build(groups[i], nextLevel));
      }
      return runners;
    }
  });

  safeset(foo, 'suite.files', []);

  return foo;
})();

if (foo.env == 'node.js'){
  var node = require(__dirname + '/node');
  foo.require = node.require;
  foo.unit.report = node.unit.report;
  foo.unit.run = node.unit.run;
  foo.unit.exports = node.unit.exports;
  foo.unit.files = node.unit.files;
}
