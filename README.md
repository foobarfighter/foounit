# foounit

A functionally scoped BDD style test framework that runs everywhere.

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
  * Firefox 3.6 - YES
* Chrome - YES
* Safari - YES
* Internet Explorer
  * IE6 - ?
  * IE7 - ?
  * IE8 - ?
  * IE9 - ?
* Rhino - NO

### Comand line
* Node.js
  * Node 0.2.6 - YES
  * Node 0.4   - NO

### Other
* Adobe AIR - NO
* The Ruby Racer - NO
* Webkit Mobile - NO

## Known Issues
* Stack trace reporting in the browser doesn't really help that much.
* XhrLoadingStrategy is not good enough.  We lose stack trace info in the eval.
* The UI for browser based running is not where I want it to be yet.

## Greetz
* mde - for providing good ideas
* peterbraden - for identifying problems with foounit's first iteration
* jasmine for beating me to the punch :) and also providing a better API than I originally had

### foounit isn't for you?
There's a lot of great unit testing frameworks for javascript these days.

Some notable alternatives are:

* jasmine    (This is also a rewrite of Screw Unit)
* shoulda.js (BDD with different syntax)
* vows       (BDD with different syntax)
* logan      (Cross environment unit testing)
