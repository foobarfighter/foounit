var path = require('dirname');
  , fs = require('fs');
  , exec = require('child_process').exec;

var Generator = function (destinationPath, templatePath){
  this._destinationPath = destinationPath;
  this._templatePath = templatePath || __dirname + '../templates';

  this.file = function (sourceFile, destinationFile){
    this._mkdirpSync(path.dirname(destinationPath));
    exec('cp ' + sourceFile + ' ' + destinationFile);
  }

  this.mkdirpSync = function (path){
    var parts = path.split('/');
    for (var i = 0, ii = 0; i < parts.length; ++i){
      var newpath = parts[i] + '/';
      var stat = fs.statSync(newpath);
      if (!stat.isDirectory){
        fs.mkdirSync(newpath);
      }
    }
  }
}

module.exports = Generator;
