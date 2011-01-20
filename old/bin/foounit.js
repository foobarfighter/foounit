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

function generate (cmd, parsedOptions){
  var Generator = require(__dirname + '/../lib/generator/' + cmd);
  var generator = new Generator(parsedOptions);
  generator.validate();
  return generator.run();
}

function launch (cmd, parsedOptions){
  var Launcher = require(__dirname + '/../lib/launcher/' + cmd);
  var launcher = new Launcher(parsedOptions);
  launcher.validate();
  return launcher.run();
}

function help (cmd){
}

///////////////////////////////////////////////////////////////////////////

// -t used in: foounit generate foo -t air
var options = { 'type': ['-t', '--type' ] };

var o = parseopts.parse(options, process.argv);
var cmd = o.cmds[2];
var subcmd = o.cmds[3];

try {
  var doLaunch = false, doGenerate = false;

  switch(cmd){
    case 'generate':
      doGenerate = true;
      break;
    case 'launch':
      doLaunch = true;
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

if (doLaunch)  { launch(subcmd, o); }
if (doGenerate){ generate(subcmd, o); }

