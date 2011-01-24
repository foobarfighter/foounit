foounit.Example = function (test){
  this._test = test;
  this._status = 0;
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
  , run: function (runContext){
    try {
      this._test.apply(runContext, []);
      this._status = this.SUCCESS;
    } catch (e){
      this._status = this.FAILURE;
    }
  }
});
