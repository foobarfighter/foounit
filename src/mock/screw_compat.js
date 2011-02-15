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
    function format(actualCount, expectedCount){
      actualCount = actualCount || 0;
      return 'mock was called ' + actualCount +
        ' times, but was expected ' + expectedCount + ' times';
    };

    this.match = function (mockedFunc, countOrArgs){
      countOrArgs = countOrArgs || 1;
      assert.strictEqual(mockedFunc.totalCalls, countOrArgs, format(mockedFunc.totalCalls, countOrArgs)
      );
    }
  });

  foounit.addKeyword('withArgs', function (){
  });

  foounit.addKeyword('once', function (){
    return 1;
  });

  foounit.addKeyword('twice', function (){
    return 2;
  });

  foounit.addKeyword('thrice', function (){
    return 3;
  });

  foounit.assertMock = function (){
  };

  foounit.resetMocks = function (){
    repo.reset();
  };
})(foounit);
