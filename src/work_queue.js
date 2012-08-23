foounit.WorkQueue = function (tasks){
  this._tasks = tasks ? tasks.concat() : [];
}

foounit.mixin(foounit.WorkQueue.prototype, {
  run: function (){
    this._runNext();
  }

  , enqueue: function (task){
    this._tasks.push(task);
    return task;
  }

  , enqueueAll: function (tasks){
    this._tasks = this._tasks.concat(tasks);
  }

  , dequeue: function (){
    return this._tasks.shift();
  }

  , size: function (){
    return this._tasks.length;
  }

  , peekNext: function (){
    return this._tasks[0];
  }

  , runTask: function (task){
    task.onComplete = foounit.bind(this, this._onTaskComplete);
    task.onFailure = foounit.bind(this, this._onTaskFailure);
    foounit.setTimeout(function (){
      task.run();
    }, 0);
  }

  , stop: function (){
    this._tasks = [];
  }

  // Replace function to receive event
  , onTaskComplete: function (task){}

  // Replace function to receive event
  , onTaskFailure: function (task){}

  // Replace function to receive event
  , onComplete: function (queue){}

  , _onTaskFailure: function (task){
    this.onTaskFailure(task);
  }

  , _onTaskComplete: function (task){
    this.onTaskComplete(task);
    this._runNext();
  }

  , _runNext: function (){
    var task = this.dequeue();
    if (task){
      this.runTask(task);
    } else {
      this.onComplete(this);
    }
  }
});
