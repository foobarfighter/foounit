
// Require all suite files
for (var i = 0, ii = foo.suite.files.length; i < ii; i++){
  foo.require(foo.suite.files[i]);
}

window.onload = function (){
  foo.unit.run();
}
