var fsh = require(__dirname + '/../shared/fsh')
  , str = require(__dirname + '/../shared/str')
  , sys = require('sys')
  , fs = require('fs')
  , server = require(__dirname + '/browser/server');

var BrowserLauncher = function (parsedOptions){
  this.init = function (parsedOptions){
    this.specdir = '.';
    this.srcdir  = './src';
  }

  this.validate = function (){
  }

  this.run = function (){
    this.createServer();
  }

  this.createSuite = function (virtualPath, logicalPath){
    var pattern = /_spec\.js$/;
    var specs = fsh.findSync(this.specdir, pattern);

    function tag(src){
      return '<script type="text/javascript" src="' + src + '"></script>';
    }

    var scripts = [], content = '<html><head><title>Test Suite</title>';
    scripts.push(tag('/foounit/foo-unit.js'));
    scripts.push(tag('/foounit/browser.js'));
    for (var i = 0, ii = specs.length; i < ii; ++i){
      scripts.push(tag('/spec/' + specs[i]));
    }

    content += scripts.join("\n");
    content += '<script>';
    content += 'function runTests(){ foounit.run(); }';
    content += '</script>';

    content += '</head><body onload="runTests()">';
    content += '<h3 id="header"></h3>';
    content += '<div id="results"></div>';
    content += '</body></html>';
    return content;
  }

  this.createServer = function (){
    var self = this;

    this.server = new server.HttpServer('0.0.0.0', 9999);
    this.server.mount('/foounit',  __dirname + '/../');
    this.server.mount('/spec', this.specdir);
    this.server.mount('/src',  this.srcdir);
    this.server.handler(function (virtualPath, logicalPath){
      if (virtualPath.match(/^\/spec/) && (!fsh.existsSync(logicalPath) || fsh.isDirectorySync(logicalPath))){
        return { headers: { 'Content-Type': 'text/html' },
          content: self.createSuite(virtualPath, logicalPath)
        };
      }
    });
    this.server.start();
  }

  this.init.apply(this, arguments);
}

module.exports = BrowserLauncher;
