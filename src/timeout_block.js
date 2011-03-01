foounit.TimeoutBlock = function (func, timeout){
  this._func = func;
  this._tasks = [];
  this._timeout = timeout;
  this._exception = undefined;
  this._pollInterval = 50;
};

foounit.mixin(foounit.TimeoutBlock.prototype, foounit.BlockQueue.prototype);
foounit.mixin(foounit.TimeoutBlock.prototype, {
  getTimeout: function (){ return this._timeout; }

  , run: function (){
    var self = this
      , start = foounit.getTime()
      , passed = true
      , interval;

    interval = foounit.setInterval(function (){
      try {
        self._func.apply({}, []);
        foounit.clearInterval(interval);
        self._exception = new Error('timeout was not reached');
        self.onFailure(self);
      } catch (e){
        if (foounit.getTime() - start > self._timeout){
          foounit.clearInterval(interval);
          self.onComplete(self);
        }
      }
    }, this._pollInterval);
  }
});

