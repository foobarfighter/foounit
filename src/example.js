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

    var self = this;

    function addBefores(queue, befores){
      for (var i = 0; i < befores.length; ++i){
        if (!befores[i]){ continue; }
        queue.enqueue(self._createBlock(queue, befores[i]));
      }
    }

    function addAfters(queue, afters){
      for (var i = afters.length - 1; i >= 0; --i){
        if (!afters[i]){ continue; }
        queue.enqueue(self._createBlock(queue, afters[i]));
      }
    }

    var queue = new foounit.WorkQueue();
    addBefores(queue, this._befores);
    queue.enqueue(this._createBlock(queue, this._test));
    addAfters(queue, this._afters);

    queue.onComplete = function (){
      self._status = self.SUCCESS;
      self.onComplete(self);
    }
    queue.run();


    //var onTestComplete = function (testSuccess){
    //  afters.reverse();
    //  self._runFuncs(afters, true, function (afterSuccess){
    //  });
    //}
   
    //var runAfters = function (){
    //  afters.reverse();
    //  self._runFuncs(afters, true, );
    //}

    //var funcs = this._befores.concat([this._test]);
    //this._runFuncs(this._befores, false, onTestComplete);
  }

  //, _runFuncs: function (funcs, continueOnFailure, callback){
  //  var queue = new foounit.WorkQueue();
  // 
  //  var blocks = []; 
  //  for (var i = 0; i < funcs.length; ++i){
  //    blocks.push(this._createBlock(queue, func));
  //  }
  //}

  , _createBlock: function (queue, func){
    var self = this, block;

    var fail = function (e){
      self._status = self.FAILURE;
      self._exception = e;
      queue.stop();
      self.onComplete(self);
    }

    var complete = function (block, context){
      // TODO: was anything added to run context?
      //       if so it could be async blocks
      block.onComplete(block);
    }

    return new foounit.Block(func, fail, complete);
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
