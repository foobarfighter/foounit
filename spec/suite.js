try {
  require.paths.push('../lib');
  foo = require('foo-unit');
} catch (e){
  if (global && module && process){
    throw e;
  }
}

// Require all suite files
var files = foo.unit.files();
for (var i = 0, ii = files.length; i < ii; i++){
  foo.require(files[i]);
}

foo.onload(function (){
  foo.unit.run();
});
