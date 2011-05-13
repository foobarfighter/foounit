# foounit ![Project status](http://stillmaintained.com/foobarfighter/foounit.png)

A functionally scoped BDD style test framework that runs everywhere.

### Key features:

* Asyncronous test running
* Out of the box support for multiple javascript host environments: node.js, major browsers, Adobe AIR, The Ruby Racer
* BDD style test running
* A simple API

### Contrived Example
    var MyLib = foounit.require(':src/my_lib');

    foounit.add(function (kw){ with(kw){
      describe('when something happens', function (){
        var myLib;
        before(function (){
          myLib = new MyLib();
        });

        it('does something awesome', function (){
          expect(myLib.someFunc()).to(equal, 'foo');
        });
      });
    }});

## Quick Start Guide

### Quick Start for Browser Testing
1. Create a directory to put your tests
2. Drop in the example suite
3. Start a web server
4. Point your web browser at your server location

### Quick Start for Node Testing
1. TODO

### Quick Start for Shared Environment Testing
1. TODO

## Do we run everywhere yet? - NO

### Browser
* Firefox
  * Firefox 3.x - YES
  * Firefox 4.x - YES
* Chrome - YES
* Safari - YES
* Internet Explorer
  * IE6 - YES
  * IE7 - YES
  * IE8 - YES
  * IE9 - ?

### Comand line
* Node.js - YES
* Rhino - NO
* spidermonkey - ??

### Other
* Adobe AIR - NO
* The Ruby Racer - NO
* Webkit Mobile - NO

## Known Issues
* Stack trace reporting in the browser doesn't really help that much.
* XhrLoadingStrategy is not good enough.  We lose stack trace info in the eval.
* The UI for browser based running is not where I want it to be yet.

## About
TODO

## Other Alternatives

### foounit isn't for you?
There's a lot of great unit testing frameworks for javascript these days.  It's more important that people are testing their code than it is that people use foounit.

Some notable alternatives are:

* jasmine    (This is also a rewrite of Screw Unit)
* shoulda.js (BDD with different syntax)
* vows       (BDD with different syntax)
* logan      (Cross environment unit testing)

## Greetz
* mde - for providing good ideas
* peterbraden - for identifying problems with foounit's first iteration
* nathansobo - for rewriting Screw Unit while I was at Grockit which got me this far
* Alex Russell and James Burke - for being a sounding board for synchronous loader ideas
* jasmine for beating me to the punch :) and also providing a better API than I originally had
