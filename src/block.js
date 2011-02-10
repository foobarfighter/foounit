foounit.Block = function (func, failCallback, completeCallback){
  this._func = func;
  this._failCallback = failCallback;
  this._completeCallback = completeCallback;
}

foounit.mixin(foounit.Block.prototype, {
  // Called by foounit.Example
  onComplete: function (block){}

  , run: function (){
    var runContext = {};

    try {
      this._func.apply(runContext, []);
      this._completeCallback(this, runContext);
    } catch (e){
      this._failCallback(e, this);
    }
  }
});
