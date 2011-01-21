var fs = require('fs');

var PacMan = module.exports.PacMan = (function (){
  var _profiles;

  var init = function (profiles){
    _profiles = profiles;
  };

  var concat = function (profile){
    var files = _profiles[profile]
      , str = '';

    for (var i = 0, ii = files.length; i < ii; ++i){
      str += fs.readFileSync(files[i]);
    }
    return str;
  };

  return function (){
    // Public functions
    this.concat = concat;

    // Construct
    init.apply(this, arguments);
  }
})();

PacMan.create = function (configFile){
  var loadConfigFile = function (configFile){
    var json = fs.readFileSync(configFile).toString();
    return JSON.parse(json);
  }

  return new PacMan(loadConfigFile(configFile));
}

