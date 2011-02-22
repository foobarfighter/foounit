var fs = require('fs')
  , fsh = require('./build/fsh')
  , PacMan = require('./build/pacman').PacMan;

var generateBrowserSuite = function (){
  console.log('calling generateBrowserSuite');
  var files = [];

  files = files.concat(fsh.findSync(__dirname + '/spec/shared', /.*_spec.js$/));
  files = files.concat(fsh.findSync(__dirname + '/spec/browser', /.*_spec.js$/));

  var content = '';
  for (var i = 0; i < files.length; ++i){
    content += "foounit.getSuite().addFile('" + files[i] + "');\n";
  }

  fs.writeFileSync(__dirname + '/spec/browser/autogen_suite.js', content);
};

var restartLoaderService = function (){
  console.log('calling restartLoaderService');
};


desc('Run foo-unit node specs');
namespace('spec', function (){
  task('node', ['build:node'], function (){
    var foounit = require('./dist/foo-unit-node');
    foounit.run(__dirname + '/spec', __dirname + '/dist', /.*_spec.js$/);
  });

  task('browser', ['build:browser'], function (){
    generateBrowserSuite();
    restartLoaderService();
  });
});


namespace('build', function (params) {
  var pacman = PacMan.create('./build/build.json')
    , resetDist = function (){
      if (!fsh.existsSync('dist')){
        fsh.mkdirpSync('dist', 0755);
      }
    };

  desc('Cleans the build');
  task('clean', [], function (params){
    console.log('--> Clean');
    var files = fsh.findSync('dist', '.*', { includeDirs: true });

    // Reverse order so files get deleted before directories
    for (var i = files.length - 1; i >= 0; --i){
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

  desc('Builds the browser adapter');
  task('browser', ['build:core'], function (params){
    console.log('--> Building foounit-browser.js');

    var concated = pacman.concat('foounit-browser.js');
    fs.writeFileSync('dist/foounit-browser.js', concated);
  });

});

