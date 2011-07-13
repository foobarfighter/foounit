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
      _loaded[path] = _loaderStrategy[type](path + '.js');
    }
    return _loaded[path];
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
  };

  /**
   * Reports the final results of the suite
   */
  foounit.report = function (info){
    foounit.ui.onFinish(info);

    // Used by jellyfish in CI environments
    window.testResults = info;
    window.jfComplete  = true;
  };

  /**
   * Report a single example
   */
  foounit.reportExample = (function (){
    var isUiInit = false; 

    return function (example){
      if (!isUiInit){
        foounit.ui.init();
        isUiInit = true;
      }

      try {
        if (example.isSuccess()){
          foounit.ui.onSuccess(example);
        } else if (example.isFailure()){
          foounit.ui.onFailure(example);
        } else if (example.isPending()){
          foounit.ui.onPending(example);
        }
      } catch (e){
        alert('foounit.reportExample: ' + e.message);
      }
    };
  })();

  /**
   * Convenience method for building and executing tests
   */
  foounit.run = function (){
    foounit.execute(foounit.build());
  };

})(foounit);

