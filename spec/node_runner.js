var foo  = require(__dirname + '../lib/foo-unit');
var node = require(__dirname + '../lib/node');

for (var prop in node){
  if (node.hasOwnProperty(prop)){
    foo[prop] = node[prop];
  }
}

foo.require(__dirname + '/suite');
