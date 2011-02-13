/**
 *  A queue designed to run blocks but also to look like a task in a queue
 */

foounit.BlockQueue = function (example){
  this._example = example;
  this._tasks = [];
  this._exception = undefined;
}

foounit.mixin(foounit.BlockQueue.prototype, foounit.WorkQueue.prototype);

foounit.mixin(foounit.BlockQueue.prototype, {
  onFailure: function (blockQueue){}
  , onComplete: function (blockQueue){}

  , getException: function (){
    return this._exception;
  }

  , _onTaskFailure: function (task){
    this._exception = task.getException();
    this.stop();
    this.onFailure(this);
  }
});

// FIXME: This is a little hacky
(function (foounit){
  var origRunTask = foounit.BlockQueue.prototype.runTask;
  foounit.BlockQueue.prototype.runTask = function (task){
    this._example.setCurrentBlockQueue(this); 
    origRunTask.apply(this, arguments);
  };
})(foounit);
