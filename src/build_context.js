foounit.BuildContext = (function (){

  // Private variables
  var _currentGroup, _root;

  // Constructor
  return function (){
    this.getRoot = function (){
      _root = _root || new foounit.ExampleGroup('root', function (){});
    }

    this.setCurrentGroup = function (group){
      _currentGroup = group;
    }

    this.getCurrentGroup = function (){
      return _currentGroup;
    }
  }
})();
