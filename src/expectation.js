foounit.Expectation = function (actual){
  this._actual = actual;
}

foounit.mixin(foounit.Expectation.prototype, {
  to: function (matcherClass, expected){
    var matcher = new matcherClass();
    matcher.match(this._actual, expected);
  }

  , toNot: function (matcherClass, expected){
    var matcher = new matcherClass();
    matcher.notMatch(this._actual, expected);
  }
});
