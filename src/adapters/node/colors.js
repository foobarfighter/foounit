// TODO: Switch to a better color library
var puts;
try {
  puts = require('util').puts;
  print =  require('util').print;
} catch (e) {
  puts = require('sys').puts;
  print =  require('sys').print;
}

exports.putsRed = function (str){
  puts('\33[31m' + str + '\33[39m');
}

exports.printYellow = function (str){
  print('\33[33m' + str + '\33[39m');
}

exports.putsYellow = function (str){
  puts('\33[33m' + str + '\33[39m');
}

exports.printGreen = function (str){
  print('\33[32m' + str + '\33[39m');
}

exports.putsGreen = function (str){
  puts('\33[32m' + str + '\33[39m');
}

exports.highlightSpecs = function (stack){
  var lines = stack.split("\n");
  for (var i = 0, ii = lines.length; i < ii; ++i){
    var line = lines[i];
    if (line.match(/spec\.js/)){
      exports.printYellow(line + "\n");
    } else {
      puts(line);
    }
  }
}
