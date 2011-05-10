// TODO: Switch to a better color library
var sys = require('sys');

exports.putsRed = function (str){
  sys.puts('\33[31m' + str + '\33[39m');
}

exports.printYellow = function (str){
  sys.print('\33[33m' + str + '\33[39m');
}

exports.putsYellow = function (str){
  sys.puts('\33[33m' + str + '\33[39m');
}

exports.printGreen = function (str){
  sys.print('\33[32m' + str + '\33[39m');
}

exports.putsGreen = function (str){
  sys.puts('\33[32m' + str + '\33[39m');
}

exports.highlightSpecs = function (stack){
  var lines = stack.split("\n");
  for (var i = 0, ii = lines.length; i < ii; ++i){
    var line = lines[i];
    if (line.match(/_spec\.js/)){
      exports.printYellow(line + "\n");
    } else {
      sys.puts(line);
    }
  }
}
