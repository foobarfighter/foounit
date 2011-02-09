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

  , onComplete: function (example){}

  // Key events in the run lifecycle
  , onBeforesComplete: function (failedAt){}
  , onTestComplete: function (){}
  , onAftersComplete: function (){}

  , run: function (){
    if (this.isPending()){
      this.onComplete(this);
      return;
    }
    this._status = this.SUCCESS;


    var self = this;

    this.onBeforesComplete = function (failedAt){
      if (self.isFailure()){
        self._runAfters(failedAt);
      } else {
        self._runTest();
      }
    };

    this.onTestComplete = function (){
      self._runAfters();
    };

    this.onAftersComplete = foounit.bind(this, function (){
      self.onComplete(self);
    });

    this._runBefores();
  }

  , _runBefores: function (){
    var self = this
      , befores = this._befores;

    var onFail = function (e, queue, block, iter){
      self._status = self.FAILURE;
      self._exception = e;
      queue.stop();
      self.onBeforesComplete(iter);
    };

    var onComplete = function (){
      self.onBeforesComplete();
    }

    this._runFuncs(befores, onFail, onComplete);
  }

  , _runAfters: function (fromIndex){
    var self = this
      , afters = this._afters;

    fromIndex = fromIndex || afters.length;
    afters.reverse();
    afters = afters.slice(afters.length - fromIndex);

    var onFail = function (e, queue, block, iter){
      if (self._status !== self.FAILURE){
        self._status = self.FAILURE;
        self._exception = e;
      }
      block.onComplete(block);
    };

    var onComplete = foounit.bind(this, this.onAftersComplete);

    this._runFuncs(afters, onFail, onComplete);
  }


  , _runTest: function (){
    var self = this;

    var fail = function (e){
      self._status = self.FAILURE;
      self._exception = e;
      self.onTestComplete();
    };

    var complete = function (){
      self.onTestComplete();
    };

    new foounit.Block(this._test, fail, complete).run();
  }

  , _runFuncs: function (funcs, onFailCallback, onCompleteCallback){
    var queue = new foounit.WorkQueue();

    for (var i = 0; i < funcs.length; ++i){
      var func = funcs[i], block;

      if (!func){ continue; }

      var fail = (function (iter){
        return function (e) {
          onFailCallback(e, queue, block, iter);
        }
      })(i);

      var complete = function (block, context){
        // TODO: was anything added to run context?
        //       if so it could be async blocks
        block.onComplete(block);
      };

      block = new foounit.Block(func, fail, complete);
      queue.enqueue(block);
    }

    queue.onComplete = foounit.bind(this, function (queue){
      onCompleteCallback(this);
    });
    queue.run();
  }


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
});
