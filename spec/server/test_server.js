var connect  = require('connect')
  , pth      = require('path')
  , services = foounit.require(':src/foounit-server');

var server;

exports.start = function (host, port){
  server = connect(
    services.loader('/foounit', foounit.getMounts())
  , services.status('/status')
  );
  server.listen(port, host);

  return this;
};

exports.stop = function (){
  try {
    server.close();
  } catch (e){
    console.log('Error stopping server: ', e.message);
  }
};


