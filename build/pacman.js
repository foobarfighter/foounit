var fs = require('fs');

var PacMan = module.exports.PacMan = (function (){
  var _profiles;

  var init = function (profiles){
    _profiles = profiles;
  };

  // Accepts a descriptor which can be just a file path
  // or an object that determines the scope of the baked
  // in code
  var _readInScope = function (descriptor){
    if (typeof descriptor === 'string'){
      return fs.readFileSync(descriptor);
    }

    var generateFunctionalScope = function (descriptor){
      var code = fs.readFileSync(descriptor.file);
      return "var " + descriptor.variable + " = (function (module){" +
        code + "\n return module.exports; })({ exports: {} });\n\n";
    };

    var code;

    switch (descriptor.scope){
      case 'function':
        code = generateFunctionalScope(descriptor);
        break;
      default:
        throw new Error('Invalid descriptor scope: ' + descriptor.scope);
    }

    return code;
  }

  var concat = function (profile){
    var descriptors = _profiles[profile]
      , str = '';

    for (var i = 0, ii = descriptors.length; i < ii; ++i){
      str += _readInScope(descriptors[i]);
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

