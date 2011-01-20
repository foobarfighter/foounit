//>>If foo.env('node', 'rubyracer')
var foo = require(__dirname + '/../foo-unit')
//>>End

var testfoo = foo.require(':src/foo-unit');

/*
in node:    testfoo gets mapped from exports to testfoo in this env
in browser: assert that testfoo exists
*/
//foo.require(':src/foo-unit', 'testfoo');

/*
in node:    exports gets mapped to foo
            assert that foo.bar.Baz exists

in browser: assert that foo.bar.Baz exists
*/
//foo.require(':src/foo-unit', 'foo.bar.Baz');

/*
in node:    spec helper must export
in browser: spec helper must have a spec ns
*/
//foo.require(':test/spec_helper.js', 'spec');

/*
Syntax implications:
  in node:
    - what if node exports more than one symbol?
  in browser:
    - require() calls need to be ommitted (proxy?)
  in air:
    - require() calls need to be stripped
*/
//foo.require(':src/foo-unit', 'foo.bar.Baz');

foo.unit.add(function (cx){ with(cx){
  describe('passing test', function (){
    it('passes', function (){
      expect(1).to(equal, 1);
    });
  });

  describe('failing test', function (){
    it('fails', function (){
      expect(1).to(equal, 2);
    });
  });
}});


//>>If foo.env('node', 'rubyracer')
module.exports = foo;
//>>End
