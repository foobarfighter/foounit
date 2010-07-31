var sys = require('sys');
var parseopts = require(__dirname + '/parseopts');

///////////////////////////////////////////////////////////////////////////

function throwUnrecognizedCommand (cmd){
  var message = 'Unrecognized command: ' + cmd + "\n" + usage();
  throw new Error(message);
}

function throwMissingCommand (){
  throw new Error("Missing command\n" + usage());
}

function usage (){
  return "For list of commands try: foounit help\n" +
    "To get help for a particular command try: foounit help [command]\n\n" +
    "Available commands are:\n" +
    "\tgenerate\t\tGenerates a runner and test suite for your project\n" +
    "\tlaunch\t\t\tLaunches the foo-unit runner\n";
}

function generate (cmd, options){
  var generator = new GenerateCmd(cmd, options);
  generator.validate();
  return generator.run();
}

function launch (cmd, options){
  var launcher = new LaunchCmd(cmd, options);
  launcher.validate();
  return launcher.run();
}

function help (cmd){
}

///////////////////////////////////////////////////////////////////////////

var GenerateCmd = function (cmd, options){
  this._generator = this._create(cmd, options);

  this._create = function (type, options){
    var Generator = require(__dirname + '../lib/generators/' + type);
    return new Generator(options);
  }

  this.run = function (){
    this._generator.generate();
  }
}

var LaunchCmd = function (cmd, options){
  this._launcher = this._create(cmd, options);

  this._create = function (type, options){
    var Launcher = require(__dirname + '../lib/launchers/' + type);
    return new Launcher(options);
  }

  this.run = function (){
    this._launcher.launch();
  }
}

///////////////////////////////////////////////////////////////////////////

var options = {};
var o = parseopts.parse(options, process.argv);
var cmd = o.cmds[2];
var subcmd = o.cmds[3];

try {
  switch(cmd){
    case 'generate':
      generate(subcmd, o.opts);
      break;
    case 'launch':
      launch(subcmd, o.opts);
      break;
    case 'help':
      help(subcmd);
      break;
    case undefined:
      throwMissingCommand();
      break;
    default:
      throwUnrecognizedCommand(cmd);
  }
} catch(e){
  sys.debug(e.message);
  process.exit(1);
}
