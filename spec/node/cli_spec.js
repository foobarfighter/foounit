var suitePath = '/tmp/foounitsuite'
  , footest = require('foounit')
  , exec = require('child_process').exec
  , pth = require('path')
  , fs = require('fsh');

foounit.add(function (kw){ with(kw){
  var finished;

  function cleanupAsync(){
    kw.expect(suitePath).toNot(kw.beFalsy);
    exec('rm -rf ' + suitePath, function (error, stdout, stderr) {
      finished = true;
    });

    kw.waitFor(function (){
      kw.expect(finished).to(kw.beTrue);
    });
  }

  foounit.addKeyword('beFile', function (){
    this.match = function (actual, expected){
      expect(fs.isFileSync(actual)).to(beTrue);
    }

    this.notMatch = function (actual, expected){
      expect(fs.isFileSync(actual)).to(beFalse);
    }
  });

  describe('generateSuite', function (){
    before(function (){
      cleanupAsync();
      run(function (){
        fs.mkdirSync(suitePath, 0777);
      });
    });

    after(function (){
      cleanupAsync();
    });

    it('generates a test suite for a target environment in a directory', function (){
      var options = { target: 'browser', dir: suitePath };
      footest.generateSuite(options);
      expect(pth.join(suitePath, 'suite.js')).to(beFile);
    });
  });
}});
