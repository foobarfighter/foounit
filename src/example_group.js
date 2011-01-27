foounit.ExampleGroup = function (description, builder){
  this._description = description;
  this._builder = builder;
  this._before = null;
  this._examples = [];
  this._groups = [];
}

foounit.mixin(foounit.ExampleGroup.prototype, {
  build: function (){
    this._builder();
  }

  , getExamples: function (){
    return this._examples;
  }

  , addExample: function (example){
    this._examples.push(example);
  }

  , addGroup: function (group){
    this._groups.push(group);
  }

  , setBefore: function (func){
    this._before = func;
  }

  , getBefore: function (){
    return this._before;
  }

  , getGroups: function (){
    return this._groups;
  }

  , getDescription: function (){
    return this._description;
  }
});
