var fs = require('fs')
  , fsh = require('fsh')
  , pth = require('path')
  , PacMan = require('./build/pacman').PacMan;

var generateBrowserSuite = function (){
  console.log('calling generateBrowserSuite');
  var files = [];

  files = files.concat(fsh.findSync(__dirname + '/spec/shared', /.*_spec.js$/));
  files = files.concat(fsh.findSync(__dirname + '/spec/browser', /.*_spec.js$/));

  var content = '';
  for (var i = 0; i < files.length; ++i){
    var file = files[i];
    file = ':test' + file.substr((__dirname + '/spec').length);
    content += "foounit.getSuite().addFile('" + file + "');\n";
  }

  fs.writeFileSync(__dirname + '/spec/browser/autogen_suite.js', content);
};

var restartLoaderService = function (){
  console.log('calling restartLoaderService');
};


desc('Run foounit node specs');
namespace('spec', function (){
  task('node', [], function (){
    // Load foounit
    var foounit = require('foounit');

    // This runs the suite.
    global.fsh = fsh;       //FIXME: Hack

    // Poor man's way of just selecting a particular file or files under node to run
    var files = Array.prototype.slice.call(arguments, 0);
    for (var i = 0; i < files.length; ++i){
      foounit.getSuite().addFile(__dirname + '/' + files[i]);
    }

    require('./spec/suite');
  });

  task('browser', ['build:all'], function (){
    generateBrowserSuite();
    restartLoaderService();
  });

  task('server',  ['build:all'], function (){
    var foounit = require('./dist/foounit-node');
    foounit.mount('src',  __dirname + '/dist');
    foounit.mount('test', __dirname + '/spec');
    foounit.getSuite().addFile(__dirname + '/spec/server/server_spec.js');
    foounit.getSuite().run();
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
    console.log('--> Building foounit.js');
    var concated = pacman.concat('foounit.js');
    fs.writeFileSync('dist/foounit.js', concated);

    // Write to template dirs
    fsh.mkdirpSync(pth.join(__dirname, 'templates/browser/foounit'), 0777);
    fs.writeFileSync('templates/browser/foounit/foounit.js', concated);
    fsh.mkdirpSync(pth.join(__dirname, 'templates/browser-node/foounit'), 0777);
    fs.writeFileSync('templates/browser-node/foounit/foounit.js', concated);
  });

  desc('Builds the browser adapter');
  task('browser', ['build:core'], function (params){
    console.log('--> Building foounit-browser.js');
    var concated = pacman.concat('foounit-browser.js');
    fs.writeFileSync('dist/foounit-browser.js', concated);

    // Write to template dirs
    fsh.mkdirpSync('templates/browser/foounit', 0777);
    fs.writeFileSync('templates/browser/foounit/foounit-browser.js', concated);
    fsh.mkdirpSync('templates/browser-node/foounit', 0777);
    fs.writeFileSync('templates/browser-node/foounit/foounit-browser.js', concated);
  });

  desc('Build the server bundle');
  task('server', ['build:core'], function (param){
    console.log('--> Building foounit-server.js');
    var concated = pacman.concat('foounit-server.js');
    fs.writeFileSync('dist/foounit-server.js', concated);
  });

  desc('Builds all adapter environments');
  task('all', ['build:core', 'build:browser', 'build:server', 'build:templates'], function (){
    console.log('--> Built all adapters');
  });

});

