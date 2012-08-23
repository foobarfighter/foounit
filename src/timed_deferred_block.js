foounit.TimedDeferredBlock = function (func, timeout){
  this._func = func;
  this._timeout = timeout == null ? foounit.settings.waitForTimeout : timeout;
}

foounit.mixin(foounit.TimedDeferredBlock.prototype, foounit.Block.prototype);
foounit.mixin(foounit.TimedDeferredBlock.prototype, {
  getTimeout: function (){ return this._timeout; }

  , onTimeout: function (){}

  , run: function (){
    var self = this;

    this._hTimeout = foounit.setTimeout(function (){
      self.onTimeout(self);
      self.fail('timeout reached');
    }, this._timeout);

    this._func.apply({}, [this]);
  }

  , complete: function (){
    foounit.clearTimeout(this._hTimeout);
    this.onComplete(this);
  }

  , fail: function (exception){
    foounit.clearTimeout(this._hTimeout);
    this._exception = exception instanceof Error ? exception : new Error(exception);
    this.onFailure(this);
  }
});
