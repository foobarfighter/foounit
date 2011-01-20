var fs = require('fs')
  , exec = require('child_process').exec;

var fsh = module.exports;
fsh.separator = '/';
fsh.debug = false;

fsh.mkdirpSync = function (path, mode){
  var parts = path.split(this.separator);
  for (var i = 0, ii = parts.length; i < ii; ++i){
    var newpath = parts[i] + this.separator;
    if (!fsh.existsSync(newpath)){
      fs.mkdirSync(newpath, mode);
    }
  }
  return true;
}

fsh.existsSync = function (path){
  var stat;
  try {
    stat = fs.statSync(path);
  } catch (e){
    if (e.type == 'ENOENT'){
      return false;
    }
  }
  return stat;
}

fsh.isDirectorySync = function (path){
  return _isStatSync(path, 'isDirectory');
}

fsh.isSymbolicLinkSync = function (path){
  return _isStatSync(path, 'isSymbolicLink');
}

var _isStatSync = function (path, func){
  try {
    var stat = fs.lstatSync(path);
    return stat[func]();
  } catch (e) {}
  return false;
}


// FIXME: This fails silently... BAAAAAAAAAAAAAAD
fsh.copyFileSync = function (source, dest){
  var cmd = 'cp ' + source + ' ' + dest;
  exec(cmd);
}


// TODO: Add option for following symlinks
fsh.findSync = function (basedir, pattern){
  var matches = [];

  var _find = function (dir){
    var files = fs.readdirSync(dir);
    for (var i = 0, ii = files.length; i < ii; ++i){
      var file = files[i];
      var fullPath = fsh.join(dir, file);
      if (!fsh.isSymbolicLinkSync(fullPath) && fsh.isDirectorySync(fullPath)){
        _find(fullPath);
      } else if (file.match(pattern)){
        matches.push(fullPath);
      }
    }
  }

  _find(basedir);
  return matches;
}

fsh.join = function (){
  var parts = Array.prototype.slice.apply(arguments);
  return parts.join(this.separator);
}
