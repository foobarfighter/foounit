if (typeof fixture === 'undefined'){
  fixture = {};
  fixture.test = {};
  fixture.test.module = {};

  fixture.test.module.throwError = function (){
    throw new Error('throwError expected');
  };
}
