
// Require all suite files
for (var i = 0, ii = foounit.suite.files.length; i < ii; i++){
  foounit.require(foounit.suite.files[i]);
}

window.onload = function (){
  foounit.run();
}
