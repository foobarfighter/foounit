var fsh     = require('fsh')
  , foounit = require('../base')
  , colors  = require('./node/colors')
  , assert  = require('./node/assert_patch');

// Include all node dependencies... not great, but it's better than doing a build.
foounit.mixin(foounit, require('../block'));
foounit.mixin(foounit, require('../work_queue'));
foounit.mixin(foounit, require('../block_queue'));
foounit.mixin(foounit, require('../build_context'));
foounit.mixin(foounit, require('../example'));
foounit.mixin(foounit, require('../example_group'));
foounit.mixin(foounit, require('../expectation'));
foounit.mixin(foounit, require('../keywords'));
foounit.mixin(foounit, require('../matchers'));
foounit.mixin(foounit, require('../mock/screw_compat'));
foounit.mixin(foounit, require('../polling_block'));
foounit.mixin(foounit, require('../suite'));
foounit.mixin(foounit, require('../timeout_block'));

// foounit command line interface
foounit.cli = require('./node/cli').cli;
// FIXME: This is only exposed for testing purproses
foounit.generateSuite = require('./node/cli').generateSuite;

var adapter = (function (){
  var puts
    , fs  = require('fs')
    , runInThisContext = (
        process.binding('evals').Script || // older node versions
        process.binding('evals').NodeScript || // Handle node v0.6
        require('vm') // newer node versions
      ).runInThisContext;

  try {
    puts = require('util').puts;
  } catch (e) {
    puts = require('sys').puts;
  }

  // Private variables
  var self = {},  _specdir;

  // Private functions
  var _translate = function(str, tvars){
    return str.replace(/:(\w+)/g, function(match, ref){
        return tvars[ref];
      });
  };

  /**
   * Override foounit.require
   */
  self.require = function (path){
    path = foounit.translatePath(path);
    return require(path);
  }

  /**
   * Override foouint.load
   */
  self.load = function (path){
    path = foounit.translatePath(path) + '.js';
    var code = fs.readFileSync(path);
    runInThisContext(code, path, true);
  }

  /**
   * Runs all registered tests. Convenience method for build/execute steps.
   * Optionally accepts a test directory and a pattern for finding files with tests to run.
   */
  self.run = function (specdir, pattern) {
    _specdir = specdir;

    if (_specdir){
      var specs = fsh.findSync(_specdir, pattern);

      for (var i = 0, ii = specs.length; i < ii; ++i){
        var specFile = specs[i].replace(/\.js$/, '');
        console.log('running spec: ', specFile);
        var spec = require(specFile);
      }
    }

    foounit.execute(foounit.build());
  }

  /*
   * Reporting
   */
  self.reportExample = function (example){
    if (example.isFailure()){
      colors.putsRed('F');
      colors.putsRed(example.getFullDescription());
      puts(new Array(example.getFullDescription().length+1).join('='));
      colors.highlightSpecs(example.getException().stack);
    } else if (example.isSuccess()){
      colors.printGreen('.');
    } else if (example.isPending()){
      colors.printYellow('P');
    }
  }

  self.report = function (info){
    if (info.pending.length){
      var pending = info.pending;
      console.log("\n");
      for (var i = 0, ii = pending.length; i < ii; ++i){
        colors.putsYellow('PENDING: ' + pending[i]);
      }
    }

    if (info.failCount){
      colors.putsRed("\n" + info.failCount + ' test(s) FAILED');
    } else {
      colors.putsGreen("\nAll tests passed.");
    }

    var endMessage = info.totalCount + ' total.';
    if (info.pending.length){
      endMessage += ' ' + info.pending.length + ' pending.';
    }
    endMessage += ' runtime ' + info.runMillis + 'ms';
    console.log(endMessage);
  }

  return self;
})();

foounit.mixin(foounit, adapter);
module.exports = foounit;
