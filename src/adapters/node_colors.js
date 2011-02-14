var colors = (function (){
  var sys = require('sys');

  var self = this;

  self.putsRed = function (str){
    sys.puts('\33[31m' + str + '\33[39m');
  }

  self.printYellow = function (str){
    sys.print('\33[33m' + str + '\33[39m');
  }

  self.putsYellow = function (str){
    sys.puts('\33[33m' + str + '\33[39m');
  }

  self.printGreen = function (str){
    sys.print('\33[32m' + str + '\33[39m');
  }

  self.putsGreen = function (str){
    sys.puts('\33[32m' + str + '\33[39m');
  }

  self.highlightSpecs = function (stack){
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

  return self;
})();
