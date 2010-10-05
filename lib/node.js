// TODO: This file provides methods to foo unit but cannot use it directly.
// Is this a problem?

var foo = exports;
var sys = require('sys');



//////////////////////  HELPERS FOR PRINTING IN COLORS ///////////////////////
var putsRed = function (str){
  sys.puts('\33[31m' + str + '\33[39m');
}

var printYellow = function (str){
  sys.print('\33[33m' + str + '\33[39m');
}

var putsYellow = function (str){
  sys.puts('\33[33m' + str + '\33[39m');
}

var printGreen = function (str){
  sys.print('\33[32m' + str + '\33[39m');
}

var putsGreen = function (str){
  sys.puts('\33[32m' + str + '\33[39m');
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

//////////////////////  REPORTING AND RUNNING ///////////////////////

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
  pendingDescriptions: []
, pending: 0
, passed:  0
, failed:  0
, total:   0

, report: function (example){

    this.total++;

    if (example.isPending()){
      printYellow('P');
      this.pending++;
      this.pendingDescriptions.push(example.getFullDescription());
    } else if (example.isSuccess()){
      printGreen('.');
      this.passed++;
    } else {
      putsRed('F');
      this.failed++;

      var description = example.getFullDescription();
      sys.puts(description);
      sys.puts(new Array(description.length+1).join('='));
      highlightSpecs(example.getStack());
    } 
  }

, run: function (runners){
    sys.puts("running test suite: (" + runners.length + " runners)\n");

    for (var i = 0, ii = runners.length; i < ii; ++i){
      var runner = runners[i];
      runner.run();
      foo.unit.report(runner);
    }

    var fu = foo.unit;
    if (fu.failed == 0){
      putsGreen("\n\nPASSED!");
    } else if (fu.failed > 0){
      putsRed("\n\nFAILED!");
    }

    sys.puts(fu.total + ' examples, ' +
      fu.passed + ' passed, ' +
      fu.failed + ' failed, ' +
      fu.pending + ' pending');

    if (fu.pending){
      putsYellow("\n** PENDING SPECS:");
      for (var i = 0, ii = fu.pendingDescriptions.length; i < ii; ++i){
        putsYellow('** ' + fu.pendingDescriptions[i]);
      }
    }

  }
}

