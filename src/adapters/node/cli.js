var parser = require('nomnom')
  , _ = require('underscore')
  , fs = require('fsh')
  , pth = require('path');

var TEMPLATE_DIR = pth.join(__dirname, '../../../templates')
  , _options = { log: false };

function log(){
  if (!_options.log){ return; }
  console.log.apply(console, arguments);
}

exports.generateSuite = function (options){
  // Trim and normalize.  Turns "node, browser" into "browser-node"
  var target = _(options.target.split(',').sort()).map(function (t){
    return t.replace(/^\s+|\s+$/, '');
  }).join('-');

  if (options.suite){
    target += '-suite';
  }

  var templateDir = pth.join(TEMPLATE_DIR, target);

  if (!fs.isDirectorySync(templateDir)){
    if (options.suite){
      throw new Error('Could not locate suite template for: "' + options.target +
        '". Run `foounit generate --help` to see a list of available targets.');
    } else {
      throw new Error('Could not locate template for: "' + options.target +
        '". Run `foounit generate --help` to see a list of available targets.');
    }
  }

  if (fs.existsSync(options.dir)){
    throw new Error('Destination directory already exists... sheepishly ' +
      'bailing out.  Run `foounit generate` with the --dir option to specify ' +
      'an alternate directory.');
  }

  // Copy all template files
  var files = fs.findSync(templateDir, '.*');
  _.each(files, function (file){
    var postfix  = file.substr(templateDir.length+1)
      , destFile = pth.join(options.dir, postfix)
      , destPath = pth.dirname(destFile);
  
    log('--> creating file: ', destFile);
    fs.mkdirpSync(destPath, 0777);
    fs.copyFileSync(file, destFile);
  });
}

exports.serve = function (options){
  var connect;

  try {
    connect = require('connect');
  } catch (e){
    throw new Error('connect is required for `foounit serve`. ' +
      'Run `npm install connect` to install connect.');
  }

  log('--> Static web server is started on port ' + options.port);
  log('--> Hosting from root directory: ' + process.cwd());
  connect(
    connect.logger()
  , connect.static(process.cwd())
  ).listen(options.port, 'localhost');
}


// Run script if executed via the cmd line
exports.cli = function (options){
  _options = options || _options;

  parser.command('serve')
    .help('Starts a file server in the current directory')
    .opts({
      port: {
        string:     '-p PORT, --port=PORT',
        help:       'Server port',
        default:    5057
      }
    });

  parser.command('generate')
    .help('Generate a foounit test suite')
    .opts({
      target: {
        string:   '-t ENV, --target=ENV',
        help:     'List of javascript host environments to target. Valid optons: browser,node',
        default:  'node',
      },
      dir: {
        string:   '-d dir, --dir=DIRECTORY',
        help:     'Directory where the suite shold be generated',
        default:  './spec'
      },
      suite: {
        abbr:     's',
        flag:     true,
        help:     'Generate a test suite for hosting multiple test files',
        default:  false
      }
    });


  var options = parser.parseArgs()
    , cmd = options._[0];

  switch (cmd){
    case 'generate':
      exports.generateSuite(options);
      break;
    case 'serve':
      exports.serve(options);
      break;
    default:
      throw new Error('Unspecified command: "' + cmd +
        '".  Run `foounit --help` to see a list of available commands');
  }
}
