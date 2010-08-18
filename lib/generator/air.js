var Generator = require(__dirname + '/generator')
  , fsh = require(__dirname + '/../shared/fsh');

var AirGenerator = function (parsedOptions){

  this.init = function (parsedOptions){
    this._destinationPath = this._extractDestinationPath(parsedOptions);
    this._generator = new Generator(this._destinationPath);
    
    with(this._generator){
      file('../foo-unit.js',         'foo-unit.js');
      file('../air.js',              'air.js');
      file('air/Spec-app.xml',       'Spec-app.xml');
      file('air/Spec.html.template', 'Spec.html.template');
      file('air/suite.js',           'suite.js');
    }
  }

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

  this.init.apply(this, arguments);
}

module.exports = AirGenerator;
