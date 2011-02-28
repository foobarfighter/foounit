var http = require('http')
  , url = require('url');

var EchoService = function (responseText){
  this._responseText = responseText;

  // TODO: This should be jsgi or something
  var self = this;
  this.call = function (request, response){
    response.writeHead(200, {'Content-Type': 'text/plain' });
    response.end(self._responseText);
  };
};

var Inbox = function (){
  var _queue = [];

  this.takeNext = function (){
    return _queue.shift();
  };

  this.add = function (obj){
    _queue.push(obj);
  };
};

var TestClient = function (){
  var self = this;

  this.inbox = new Inbox();

  this.get = function (pUrl){
    var parsed = url.parse(pUrl)
      , client = http.createClient(parsed.port, parsed.hostname)
      , request = client.request('GET', parsed.pathname);

    request.on('response', function (response){
      var body = '';

      response.on('data', function (chunk){
        body += chunk;
      });

      response.on('end', function (){
        response.body = body;
        self.inbox.add(response);
      });
    });

    request.end();
  }

  this.kill = function (){
    // TODO: If we don't kill the clients then it will hang the test suite
  };
};

module.exports.EchoService = EchoService;
module.exports.TestClient = TestClient;
