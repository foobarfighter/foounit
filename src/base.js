// Copyright Bob Remeika 2011-forever

// This file consists of some host environment bootstrapping and discovery.
foounit = typeof foounit === 'undefined' ?  {} : foounit;

// Appends .hostenv and .mixin to foounit
(function (foounit){

  /**
   * Throws a bootstrapping error
   */
  var _throwError = function (message){
    throw new Error('foounit: bootstrap: ' + message);
  }

  /**
   * Requisite host environment params
   */
  foounit.hostenv = (function (){
    var _type = 'unknown';

    // Host environment is browser-like
    if (typeof window !== 'undefined'){
      _type = 'browser';
    } else if (typeof global !== 'undefined'){
      _type = 'node';
    } else {
      _throwError('Unrecognized environment');
    }

    return { type: _type };
  })();

  /**
   * Does a shallow copy
   */
  foounit.mixin = function (target, source){
    for (var prop in source){
      if (source.hasOwnProperty(prop)){
        target[prop] = source[prop];
      }
    }
    return target;
  };

})(foounit);

// If this is node then make sure we export foounit
if (foounit.hostenv.type == 'node'){
  module.exports = foounit;
}

