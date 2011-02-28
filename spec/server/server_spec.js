var Server      = foounit.require(':src/foounit-server').Server
  , TestClient  = foounit.require(':test/helpers/server_helpers').TestClient
  , EchoService = foounit.require(':test/helpers/server_helpers').EchoService;

foounit.add(function (kw){ with(kw){
  describe('foounit.Server', function (){
    var server, client;

    before(function (){
      server = new Server('0.0.0.0', 5999);
      client = new TestClient();
    });

    after(function (){
      server.stop();
      client.kill();
    });

    describe('.start', function (){
      before(function (){
        server.mount('.*', new EchoService('echo'));
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

    describe('.mount', function (){
      before(function (){
        server.mount(/^\/echo1/, new EchoService('echo1'));
        server.mount(/^\/echo1b/, new EchoService('echo1b'));
        server.start();
      });

      describe('when a pattern is matched', function (){
        it('calls a service that matches the pattern', function (){
          client.get('http://0.0.0.0:5999/echo1');
          waitFor(function (){
            expect(client.inbox.takeNext().body).to(equal, 'echo1');
          });
        });

        it('does not call another service after the first match', function (){
          client.get('http://0.0.0.0:5999/echo1b');
          waitForTimeout(function (){
            expect(client.inbox.takeNext().body).to(equal, 'echo1b');
          }, 500);
        });
      });

      describe('when a pattern is not matched', function (){
        xit('returns 404', function (){
        });
      });
    });
  });
}});
