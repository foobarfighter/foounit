var TestServer  = foounit.require(':test/server/test_server')
  , TestClient  = foounit.require(':test/helpers/server_helpers').TestClient;

foounit.add(function (kw){ with(kw){
  describe('foounit.server.loader', function (){
    var server, client;

    before(function (){
      server = TestServer.start('0.0.0.0', 5999);
      client = new TestClient('0.0.0.0.', 5999);

      client.get('/status');

      waitFor(function (){
        var response = client.inbox.takeNext();
        expect(response.body).to(match, /^foounit status: \d+$/);
      });

      // TODO: This would be cool.
      //run(function (){
      //  client.get('/status');
      //});

      // ensure would rerun the "run" block previous after it timed-out
      // it would continue to rerun the "run" block until it timed-out N times
      //ensure(function (){
      //  response = client.inbox.takeNext();
      //  expect(response.body).to(include, 'status:');
      //});
    });

    after(function (){
      server.stop();
      client.kill();
    });

    it('passes', function (){
      console.log('w00t!');
    });
  });

}});
