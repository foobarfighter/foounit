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

    //setTimeout(function (){
      var files = self._files;

      console.log('running files: ', files);

      for (var i = 0; i < files.length; ++i){
        var file = files[i].replace(/\.js$/, '');
        console.log('about to foounit.require: ', file);
        foounit.require(file);
      }

      console.log('executing tests: ', files.length);
      foounit.execute(foounit.build());
    //}, 1000);
  }

  , getFiles: function (){
    return this._files;
  }
});
