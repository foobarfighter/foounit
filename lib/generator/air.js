var Generator = require(__dirname + '/base');

var AirGenerator = function (options){
  this._destinationPath = this._extractDestinationPath(options);
  this._generator = new Generator(destinationPath)
    .file('air/Spec-app.xml', 'Spec-app.xml')
    .file('air/Spec.html', 'Spec.html')
    .file('air/suite.js', 'suite.js');

  this.validate = function (){
    var stat = fs.statSync(this._destinationPath);
    if (stat.isFile){
      throw new Error('Cannot generate files because `' + destinationPath + '` already exists.');
    }
  }

  this.run = function (){
    this._generator.run();
  }

  this._extractDestinationPath = function (){
    return options.cmds[3] || 'spec';
  }
}

module.exports = AirGenerator;
