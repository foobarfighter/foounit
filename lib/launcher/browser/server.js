var http = require('http')
  , url  = require('url')
  , fs   = require('fs')
  , sys  = require('sys')
  , path = require('path');

var HttpServer = function (ipAddress, port){
  this._mounts    = [];
  this._handler   = null;
  this._ipAddress = ipAddress;
  this._port      = port;
}

HttpServer.prototype.mount = function (virtualPath, logicalPath){
  this._mounts.push([virtualPath, logicalPath]);
}

HttpServer.prototype.handler = function (handler){
  this._handler = handler;
}

HttpServer.prototype.start = function (){
  var self = this;
  this.server = http.createServer(function (request, response){
    self.onRequest(request, response);
  }).listen(this._port, this._ipAddress);

  sys.puts('HttpServer running at http://' + this._ipAddress + ':' + this._port + '/');
}

HttpServer.prototype.stop = function (){
  this.server.close();
}

HttpServer.prototype.onRequest = function (request, response){
  try {  
    var parts = url.parse(request.url);
    var contentType = this.findMimeType(parts.pathname);
    var headers = this.getCacheBustingHeaders();
    headers['Content-Type'] = contentType;

    var handlerResponse, filePath = this.locate(parts.pathname);
  
    if (this._handler){ 
      handlerResponse= this._handler(parts.pathname, filePath);
    }

    if (handlerResponse === undefined){
      if (!filePath){
        throw new Error('Could not locate logical path for: ' + parts.pathname);
      }
      content = fs.readFileSync(filePath);
    } else {
      content = handlerResponse.content;
      for (var header in handlerResponse.headers){
        headers[header] = handlerResponse.headers[header];
      }
    }

    response.writeHead(200, headers);
    response.end(content);
    sys.puts('Successfully served path: ' + parts.pathname);

  } catch (e) {
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.end('Error occurred. This may be a 404 but this server is dumb as shit');
    sys.puts('Failed while trying to serve path: ' + parts.pathname + ': ' + e.message);
  }
}

HttpServer.prototype.locate = function (virtualPath){
  var parts = virtualPath.split('/');
  var partial = [];
  for (var i = 0, ii = parts.length; i < ii; ++i){
    partial.push(parts[i]);
    var logicalPath = this.findLogicalPath(partial.join('/'));
    if (logicalPath){
      return logicalPath + '/' + parts.slice(i+1).join('/');
    }
  }
}

HttpServer.prototype.findLogicalPath = function (partial){
  var mounts = this._mounts;
  for (var i = 0, ii = mounts.length; i < ii; ++i){
    var virtualPath = mounts[i][0], logicalPath = mounts[i][1];
    if (virtualPath == partial){
      return logicalPath;
    }
  }
}

HttpServer.prototype.findMimeType = function (file){
  var extension = path.extname(file);
  var type = 'text/plain';
  switch(extension){
    case '.js':
      type = 'application/javascript';
      break;
    case '.css':
      type = 'text/css';
      break;
    case '.html':
      type = 'text/html';
      break;
  }

  return type;
}

HttpServer.prototype.getCacheBustingHeaders = function (){
  var headers = {};
  headers['Cache-Control'] = 'max-age=-1, must-revalidate';
  headers['Exprires'] = new Date(0).toString();
  headers['Last-Modified'] = new Date().toString();
  headers['ETag'] = new Date().getTime().toString() + Math.random();
  return headers;
}

exports.HttpServer = HttpServer;
