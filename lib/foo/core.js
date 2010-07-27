
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
      return;
    } catch (e){}
    
    safeset(ns, 'global', window);
    safeset(ns, 'puts',   function (){ console.log.apply(console, arguments); }); 
    safeset(ns, 'env',    'browser');
  }

  var foo = {};

  // Determine the runtime environment and set
  // environment specific variables
  sniff(foo);

  // Used for requiring dependencies
  safeset(foo, 'require', function (path){

  });

  safeset(foo, 'mixin', mixin);

  // foo unit keywords
  safeset(foo, 'unit.keywords', {
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


  safeset(foo, 'unit.matchers', {
    beTrue: {
      failureMessage: function (actual, expected, not){
      }

      , match: function(actual, expected){
      }
    }

    , occur: {
      // for expect(function() { return true; }).to(occur, in('10 seconds'));
    }
  });

  safeset(foo, 'unit.Expectation', function (actual){
    this._actual = actual;

    this.to = function (matcher, arg){
    }

    this.toNot = function (matcher, expected){
    }
  });

  safeset(foo, 'unit.Runner', function (example, level){
    this._example = example;
    this._level = level;

    this.run = function (){
      var befores = this._example.getBefores();
      var afters = this._example.getAfters();
      var test = this._example.getTest();
    }

    this.getLevel = function (){
      return this._level;
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
        befores.unshift(group.getBefore());
      }
      return befores;
    }

    this.getAfters = function (){
      var afters = [];
      for (var group = this.getParent(); group; group = group.getParent()){
        afters.unshift(group.getAfter());
      }
      return afters;
    }

    this.getTest = function (){
      return this._test;
    }
  });

  safeset(foo, 'unit', {
    _root: new foo.unit.ExampleGroup()

    , add: function (func){
      var group = new foo.unit.ExampleGroup(this._root);
      this._root.addGroup(group);
      func.apply(group, [new foo.unit.Context(group)]);
    }

    , build: function (group, level){
      if (!group){ return this.build(this._root, 0); }
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

  return foo;
})();

if (foo.env == 'node.js'){
  foo.mixin(exports, foo);
}
