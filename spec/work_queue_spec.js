if (typeof global !== 'undefined'){
  var foounit = require('../dist/foo-unit-node');
}
var footest = foounit.require(':src/foo-unit');

foounit.add(function (kw){ with(kw){
  var TestTask, queue;

  function useRunnableTestTask(){
    TestTask.prototype.run = function (){
      this.complete = true;
      this.onComplete(this);
    };
  }

  before(function (){
    TestTask = function (){ };
    foounit.mixin(TestTask.prototype, {
      onComplete: function(){}
      , run: function (){}
    });

    queue = new footest.WorkQueue();
  });

  describe('.enqueue', function (){
    it('adds a task to the queue', function (){
      expect(queue.size()).to(be, 0);
      queue.enqueue(new TestTask());
      expect(queue.size()).to(be, 1);
    });
  });

  describe('.run', function (){
    before(function (){
      queue.enqueue(new TestTask());
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
        useRunnableTestTask();

        tasks = [];
        queue.onTaskComplete = function (task){ tasks.push(task); }
        queue.onComplete = function (queue){ completedQueue = queue; }
      });

      it('calls onComplete', function (){
        expect(queue.size()).to(be, 1);
        queue.enqueue(new TestTask());
        queue.enqueue(new TestTask());
        queue.run();

        expect(tasks.length).to(be, 3);
        expect(completedQueue).to(be, queue);
      });
    });
  });

  describe('.dequeue', function (){
    it('removes an item from the front of the queue', function (){
      var task1 = new TestTask()
        , task2 = new TestTask();

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
      var task = new TestTask();
      task.run = function (){ called = true; }
      queue.runTask(task);
      expect(called).to(beTrue);
    });

    describe('when the task is complete', function (){
      var task1, task2;

      before(function (){
        useRunnableTestTask();

        task1 = new TestTask();
        task2 = new TestTask();
        queue.enqueue(task1);
        queue.enqueue(task2);
      });

      it('runs the next task', function (){
        expect(task1.complete).to(beUndefined);
        expect(task2.complete).to(beUndefined);
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
  });
}});
