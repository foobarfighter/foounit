var fs = require('fs')
  , exec = require('child_process').exec;

var fsh = module.exports;

fsh.mkdirpSync = function (path, mode){
  var parts = path.split('/');
  for (var i = 0, ii = parts.length; i < ii; ++i){
    var newpath = parts[i] + '/';
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

// FIXME: This fails silently... BAAAAAAAAAAAAAAD
fsh.copyFileSync = function (source, dest){
  var cmd = 'cp ' + source + ' ' + dest;
  exec(cmd);
}
