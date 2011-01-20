//foounit.require = (function () {
//  var _requires  = {};
//  var _translate = function(str){
//    var tvars = foounit.suite;
//    return str.replace(/:(\w+)/g, function(match, ref){
//        return tvars[ref];
//      });
//    };
//
//  return function (path){
//    path = _translate(path); 
//    if (_requires[path]) return;
//
//    console.debug('loading path: ' + path);
//
//    var xhr = new XMLHttpRequest();
//    try {
//      xhr.open('GET', path, false);
//      xhr.send(null);
//      if (xhr.status == 200){
//        try {
//          window.eval.call(window, xhr.responseText);
//        } catch (e){
//          throw new Error('Could not eval file ' + path);
//        }
//      } else {
//        throw new Error('Could not find file: ' + path);
//      }
//      requires[path] = true;
//    } catch (e) {
//      throw new Error('Error occurred while loading: ' + path + ': ' + e.message);
//    }
//
//    _requires[path] = true;
//  }
//})();

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
    var path = file
      ,  code = get(path)
      ,  funcString = '(function (require, module, __dirname, __filename){' + code + '})'
      ,  loadContext = {}, module = { exports: {} }

    var func = eval(funcString);
    // TODO: Get dirs
    func.call(loadContext, foounit.require, module, dirname(path), basename(path));

    return module;
  }

  foounit.require = (function (){
    var tvars = { src: '/src' , test: '/spec' };
    var regex = /:(\w+)/g;

    return function (path){
      var file = path.replace(regex, function (match, ref){
        return tvars[ref] ? tvars[ref] : match;
      });

      var module, path = file + '.js';
      try {
        module = load(path);
      } catch (e){
        console.error('Failed to load path: ' + path + ': ' + e.message, e); 
      }
      return module.exports;
    }
  })();
    
})(foounit);

if (typeof require === 'undefined'){
  require = function (){
    return foounit;
  };
}

if (typeof __dirname === 'undefined'){
  __dirname = '.';
}

if (typeof module === 'undefined'){
  module = {};
}


// TODO: Make report template configurable
// foounit.suite.template = 'mytemplate.html';
foounit.report = function (example){
  function formatStack(stack){
    if (!stack){ return ''; }
    return '<pre>' + stack.join("\n\t") + '</pre>';
  }

  var node = document.createElement('div');
  var description = example.getFullDescription();
  if (example.isSuccess()){
    node.className = 'pass';
    node.innerHTML = '<div class="description">' + description + '</div>';
  } else {
    node.className = 'fail';
    var html = '<div class="description">' + description + '</div>';
    html += '<div class="failure-message">' + example.getMessage() + '<br />' + formatStack(example.getStack()) + '</div>';
    node.innerHTML = html;
  }
  var reportNode = document.getElementById('results');
  reportNode.appendChild(node);
}

foounit.run = function (runners){
  runners = runners || foounit.build();
  for (var i = 0, ii = runners.length; i < ii; ++i){
    var runner = runners[i];
    runner.run();
    foounit.report(runner);
  }
}
