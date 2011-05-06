foounit.BuildContext = function (){
  this,_currentGroup = undefined;
  this._currentExample = undefined;
  this._root = undefined;
};

foounit.mixin(foounit.BuildContext.prototype, {
  getRoot: function (){
    this._root = this._root || new foounit.ExampleGroup('root', function (){});
    return this._root;
  }

  , setCurrentGroup: function (group){
    this._currentGroup = group;
  }

  , getCurrentGroup: function (){
    if (!this._currentGroup){
      this.setCurrentGroup(this.getRoot());
    }
    return this._currentGroup;
  }

  , setCurrentExample: function (example){
    this._currentExample = example;
  }

  , getCurrentExample: function (){
    return this._currentExample;
  }
});
