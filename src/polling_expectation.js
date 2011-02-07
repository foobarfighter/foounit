foounit.PollingExpectation = function (func, timeout){
  this._func = func;
  this._timeout = timeout;
}

foounit.mixin(foounit.PollingExpectation.prototype, {
  getTimeout: function (){
    return this._timeout;
  }
});
