var sys = require('sys');
var foo = require('./lib/foo/core');

foo.unit.build(function (kw){ with(kw){
  describe('top level description', function (){
    before(function(){
    });

    it('first top level example', function (){
    });

    it('second top level example', function (){
    });

    describe('nested description', function (){
      it('first nested example', function (){
      });
    });
  });

  foo.puts('called describe');
}});

sys.puts('running...');
