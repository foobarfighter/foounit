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
  , onBeforesComplete: function (){}
  , onBeforesFailure: function (failedAt){}
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
      self._runTest();
    };

    this.onBeforesFailure = function (failedAt){
      this._runAfters(failedAt);
    };

    this.onTestComplete = function (){
      self._runAfters();
    };

    this.onAftersComplete = foounit.bind(this, function (){
      self.onComplete(self);
    });

    this._runBefores();
  }

  , addToQueue: function (block){
    this._queue.enqueue(block);
  }

  , _enqueueBlocks: function (funcs){
    for (var i = 0; i < funcs.length; ++i){
      var func = funcs[i] || function (){};
      var block = new foounit.Block(func)
      this._queue.enqueue(block);
    }
  }

  , _runBefores: function (){
    var self = this
      , index = 0;

    this._queue = new foounit.WorkQueue();

    this._queue.onComplete = function (){
      self.onBeforesComplete();
    };

    // This index stuff is a little janky
    this._queue.onTaskComplete = function (blockQueue){
      ++index;
    }

    this._queue.onTaskFailure = function (blockQueue){
      self._status = self.FAILURE;
      self._exception = blockQueue.getException();
      self._queue.stop();
      self.onBeforesFailure(index);
    };

    this._enqueueBlocks(this._befores);
    this._queue.run();
  }

  , _runAfters: function (fromIndex){
    var self = this
      , afters = this._afters;

    fromIndex = fromIndex || afters.length;
    afters.reverse();
    afters = afters.slice(afters.length - fromIndex);

    this._queue = new foounit.WorkQueue();

    this._queue.onComplete = function (){
      self.onAftersComplete();
    };

    this._queue.onTaskFailure = function (task){
      if (self._status !== self.FAILURE){
        self._status = self.FAILURE;
        self._exception = task.getException();
      }
      task.onComplete(task);
    }

    this._enqueueBlocks(afters);
    this._queue.run();
  }


  , _runTest: function (){
    var self = this
      , block = new foounit.Block(this._test);

    block.onFailure = function (block){
      self._status = self.FAILURE;
      self._exception = block.getException();
      self.onTestComplete();
    };

    block.onComplete = function (){
      self.onTestComplete();
    };

    block.run();
  }

  // FIXME: This shit is just fucking weird
  , _runFuncs: function (funcs, onFailCallback, onCompleteCallback){
    var queue = new foounit.WorkQueue();

    for (var i = 0; i < funcs.length; ++i){
      var func = funcs[i], block;

      if (!func){ continue; }

      var fail = (function (iter){
        return function (e, block) {
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
