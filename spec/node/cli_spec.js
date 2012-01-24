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
      //cleanupAsync();
    });

    describe('when the target directory already exists', function (){
      it('fails and does not generate the suite', function (){
        var path = pth.join(suitePath, 'spec');
        fs.mkdirSync(path, 0777);

        expect(function (){
          options = { target: 'node', dir: path };
          footest.generateSuite(options);
        }).to(throwError, /Destination directory already exists/);
      });
    });

    // Dynamic test generation for each target
    var targets = ['browser', 'node, browser', 'node'];

    for (var i = 0, ii = targets.length; i < ii; ++i){
      (function (target){   // generate tests

        describe('when the target is for the ' + target, function (){
          var path;

          before(function (){
            path = pth.join(suitePath, 'spec');
          });

          describe('when there is no suite option', function (){
            before(function (){
              options = { target: target, dir: path };
            });

            it('generates a minimal test', function (){
              run(function (){
                footest.generateSuite(options);
              });

              waitFor(function (){
                expect(fs.isFileSync(pth.join(path, 'example-spec.js'))).to(beTrue);
                expect(fs.isFileSync(pth.join(path, 'suite.js'))).toNot(beTrue);
              });
            });
          });

          describe('when the suite option is passed', function (){
            before(function (){
              options = { target: target, dir: path, suite: true };
            });

            it('generates a test suite', function (){
              run(function (){
                footest.generateSuite(options);
              });

              // FIXME: ugh... isFileSync is actually async.  fsh sucks ass.
              waitFor(function (){
                expect(fs.isFileSync(pth.join(path, 'suite.js'))).to(beTrue);
              });
            });
          });
        });

      })(targets[i]);
    }  // end of generated tests

  });
}});
