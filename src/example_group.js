foounit.ExampleGroup = (function (){

  // Private variables
  var _examples = []
    , _groups = []
    , _description = '';

  // Constructor
  var init = function (description, builder){
    _description = description;

    var context = foounit.getBuildContext();
    context.setCurrentGroup(this);
    builder.apply(context, []);
  }

  return function (){
    this.getExamples = function (){
      return _examples;
    }

    this.addExample = function (example){
      _examples.push(example);
    }

    this.addGroup = function (group){
      _groups.push(group);
    }

    this.getGroups = function (){
      return _groups;
    }

    init.apply(this, arguments);
  }
})();
