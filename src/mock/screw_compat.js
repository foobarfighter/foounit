if (foounit.hostenv.type == 'node'){
  var assert = require('assert');
}

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
  
  foounit.addKeyword('mock', function (obj, funcStr, stubFunc){
    if (arguments.length == 1 && typeof obj == 'function'){
      obj = { callback: obj };
      funcStr = 'callback';
      stubFunc = obj.callback;
    }

    if (!obj[funcStr]){
      throw new Error('"' + funcStr + '" is not a function that can be mocked');
    }

    repo.add(obj, funcStr);

    obj[funcStr] = function (){
      var f = obj[funcStr];
      f.totalCalls = f.totalCalls !== undefined ? ++f.totalCalls : 1;
      f.callArgs   = f.callArgs || [];

      var args = pSlice.call(arguments, 0);
      f.callArgs.push(args.concat());
      f.mostRecentArgs = args.concat();

      if (stubFunc){
        return stubFunc.apply(this, arguments);
      }
    }

    obj[funcStr].isMocked = true;

    return obj[funcStr];
  });

  foounit.addKeyword('haveBeenCalled', function (){
    var equalMatcher = new foounit.keywords.equal();

    function format(actualCount, expectedCount, not){
      var notStr = not ? ' not' : '';
      actualCount = actualCount || 0;
      return 'mock was called ' + actualCount +
        ' times, but was' + notStr + ' expected ' + expectedCount + ' times';
    };

    function assertMocked(func){
      if (func.isMocked){ return; }
      throw new Error('Function has not been mocked');
    }

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
      assertMocked(mockedFunc);

      countOrArgs = countOrArgs || 1;

      if (countOrArgs.length !== undefined){
        if (wasCalledWithArgs(mockedFunc.callArgs, countOrArgs)){ return; }
        throw new Error('Function was not called with arguments: ' + countOrArgs);
      } else {
        assert.strictEqual(
         mockedFunc.totalCalls 
          , countOrArgs
          , format(mockedFunc.totalCalls, countOrArgs)
        );
      }
    }

    this.notMatch = function (mockedFunc, countOrArgs){
      assertMocked(mockedFunc);

      countOrArgs = countOrArgs || 1;

      if (countOrArgs.length !== undefined){
        if (!wasCalledWithArgs(mockedFunc.callArgs, countOrArgs)){ return; }
        throw new Error('Function was called with arguments: ' + countOrArgs);
      } else {
        assert.notStrictEqual(
         mockedFunc.totalCalls 
          , countOrArgs
          , format(mockedFunc.totalCalls, countOrArgs, true)
        );
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
