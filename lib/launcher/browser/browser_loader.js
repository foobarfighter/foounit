if (typeof foounit === 'undefined'){
  foounit = {};
}

(function (foounit){
  var get = function (uri){
    var request = xhr();
    request.open('GET', uri, false);
    request.send(null);
    if (request.status == 200){
      return request.responseText;
    }
    throw new Error('Failed XHR request to: ' + uri);
  }

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
  }

  var dirname = function (file){
    var parts = file.split('/');
    if (parts.length > 1){
      return parts.slice(parts, parts.length - 2).join('/');
    } else {
      return '.';
    }
  }

  var basename = function (file){
    var parts = file.split('/');
    return parts[parts.length - 1];
  }

  var load = function (file){
    var path = window.location.pathname + '/' + file
      ,  code = get(path)
      ,  funcString = '(function (require, module, __dirnme, __filename){' + code + '})'
      ,  loadContext = {}, module = { exports: {} }
      ,  func = eval(funcString);

    // TODO: Get dirs
    func.call(loadContext, foounit.require, module, dirname(path), filename(path));

    return module;
  }

  foounit.require = (function (){
    var tvars = { src: 'sourcepath' , test: 'testpath' };
    var regex = /:(\w+)/g;

    return function (path){
      var file = path.replace(regex, function (match, ref){
        return tvars[ref] ? tvars[ref] : match;
      });
      load(file + '.js');
      return load(code).exports;
    }
  })();
    
})(foounit);

if (typeof require === 'undefined'){
  require = function (){
    return foo;
  };
}
