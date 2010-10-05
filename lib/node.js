// TODO: This file provides methods to foo unit but cannot use it directly.
// Is this a problem?

var foo = exports;
var sys = require('sys');

// Ummm... how should we resolve directory placeholders?
foo.require = function (file){
  var _translate = function(str, tvars){
    return str.replace(/:(\w+)/g, function(match, ref){
        return tvars[ref];
      });
  };

  file = _translate(file, { 'src': __dirname + '/../src' });
  return require(file);
}

foo.unit = {
  report: function (example){
    var putsRed = function (str){
      sys.puts('\33[31m' + str + '\33[39m');
    }

    var printYellow = function (str){
      sys.print('\33[33m' + str + '\33[39m');
    }

    var printGreen = function (str){
      sys.print('\33[32m' + str + '\33[39m');
    }

    var highlightSpecs = function (stack){
      var lines = stack.split("\n");
      for (var i = 0, ii = lines.length; i < ii; ++i){
        var line = lines[i];
        if (line.match(/_spec\.js/)){
          printYellow(line + "\n");
        } else {
          sys.puts(line);
        }
      }
    }

    if (example.isPending()){
      printYellow('P');
    } else if (example.isSuccess()){
      printGreen('.');
    } else {
      putsRed('F');
      var description = example.getFullDescription();
      sys.puts(description);
      sys.puts(new Array(description.length+1).join('='));
      highlightSpecs(example.getStack());
    } 
  }

  , run: function (runners){
    sys.puts("running test suite: (" + runners.length + " runners)\n");
    var total, passed, failed; 
    total = passed = failed = 0;

    for (var i = 0, ii = runners.length; i < ii; ++i){
      var runner = runners[i];
      runner.run();
      runner.isSuccess() ? passed++ : failed++;
      total++;
      foo.unit.report(runner);
    }

    sys.puts("\n\nFINISHED");
    sys.puts(total + ' examples, ' + passed + ' passed, ' + failed + ' failed');
  }
}

