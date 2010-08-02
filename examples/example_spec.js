try { foo = require('path/to/foo-unit/lib/foo-unit'); } catch (e){}
foo.require('my.awesome.Widget', 'code/path/to/widget.js');

foo.unit.exports(my.awesome.Widget, function (kw){ with(kw){
  describe('top level description', function (){
    var widget;

    before(function(){
      widget = new my.awesome.Widget();
    });

    it('tells us how awesome it is', function (){
      expect(widget.isAwesome()).to(beTrue);
    });

    describe('when the widget is set to *unawesome*', function (){
      before(function (){
        widget.setAwesome(false);
      });

      it('still reports awesomeness', function (){
        expect(widget.isAwesome()).to(beTrue);
      });
    });
  });
}});
