(function (foounit){
  if (typeof foounit.browser === 'undefined'){
    foounit.browser = {};
  }

  var _loaded = {}
    , _loaderStrategy;

  var _loadCode = function (path, type){
    // FIXME: Kinda hacky
    if (path.match(/foounit$/) || path.match(/foounit-browser$/)){
      return foounit;
    }

    path = foounit.translatePath(path);
    if (!_loaded[path]){
      _loaded[path] = true;
      return _loaderStrategy[type](path + '.js');
    }
  };

  /**
   * Set the strategy for synchronous dependency loading in functional scope (ala Node's require)
   */
  foounit.browser.setLoaderStrategy = function (strategy){
    _loaderStrategy = strategy;
  };

  /**
   * Load a javascript file in a functional scope
   */
  foounit.require = function (path){
    return _loadCode(path, 'require');
  };

  /**
   * Load a javascript file in the global scope
   */
  foounit.load = function (path){
    return _loadCode(path, 'load');
  };

  /**
   * Extracts the directory from a loaded script in the DOM
   *
   * @param pattern - A pattern used to locate the script source in the DOM
   */
  foounit.browser.dirname = function (pattern){
    var getDirectoryFromPath = function (path){
      var dir = path.split('/');
      dir.pop();
      return dir.join('/');
    }

    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; ++i){
      var script = scripts[i].src;
      if (script.match(pattern)){
        return getDirectoryFromPath(script);
      }
    }
  }

  /**
   * Reports the final results of the suite
   */
  foounit.report = function (info){
    console.log('>> foounit summary: '   +
      info.failCount      + ' failed, '  +
      info.passCount      + ' passed, '  +
      info.pending.length + ' pending, ' +
      info.totalCount     + ' total');
    console.log('>> foounit runtime: ', info.runMillis + 'ms');
  };

  /**
   * Report a single example
   */
  foounit.reportExample = function (example){
    if (example.isFailure()){
      //console.log('example failed: ', example.getException().message);
    }
  };

})(foounit);

