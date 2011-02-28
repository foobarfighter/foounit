var http = require('http');

var Server = function (host, port){
  this._host = host;
  this._port = port;
  this._server = null;
  this._mounts = [];
};

Server.prototype.start = function (){
  var self = this;

  this._server = http.createServer(function (request, response){
    response.writeHead(200, {'Content-Type: ': 'text/plain' });
    response.end('echo');
    //try {
    //  var mounts = self.mounts;
    //  for (var i = 0; i < mounts.length; ++i){
    //    var mount = mounts[i];
    //    if (request.pathname.match(mount.pattern)){
    //      mount.service.call(request, response);
    //      break;
    //    }
    //  }
    //} catch (e){
    //  console.log('>> Server: error while serving request: ', e);
    //}
  });

  this._server.listen(this._port, this._host);
};

Server.prototype.stop = function (){
  this._server.close();
};

Server.prototype.mount = function (pattern, appService){
};

module.exports.Server = Server;
