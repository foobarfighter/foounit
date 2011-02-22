foounit.Suite = function (){
  this._files = [];
}

foounit.mixin(foounit.Suite.prototype, {
  addPattern: function (){}

  , addFile: function (file){
    this._files.push(file);
  } 

  , run: function (){
    var self = this;

    var files = self._files;
    for (var i = 0; i < files.length; ++i){
      var file = files[i].replace(/\.js$/, '');
      foounit.require(file);
    }
    console.log('>> foounit building...');
    foounit.execute(foounit.build());
  }

  , getFiles: function (){
    return this._files;
  }
});
