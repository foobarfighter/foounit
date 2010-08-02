var Generator = require(__dirname + '/generator')
  , fsh = require(__dirname + '/fsh');

var AirGenerator = function (parsedOptions){

  this.validate = function (){
    if (fsh.existsSync(this._destinationPath)){
      throw new Error('Cannot generate files because `' +
        this._destinationPath + '` already exists.');
    }
  }

  this.run = function (){
    this._generator.run();
  }

  this._extractDestinationPath = function (options){
    return options.cmds[4] || 'spec';
  }

  this._destinationPath = this._extractDestinationPath(parsedOptions);
  this._generator = new Generator(this._destinationPath);
  this._generator.file('air/Spec-app.xml',       'Spec-app.xml')
  this._generator.file('air/Spec.html.template', 'Spec.html.template')
  this._generator.file('air/suite.js',           'suite.js');
}

module.exports = AirGenerator;
