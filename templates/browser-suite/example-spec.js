foounit.require(':spec/spec-helper');

// Include your source file here
// foounit.load(':src/example.js');     // loads a file in global scope
// foounit.require(':src/example.js');  // loads a file in functional scope

describe('this is a group', function (){
  var foo;

  before(function (){
    foo = { bar: 123 };
  });

  it('fails', function (){
    expect(foo.baz).toNot(beFalsy);
  });

  it('passes', function (){
    expect(foo.bar).to(be, 123);
  });
});
