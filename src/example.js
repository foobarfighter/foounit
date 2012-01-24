foounit.Example = function (description, test, pending){
  this._befores = [];
  this._test = test;
  this._afters  = [];
  this._description = description;
  this._descriptions = [];
  this._currentBlockQueue = undefined;

  this._status = 0;
  this._exception = undefined;

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

  , setCurrentBlockQueue: function (blockQueue){
    this._currentBlockQueue = blockQueue;
  }

  , getCurrentBlockQueue: function (){
    return this._currentBlockQueue;
  }

  , run: function (){
    foounit.getBuildContext().setCurrentExample(this);

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
      foounit.getBuildContext().setCurrentExample(undefined);
      foounit.resetMocks();
      self.onComplete(self);
    });

    this._runBefores();
  }

  , enqueue: function (block){
    this._currentBlockQueue.enqueue(block);
  }

  // TODO: Refactor, before, after and it should all return BlockQueues
  , _enqueueBlocks: function (funcs){
    for (var i = 0; i < funcs.length; ++i){
      var func = funcs[i] || function (){}
        , blockQueue = new foounit.BlockQueue(this)
        , block = new foounit.Block(func);

      blockQueue.enqueue(block);
      this._queue.enqueue(blockQueue);
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
    var self = this;

    this._queue = new foounit.WorkQueue();

    this._queue.onTaskFailure = function (blockQueue){
      self._status = self.FAILURE;
      self._exception = blockQueue.getException();
      self.onTestComplete();
    };

    this._queue.onComplete = function (){
      self.onTestComplete();
    };

    this._enqueueBlocks([this._test]);
    this._queue.run();
  }

  , getStack: function (){
    var e = this.getException();

    // TODO: We need to do a lot better than this 
    return e.stack || e.stacktrace || e.sourceURL + ':' + e.line;
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

  , getFullDescription: function (){
    var descriptions = this._descriptions.concat();
    descriptions.shift();
    descriptions.push(this.getDescription());
    return descriptions.join(' ');
  }

  , getDescriptions: function (){
    return this._descriptions;
  }

  , setDescriptions: function (descriptions){
    this._descriptions = descriptions;
  }

  , getBefores: function (){ return this._befores; }

  , setAfters: function (afters){
    this._afters = afters;
  }

  , getAfters: function (){
    return this._afters;
  }

  , getTest: function (){
    return this._test;
  }

  , setStatus: function (code){
    this._status = code;
  }
});
