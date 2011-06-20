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
    var options;

    before(function (){
      cleanupAsync();
      run(function (){
        fs.mkdirSync(suitePath, 0777);
      });
    });

    after(function (){
      cleanupAsync();
    });

    describe('when the target is for the browser', function (){
      it('generates a test suite', function (){
        run(function (){
          options = { target: 'browser', dir: suitePath };
          footest.generateSuite(options);
        });

        // FIXME: ugh... isFileSync is actually async.  fsh sucks ass.
        waitFor(function (){
          expect(fs.isFileSync(pth.join(suitePath, 'suite.js'))).to(beTrue);
        });
      });
    });

    describe('when the target is for node', function (){
      it('generates a test suite', function (){
        run(function (){
          options = { target: 'node', dir: suitePath };
          footest.generateSuite(options);
        });

        // FIXME: ugh... isFileSync is actually async.  fsh sucks ass.
        waitFor(function (){
          expect(fs.isFileSync(pth.join(suitePath, 'suite.js'))).to(beTrue);
        });
      });
    });


    describe('when the target is for node,browser', function (){
      it('generates a test suite', function (){
        run(function (){
          options = { target: 'node, browser', dir: suitePath };
          footest.generateSuite(options);
        });

        // FIXME: ugh... isFileSync is actually async.  fsh sucks ass.
        waitFor(function (){
          expect(fs.isFileSync(pth.join(suitePath, 'suite.js'))).to(beTrue);
        });
      });
    });

  });
}});
