var parseopts = require(__dirname + '/../bin/parseopts');
var foo = exports;

exports.require = function (file){

}

exports.unit = {
  report: function (example){
    if (example.isSuccess()){
      foo.puts('.');
    } else {
      foo.puts('F');
    } 
  }

  , run: function (runners){
    runners = runners || foo.unit.build();
    for (var i = 0, ii = runners.length; i < ii; ++i){
      var runner = runners[i];
      runner.run();
      foo.unit.report(runner);
    }
  }

  , exports: function (){
  }

  , files: function (){
    var args = process.argv;
    var o = parseopts({ tests: ['-t', '--tests'] }, args);
    var tests = o.opts.tests;
    foo.puts(tests.join(', '));
    return tests;
  }
}
