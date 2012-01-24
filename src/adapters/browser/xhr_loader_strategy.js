if (typeof foounit.browser === 'undefined'){
  foounit.browser = {};
}

foounit.browser.XhrLoaderStrategy = function (){

  var xhr = function (){
    if (window.XMLHttpRequest) {
      return new window.XMLHttpRequest;
    } else {
      try {
        return new ActiveXObject("MSXML2.XMLHTTP.3.0");
      } catch(ex) {
        throw new Error('Could not get XmlHttpRequest object');
      }
    }
  };

  var get = function (uri){
    var request = xhr();
    request.open('GET', uri, false);
    request.send(null);
    if (request.status == 200){
      return request.responseText;
    }
    throw new Error('Failed XHR request to: ' + uri);
  };

  var dirname = function (file){
    var parts = file.split('/');
    if (parts.length > 1){
      return parts.slice(parts, parts.length - 2).join('/');
    } else {
      return '.';
    }
  };

  var basename = function (file){
    var parts = file.split('/');
    return parts[parts.length - 1];
  };

  var geval = function (src, hint){
    var g = foounit.hostenv.global;
    src += appendHint(src, hint);
    return (g.execScript) ? g.execScript(src) : g.eval.call(g, src);
  };

  var leval = function (src, hint){
    src = appendHint(src, hint);

    var ret;
    if (document.all){        // IE is slightly different
    eval('ret = ' + src);
    } else {
    ret = eval(src);
    }
    return ret;
  };

  var appendHint = function (src, hint){
    return src + "\r\n////@ sourceURL=" + hint;
  };

  /**
   * Implements lower level require responsible for syncronously getting code
   * and loading the code in CommonJS format with functional scope.
   */
  this.require = function (path){
    var code = get(path)
      , module = { exports: {} }
      , funcString = '(function (foounit, module, exports, __dirname, __filename){' + code + '});';
  
    try {
      var func = leval(funcString, path);
      func.call({}, foounit, module, module.exports, dirname(path), basename(path));
    } catch (e){
      console.error('Failed to load path: ' + path + ': ' + e.message, e);
    }

    return module.exports;
  };

  /** 
   * Implements low level require for synchronously running code in a global scope.
   */
  this.load = function (path){
    var code = get(path);
    geval(code, path);
    return true;
  };
};
