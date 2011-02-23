var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.WorkQueue', function (){
    var CompleteTask, FailureTask, queue;

    before(function (){
      CompleteTask = function (){ this.complete = false; };
      foounit.mixin(CompleteTask.prototype, {
        onComplete: function(){}
        , run: function (){
          this.complete = true;
          this.onComplete(this);
        }
      });

      FailureTask = function (){ this.failure = false; }
      foounit.mixin(FailureTask.prototype, {
        onComplete: function(){}
        , run: function (){
          this.failure = true;
          this.onFailure(this);
        }
      });

      // Fake syncronous execution
      mock(foounit, 'setTimeout', function (func, timeout){ func(); });
      queue = new footest.WorkQueue();
    });

    describe('.enqueue', function (){
      it('adds a task to the queue', function (){
        expect(queue.size()).to(be, 0);
        queue.enqueue(new CompleteTask());
        expect(queue.size()).to(be, 1);
      });
    });

    describe('.enqueueAll', function (){
      it('adds an array of tasks', function (){
        expect(queue.size()).to(be, 0);
        queue.enqueueAll([
          new CompleteTask()
        , new CompleteTask()
        , new CompleteTask()
        ]);
        expect(queue.size()).to(be, 3);
      });
    });

    describe('.peekNext', function (){
      it('returns the next task to be executed', function (){
        expect(queue.peekNext()).to(beUndefined);
        var task = new CompleteTask();
        queue.enqueue(task);
        queue.enqueue(new CompleteTask());
        expect(queue.peekNext()).to(be, task);
      });
    });

    describe('.run', function (){
      before(function (){
        queue.enqueue(new CompleteTask());
        expect(queue.size()).to(be, 1);
      });

      it('begins executing the queue', function (){
        var executed;
        queue.runTask = function (task){ executed = task; };
        queue.run();
        expect(executed).toNot(beUndefined);
      });

      describe('when the queue has no more tasks', function (){
        var tasks, completedQueue;

        before(function (){
          tasks = [];
          queue.onTaskComplete = function (task){ tasks.push(task); }
          queue.onComplete = function (queue){ completedQueue = queue; }
        });

        it('calls onComplete', function (){
          expect(queue.size()).to(be, 1);
          queue.enqueue(new CompleteTask());
          queue.enqueue(new CompleteTask());
          queue.run();

          expect(tasks.length).to(be, 3);
          expect(completedQueue).to(be, queue);
        });
      });
    });

    describe('.dequeue', function (){
      it('removes an item from the front of the queue', function (){
        var task1 = new CompleteTask()
          , task2 = new CompleteTask();

        queue.enqueue(task1);
        queue.enqueue(task2);

        expect(queue.size()).to(be, 2);
        expect(queue.dequeue()).to(be, task1);
        expect(queue.size()).to(be, 1);
        expect(queue.dequeue()).to(be, task2);
        expect(queue.size()).to(be, 0);
      });
    });

    describe('.runTask', function (){
      var called;

      it('runs a task', function (){
        var task = new CompleteTask();
        task.run = function (){ called = true; }
        queue.runTask(task);
        expect(called).to(beTrue);
      });

      describe('when the task is complete', function (){
        var task1, task2;

        before(function (){
          task1 = new CompleteTask();
          task2 = new CompleteTask();
          queue.enqueue(task1);
          queue.enqueue(task2);
        });

        it('runs the next task', function (){
          expect(task1.complete).to(beFalse);
          expect(task2.complete).to(beFalse);
          queue.runTask(task1);
          expect(task1.complete).to(beTrue);
          expect(task2.complete).to(beTrue);
        });

        it('calls the onTaskComplete function', function (){
          var tasks = [];
          queue.onTaskComplete = function (task){ tasks.push(task); };
          queue.run();

          // TODO: Need to make this work
          //expect(tasks).to(equal, [task1, task2]);
          expect(tasks[0]).to(be, task1);
          expect(tasks[1]).to(be, task2);
        });
      });

      describe('when the task has failed', function (){
        it('calls the onTaskFailure function', function (){
          var called = false
            , task = new FailureTask()
            , queue = new footest.WorkQueue();

          queue.onTaskFailure = function (){
            called = true;
          };

          queue.enqueue(task);
          queue.run();

          expect(task.failure).to(beTrue);
          expect(called).to(beTrue);
        });
      });
    });

    describe('.stop', function (){
      it('stops running the queue', function (){
        var tasks = [new CompleteTask(), new CompleteTask(), new CompleteTask(), new CompleteTask()]
          , queue = new footest.WorkQueue(tasks)
          , count = 0;

        queue.onTaskComplete = function (task){
          if (count == 1){ queue.stop(); }
          count++;
        }
        queue.run();

        expect(tasks[0].complete).to(beTrue);
        expect(tasks[1].complete).to(beTrue);
        expect(tasks[2].complete).to(beFalse);
        expect(tasks[3].complete).to(beFalse);
      });
    });

  }); // foounit.WorkQueue
}});
