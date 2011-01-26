foounit.BuildContext = function (){
  this,_currentGroup = null;
  this._status = null
  this._root = null;
};

foounit.mixin(foounit.BuildContext.prototype, {
  SUCCESS:    1
  , FAILURE:  2
  , PENDING:  3

  , getRoot: function (){
    this._root = this._root || new foounit.ExampleGroup('root', function (){});
    return this._root;
  }

  , setCurrentGroup: function (group){
    this._currentGroup = group;
  }

  , getCurrentGroup: function (){
    return this._currentGroup;
  }

  , isFailure: function (){
    return this._status === this.FAILURE;
  }

  , setFailure: function (bool){
    this._status = bool ? this.FAILURE : null;
  }
});
