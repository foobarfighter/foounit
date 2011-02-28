var Server      = foounit.require(':src/foounit-server').Server
  , TestClient  = foounit.require(':test/helpers/server_helpers').TestClient
  , EchoService = foounit.require(':test/helpers/server_helpers').EchoService;

foounit.add(function (kw){ with(kw){
  describe('Server', function (){
    var server, client;

    before(function (){
      server = new Server('0.0.0.0', 5999);
      //server.mount(/.*/, new EchoService());
      client = new TestClient();
    });

    after(function (){
      server.stop();
    });

    it('starts a server on a host and port', function (){
      server.start();
      client.get('http://0.0.0.0:5999/echo');

      waitFor(function (){
        var response = client.inbox.takeNext();
        expect(response.body).to(equal, 'echo');
      });
    });
  });
}});
