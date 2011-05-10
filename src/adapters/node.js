var foounit = require('./foounit');

// This is a little weird, but fsh will get baked into
// the foounit-node build.
//, fsh = require('../build/fsh');
if (typeof fsh === 'undefined'){
  throw new Error('Looks like there was a problem ' +
    'building foounit-node. ' +
    'fsh should have been baked in.');
}



var adapter = (function (){
  var sys = require('sys')
    , fs  = require('fs')
    , runInThisContext = process.binding('evals').Script.runInThisContext;

  // Private variables
  var self = {},  _specdir, _codedir;

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
   */
  self.run = function (specdir, codedir, pattern) {
    _specdir = specdir;
    _codedir = codedir;

    var specs = fsh.findSync(_specdir, pattern);
    for (var i = 0, ii = specs.length; i < ii; ++i){
      var specFile = specs[i].replace(/\.js$/, '');
      console.log('running spec: ', specFile);
      var spec = require(specFile);
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
      sys.puts(new Array(example.getFullDescription().length+1).join('='));
      highlightSpecs(example.getException().stack);
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

// TODO: Launch if file was not required
// TODO: Parse params from cmd-line
//run('../', /_spec\.js$/, '../../dist');

