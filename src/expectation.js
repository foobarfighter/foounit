
foounit.Expectation = function (actual){
  this._actual = actual;
}

foounit.mixin(foounit.Expectation.prototype, {
  to: function (matcherClass, expected){
    var matcher = new matcherClass();
    matcher.match(expected, this._actual);
  }

  , toNot: function (matcherClass, expected){
    var matcher = new matcherClass();
    matcher.notMatch(expected, this._actual);
  }
});
