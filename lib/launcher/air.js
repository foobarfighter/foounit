var fsh = require(__dirname + '/../shared/fsh')
  , str = require(__dirname + '/../shared/str')
  , exec  = require('child_process').exec
  , sys = require('sys')
  , fs = require('fs');

var AirLauncher = function (parsedOptions){
  this.init = function (parsedOptions){
  }

  this.validate = function (){
  }

  this.run = function (){
    var specdir = '.';
    var codedir = fsh.join('..', 'src');
    var descriptor = fsh.join(specdir, 'Spec-app.xml');
    var template = fsh.join(specdir, 'Spec.html.template');
    var runner = fsh.join(specdir, 'Spec.html');
    var pattern = /_spec\.js$/;
    var adl = '/usr/local/air/bin/adl';

    var specs = fsh.findSync(specdir, pattern);
    this.clean();
    var srclink = this.createSrcLink(specdir, codedir);
    this.createRunFile(template, runner, {
        testfiles: JSON.stringify(specs)
        , srclink: srclink
      });

    var cmd = adl + ' ' + descriptor;
    sys.puts('running: ' + cmd);
    child = exec(cmd, 
      function (error, stdout, stderr) {
        if (error !== null) {
          sys.puts('exec error: ' + error);
        }
        if (stdout !== null){
          sys.puts('stdout: ' + stdout);
        }
        if (stderr !== null){
          sys.puts('stderr: ' + stderr);
        }
      });
  }

  this.createRunFile = function (infile, outfile, tvars){
    var templatize = function (template, tvars){
      template = str.trim(template);
      return template.replace(/\$\{([^\}]+)}/g, function(){
        return tvars[arguments[1]];
      });
    }

    var template = fs.readFileSync(infile, 'utf8');
    var out = templatize(template, tvars);
    fs.writeFileSync(outfile, out);
  }

  this.clean = function (){
    var specdir = '.';
    this.cleanLinks(specdir);
  }

  this.createSrcLink = function (specdir, srcdir){
    var link = 'foosrcroot.' + new Date().getTime().toString() + Math.floor(Math.random() * 100000).toString();
    var cwd = process.cwd();
    process.chdir(specdir);
    fs.symlinkSync(srcdir, link);
    process.chdir(cwd);
    return link;
  }

  this.cleanLinks = function (specdir){
    var links = fsh.findSync(specdir, /^foosrcroot\.\d+$/); 
    for (var i = 0, ii = links.length; i < ii; ++i){
      var link = links[i];
      if (fsh.isSymbolicLinkSync(link)){
        fs.unlinkSync(link);
      }
    }
  }

  this.init.apply(this, arguments);
}

module.exports = AirLauncher;
