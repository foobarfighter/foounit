foounit.PollingBlock = function (func){
  this._func = func;
  this._tasks = [];
};

foounit.mixin(foounit.PollingBlock.prototype, foounit.BlockQueue.prototype);

