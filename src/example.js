foounit.Example = function (description, test){
  this._befores = [];
  this._test = test;
  this._afters  = [];
  this._description = description;

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

  , setBefores: function (befores){
    this._befores = befores;
  }

  , getBefores: function (){
    return this._befores;
  }

  , setAfters: function (afters){
    this._afters = afters;
  }

  , getAfters: function (){
    return this._afters;
  }

  , getTest: function (){
    return this._test;
  }

  , run: function (runContext){
    runContext = runContext || {};

    try {
      this._runBefores(runContext);
      this._test.apply(runContext, []);
      this._status = this.SUCCESS;
    } catch (e){
      this._exception = e;
      this._status = this.FAILURE;
    } finally {
      // this._runAfters();
    }
  }

  , _runBefores: function (runContext){
    var befores = this._befores;
    for (var i = 0; i < befores.length; ++i){
      befores[i].apply(runContext, []);;
    }
  }
});
