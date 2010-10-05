var fsh = require(__dirname + '/../shared/fsh')
  , str = require(__dirname + '/../shared/str')
  , exec  = require('child_process').exec
  , sys = require('sys')
  , fs = require('fs');

var NodeLauncher = function (parsedOptions){
  this.init = function (parsedOptions){
  }

  this.validate = function (){
  }

  this.run = function (){
    var specdir = '.'
      , pattern = /_spec\.js$/
      , codedir = fsh.join('..', 'src');

    var specs = fsh.findSync(specdir, pattern);
    for (var i = 0, ii = specs.length; i < ii; ++i){
      var specFile = specs[i].replace(/\.js$/, '');
      var foo = require(fsh.join(process.cwd(), specFile));
    }
    foo.unit.run(foo.unit.build());
  }

  this.init.apply(this, arguments);
}

module.exports = NodeLauncher;
