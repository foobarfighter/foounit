var path = require('path')
  , fs = require('fs')
  , fsh = require(__dirname + '/../shared/fsh')
  , sys = require('sys');

var Generator = function (destinationPath, templatePath){
  this._destinationPath = destinationPath;
  this._templatePath = templatePath || __dirname + '/../templates';
  this._tasks = [];

  this.file = function (sourceFile, destinationFile){
    this._tasks.push(function (){
      var fullDestinationPath = path.dirname(this._dp(destinationPath));
      fsh.mkdirpSync(fullDestinationPath, 0755);
      fsh.copyFileSync(this._tp(sourceFile), this._dp(destinationFile));
      this.log('Created:\t' + destinationFile);
    });
  }

  this.run = function (){
    for (var i = 0, ii = this._tasks.length; i < ii; ++i){
      var task = this._tasks[i];
      task.call(this);
    }
    return 0;
  }

  this.log = function (message){
    sys.puts('  >> ' + message);
  }

  this._dp = function (path){
    return this._destinationPath + '/' + path;
  }

  this._tp = function (path){
    return this._templatePath + '/' + path;
  }
}

module.exports = Generator;
