foounit.Example = (function (test){
  var SUCCESS = 1, FAILURE = 2, PENDING = 3;

  // Private variables
  var _test
    , _status;

  // Constructor
  var init = function (test){
    _test = test;
  }

  return function (){
    this.isSuccess = function (){
      return _status === SUCCESS;
    }

    this.isFailure = function (){
      return _status === FAILURE;
    }

    this.run = function (runContext){
      try {
        _test.apply(runContext, []);
        _status = SUCCESS;
      } catch (e){
        _status = FAILURE;
      }
    }

    init.apply(this, arguments);
  }
})();
