var fs = require('fs')
  , fsh = require('./build/fsh')
  , PacMan = require('./build/pacman').PacMan;

namespace('build', function (params) {
  desc('Builds the core bundle');
  task('core', [], function (params){
    console.log('--> Building foo-unit.js');

    var pacman = PacMan.create('./build/build.json');
    var concated = pacman.concat('foo-unit.js');

    if (!fsh.existsSync('dist')){
      fsh.mkdirpSync('dist', 0755);
    }
    fs.writeFileSync('dist/foo-unit.js', concated);
  });

  desc('Builds the core and the node adapter');
  task('node', ['build:core'], function (params){
    console.log('This is the build:node task');
  });
});

