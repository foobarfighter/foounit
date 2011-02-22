var footest = foounit.require(':src/foounit');

foounit.add(function (kw){ with(kw){
  describe('foounit.Suite', function (){
    var suite;

    before(function (){
      suite = new foounit.Suite();
    });

    describe('.addFile', function (){
      it('adds a test file to the suite of files to be run', function (){
        suite.addFile(':foo/bar/baz_spec.js');
        expect(suite.getFiles()).to(equal, [':foo/bar/baz_spec.js']);
      });
    });

    describe('.run', function (){
      xit('runs all tests in all files', function (){
      });
    });
  });
}});
