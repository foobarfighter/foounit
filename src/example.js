foounit.Example = function (description, test, pending){
  this._befores = [];
  this._test = test;
  this._afters  = [];
  this._description = description;

  this._status = 0;
  this._exception = null;

  if (pending === true) {
    this._status = this.PENDING;
  }
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

  , isPending: function (){
    return this._status === this.PENDING;
  }

  , getException: function (){
    return this._exception;
  }

  , setBefores: function (befores){
    this._befores = befores;
  }

  , getDescription: function (){
    return this._description;
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

  , onComplete: function (example){}

  , run: function (){
    if (this.isPending()){
      this.onComplete(this);
      return;
    }

    var runContext = {};

    // TODO:
    // Each example should run "blocks"
    // and those blocks should execute in
    // in a try..catch
    try {
      this._runBefores(runContext);
      this._test.apply(runContext, []);
      this._status = this.SUCCESS;
    } catch (e){
      this._exception = e;
      this._status = this.FAILURE;
    } finally {
       this._runAfters();
       this.onComplete(this);
    }
  }

  , _runBefores: function (runContext){
    var befores = this._befores;
    for (var i = 0; i < befores.length; ++i){
      befores[i].apply(runContext, []);;
    }
  }

  , _runAfters: function (runContext){
    var afters = this._afters;
    for (var i = afters.length - 1; i >= 0; --i){
      afters[i].apply(runContext, []);;
    }
  }
});
