(function (foounit){
  var pSlice = Array.prototype.slice;

  var MockRepository = function (){
    this._mocks = [];

    this.add = function (obj, funcStr){
      this._mocks.push([ obj, funcStr, obj[funcStr] ]);
    };

    this.reset = function (){
      var mocks = this._mocks;
      for (var i = mocks.length - 1; i >= 0; --i){
        var mock = mocks[i];
        // reset to original function
        mock[0][mock[1]] = mock[2];
      }
    };
  }

  var repo = new MockRepository();
  
  foounit.addKeyword('mock', function (obj, funcStr, stubFunc) {
    if (!obj[funcStr]){
      throw new Error('"' + funcStr + '" is not a function that can be mocked');
    }

    repo.add(obj, funcStr);

    obj[funcStr] = function (){
      var f = obj[funcStr];
      f.totalCalls = f.totalCalls !== undefined ? ++f.totalCalls : 1;
      f.callArgs   = f.callArgs || [];
      f.callArgs.push(pSlice.call(arguments, 0));

      if (stubFunc){
        return stubFunc.apply(obj, arguments);
      }
    }
  });

  foounit.addKeyword('haveBeenCalled', function (){
  });

  foounit.addKeyword('withArgs', function (){
  });

  foounit.addKeyword('once', function (){
  });

  foounit.addKeyword('twice', function (){
  });

  foounit.addKeyword('thrice', function (){
  });

  foounit.assertMock = function (){
  };

  foounit.resetMocks = function (){
    repo.reset();
  };
})(foounit);
