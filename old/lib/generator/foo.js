var Generator = require(__dirname + '/generator')
  , fsh = require(__dirname + '/../shared/fsh');

var FooGenerator = function (parsedOptions){

  this.init = function (parsedOptions){
    this._options   = parsedOptions;
    this._generator = new Generator(this.getDestinationPath());
    
    with(this._generator){
      file('../foo-unit.js',             'foo-unit.js');
      if (this.getProjectFile()){
        file('../'+ this.getProjectFile(), this.getProjectFile());
      }
    }
  }

  this.run = function (){
    this._generator.run();
  }

  this.validate = function (){
    var error
      , types = ['air', 'foo', 'node']
      , type = this._options.opts.type;

    if (!type){
      error = '-t was not specified';
    } else {
      var found = false;
      for (var i = 0, ii = types.length; i < ii; ++i){
        if (types[i] == type){
          found = true;
          break;
        }
      }
      if (!found){
        error = 'invalid type';
      }
    }

    if (error){
      throw new Error('Cannot generate files because: ' + error +
        "\n\tValid -t options are: " + types.join(', '));
    }
  }

  this.getProjectFile = function (){
    var type = this._options.opts.type;
    if (type == 'foo'){ return; }
    return this._options.opts.type + '.js';
  }

  this.getDestinationPath = function (){
    return this._options.cmds[4] || 'spec';
  }

  this.init.apply(this, arguments);
}

module.exports = FooGenerator;
