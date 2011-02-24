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
  foounit.report = (function (){
    var createPendingNode = function (description){
      var titleDiv = document.createElement('div');
      titleDiv.className = 'example pending';
      titleDiv.innerHTML = '<div class="title">' + description + '</div>';
      return titleDiv;
    };

    return function (info){
      var body = document.getElementsByTagName('body')[0];
      try {
        var pending = info.pending;
        for (var i = 0; i < pending.length; ++i){
          body.appendChild(createPendingNode(pending[i]));
        }

        console.log('>> foounit summary: '   +
          info.failCount      + ' failed, '  +
          info.passCount      + ' passed, '  +
          info.pending.length + ' pending, ' +
          info.totalCount     + ' total');
        console.log('>> foounit runtime: ', info.runMillis + 'ms');
      } catch (e){
        alert('foounit.report: ' + e.message);
      }
    };
  })();

  /**
   * Report a single example
   */
  foounit.reportExample = (function (){

    var createFailureNode = function (example){
      var titleDiv = document.createElement('div');
      titleDiv.className = 'example failure';
      titleDiv.innerHTML = '<div class="title">' + example.getDescription() + '</div>';

      console.debug(example);

      var stackDiv = document.createElement('div');
      stackDiv.className = 'stack';
      stackDiv.innerHTML = '<pre>' + example.getStack() + '</pre>';
      titleDiv.appendChild(stackDiv);

      return titleDiv;
    };

    return function (example){
      var body = document.getElementsByTagName('body')[0];
      try {
        if (example.isFailure()){
          var failNode = createFailureNode(example);
          body.appendChild(failNode);
        }
      } catch (e){
        alert('foounit.reportExample: ' + e.message);
      }
    };
  })();

})(foounit);

