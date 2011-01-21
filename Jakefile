var fs = require('fs')
  , fsh = require('./build/fsh')
  , PacMan = require('./build/pacman').PacMan;

namespace('build', function (params) {

  function resetDist(){
    if (!fsh.existsSync('dist')){
      fsh.mkdirpSync('dist', 0644);
    }
  }
  
  var pacman = PacMan.create('./build/build.json')

  desc('Cleans the build');
  task('clean', [], function (params){
    console.log('--> Clean');
    var files = fsh.findSync('dist', '.*', { includeDirs: true });
    for (var i = 0, ii = files.length; i < ii; ++i){
      var file = files[i];
      if (fsh.isDirectorySync(file)){
        fs.rmdirSync(file);
      } else {
        fs.unlinkSync(file);
      }
    }
  });

  desc('Builds the core bundle');
  task('core', ['build:clean'], function (params){
    console.log('--> Building foo-unit.js');
    var concated = pacman.concat('foo-unit.js');
    fs.writeFileSync('dist/foo-unit.js', concated);
  });


  desc('Builds the core and the node adapter');
  task('node', ['build:core'], function (params){
    console.log('--> Building foo-unit-node.js');

    var concated = pacman.concat('foo-unit-node.js');
    fs.writeFileSync('dist/foo-unit-node.js', concated);
  });
});

