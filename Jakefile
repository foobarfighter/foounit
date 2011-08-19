var fs = require('fs')
  , fsh = require('fsh')
  , pth = require('path')
  , exec = require('child_process').exec
  , PacMan = require('./build/pacman').PacMan;

var generateBrowserSuite = function (){
  console.log('--> generating browser suite');
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
    
    var connect = require('connect');
    var port = process.env.FOOUNIT_PORT || 5057;

    console.log('You can now run your tests by opening http://localhost:' + port + '/spec/browser/suite_runner.html in your browser');
    connect(connect.static(__dirname)).listen(port, 'localhost');
    console.log('Static web server is started');
    
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

  desc('Builds all adapter environments');
  task('all', ['build:core', 'build:browser'], function (){
    console.log('--> Built all adapters');
  });

});

namespace('site', function (){
  var checkVersion = function (){
    var version = process.env.VERSION;

    if (!version){
      throw new Error('Could not package without VERSION environment variable');
    }
    return version;
  }

  desc('Generates the website and substitutes the version numbers');
  task('generate', ['build:all'], function (){
    console.log('--> generating website');

    var version = checkVersion();

    exec('cd site/www && docpad generate',
      function (error, stdout, stderr){
        var files = fsh.findSync(__dirname + '/site/www/out', /\.(html|js)$/);

        for (var i = 0, ii = files.length; i < ii; ++i){
          var content = fs.readFileSync(files[i]);
          content = content.toString().replace(/\$version/g, version);
          fs.writeFileSync(files[i], content);
          console.log('--> replaced content in: ', files[i]);
        }

        complete();
      });
  }, true);


  desc('Update generator templates and package bundles for the website');
  task('update', ['build:all', 'site:generate'], function (){
  });
});



