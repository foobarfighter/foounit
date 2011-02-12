foounit.Block = function (func){
  this._func = func;
  this._exception = undefined;
}

foounit.mixin(foounit.Block.prototype, {
  onComplete: function (block){}
  , onFailure: function (block){}
  , getException: function (){ return this._exception; }

  , run: function (){
    var runContext = {};

    try {
      this._func.apply(runContext, []);
      this.onComplete(this);
    } catch (e){
      this._exception = e;
      this.onFailure(this);
    }
  }
});
