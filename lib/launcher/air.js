var fsh = require(__dirname + '/../shared/fsh');

var AirLauncher = function (parsedOptions){
  this.init = function (parsedOptions){
    // Grep all *_spec.js files
    // Do template replace to add all files to the suite
    // Exec adl Spec-app.xml
  }

  this.validate = function (){
  }

  this.run = function (){
  }

  this.init.apply(this, arguments);
}

module.exports = AirLauncher;
