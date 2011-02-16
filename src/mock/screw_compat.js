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

    obj[funcStr].isMocked = true;
  });

  foounit.addKeyword('haveBeenCalled', function (){
    var equalMatcher = new foounit.keywords.equal();

    function format(actualCount, expectedCount){
      actualCount = actualCount || 0;
      return 'mock was called ' + actualCount +
        ' times, but was expected ' + expectedCount + ' times';
    };

    function assertCallCount(actualCallCount, expectedCallCount){
      assert.strictEqual(
        actualCallCount
        , expectedCallCount
        , format(actualCallCount, expectedCallCount)
      );
    };

    function wasCalledWithArgs(callArgs, expectedArgs){
      if (!callArgs){ return; }

      for (var i = 0; i < callArgs.length; ++i){
        try {
          equalMatcher.match(callArgs[i], expectedArgs);
          return true;
        } catch (e){}
      }
      return false;
    };

    this.match = function (mockedFunc, countOrArgs){
      if (!mockedFunc.isMocked){ throw new Error('Function has not been mocked'); }

      countOrArgs = countOrArgs || 1;

      if (countOrArgs.length !== undefined){
        if (wasCalledWithArgs(mockedFunc.callArgs, countOrArgs)){ return; }
        throw new Error('Function was not called with arguments: ' + countOrArgs);
      } else {
        assertCallCount(mockedFunc.totalCalls, countOrArgs);
      }
    }
  });

  foounit.addKeyword('withArgs', function (){
    return Array.prototype.slice.call(arguments, 0);
  });

  foounit.addKeyword('once',   1);
  foounit.addKeyword('twice',  2); 
  foounit.addKeyword('thrice', 3);

  foounit.resetMocks = function (){
    repo.reset();
  };
})(foounit);
