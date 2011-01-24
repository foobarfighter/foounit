foounit.BuildContext = function (){
  this,_currentGroup = null;
  this._root = null;
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
    return this._currentGroup;
  }
});
