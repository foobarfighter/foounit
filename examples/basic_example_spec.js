foo.unit.require('../lib/foo/core.js');

foo.unit.build(function (keywords) { with(keywords)

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

});
