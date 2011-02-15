(function (foounit){
  var pSlice = Array.prototype.slice;
  
  foounit.addKeyword('mock', function (obj, funcStr, stubFunc) {
    if (!obj[funcStr]){
      throw new Error('"' + funcStr + '" is not a function that can be mocked');
    }

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

  foounit.reset = function (){
  };
})(foounit);
