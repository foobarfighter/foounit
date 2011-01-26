foounit.Example = function (test){
  this._test = test;
  this._status = 0;
  this._exception = null;
}

foounit.mixin(foounit.Example.prototype, {
  SUCCESS:    1
  , FAILURE:  2
  , PENDING:  3

  , isSuccess: function (){
    return this._status === this.SUCCESS;
  }

  , isFailure: function (){
    return this._status === this.FAILURE;
  }

  , getException: function (){
    return this._exception;
  }

  , setBefores: function (){
  }

  , run: function (runContext){
    try {
      this._test.apply(runContext, []);
      this._status = this.SUCCESS;
    } catch (e){
      this._exception = e;
      this._status = this.FAILURE;
    }
  }
});
