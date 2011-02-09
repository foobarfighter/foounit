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

  , run: function (){
    if (this.isPending()){
      this.onComplete(this);
      return;
    }
    
    this._status = this.SUCCESS;
    
    this._runBefores({
      success: foounit.bind(this, this._runTest)
    , failure: foounit.bind(this, this._runAfters)
    });
  }

  , _runAfters: function (fromIndex){
    var self = this
      , afters = this._afters
      , queue = new foounit.WorkQueue();

    fromIndex = fromIndex || afters.length;
    afters.reverse();
    afters = afters.slice(afters.length - fromIndex);

    for (var i = 0; i < afters.length; ++i){
      var func = afters[i], block;

      if (!func){ continue; }

      // This function is the key difference between this
      // and _runBefores
      var fail = (function (level){
        return function (e){
          if (self._status !== self.FAILURE){
            self._status = self.FAILURE;
            self._exception = e;
          }
          block.onComplete(block);
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

    queue.onComplete = function (queue){
      self.onComplete(self);
    }
    queue.run();
  }

  , _runBefores: function (options){
    var self = this
      , befores = this._befores
      , queue = new foounit.WorkQueue();

    for (var i = 0; i < befores.length; ++i){
      var func = befores[i], block;
      if (!func){ continue; }

      var fail = (function (level){
        return function (e){
          self._status = self.FAILURE;
          self._exception = e;
          queue.stop();
          options.failure(level);
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

    queue.onComplete = options.success;
    queue.run();
  }

  , _runTest: function (){
    var self = this;

    var fail = function (e){
      self._status = self.FAILURE;
      self._exception = e;
      self._runAfters();
    };

    var complete = function (){
      self._runAfters();
    };

    new foounit.Block(this._test, fail, complete).run();
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
