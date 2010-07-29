foo.require = (function () {
  var requires = {};
  return function (path){
    if (requires[path]) return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);
    if (xhr.status == 200){
      try {
        window.eval.call(window, xhr.responseText);
      } catch (e){
        throw new Error('Could not eval file ' + path);
      }
    } else {
      throw new Error('Could not find file: ' + path);
    }

    requires[path] = true;
  }
})();

// TODO: Make report template configurable
// foo.unit.template = 'mytemplate.html';
foo.unit.report = function (example){
  var node = document.createElement('div');
  var description = example.getFullDescription();
  if (example.isSuccess()){
    node.className = 'pass';
    node.innerHTML = '<div class="description">' + description + '</div>';
  } else {
    node.className = 'fail';
    var html = '<div class="description">' + description + '</div>';
    html += '<div class="failure-message">' + example.getMessage()+ '</div>';
    node.innerHTML = html;
  }
  var reportNode = document.getElementById('results');
  reportNode.appendChild(node);
}

foo.unit.run = function (runners){
  runners = runners || foo.unit.build();
  for (var i = 0, ii = runners.length; i < ii; ++i){
    var runner = runners[i];
    runner.run();
    foo.unit.report(runner);
  }
}
