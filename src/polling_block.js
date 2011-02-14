foounit.PollingBlock = function (func, timeout){
  this._func = func;
  this._tasks = [];
  this._timeout = timeout;
  this._exception = undefined;
  this._pollInterval = 50;
};

foounit.mixin(foounit.PollingBlock.prototype, foounit.BlockQueue.prototype);
foounit.mixin(foounit.PollingBlock.prototype, {
  getTimeout: function (){ return this._timeout; }

  , run: function (){
    var self = this
      , start = foounit.getTime()
      , interval;

    interval = foounit.setInterval(function (){
      try {
        self._func.apply({}, []);
        foounit.clearInterval(interval);
        self.onComplete(self);
      } catch (e){
        if (foounit.getTime() - start >= self._timeout){
          foounit.clearInterval(interval);
          e.message = 'waitFor timeout: ' + e.message;
          self._exception = e;
          self.onFailure(self);
        }
      }
    }, this._pollInterval);
  }
});

