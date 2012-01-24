try {
  foounit = typeof foounit == 'undefined' ? require('foounit') : foounit;
} catch (ignore){}

(function (foounit){

  // Set __dirname if it doesn't exist (like in the browser)
  __dirname = typeof __dirname !== 'undefined' ?
                __dirname : foounit.browser.dirname(/suite.js$/);
  
  // Change this to be a reference to your primary source directory
  if (foounit.hostenv.type == 'browser'){
    foounit.browser.setLoaderStrategy(new foounit.browser.XhrLoaderStrategy());
  }

  /**
   * Mount special directories so they can be referenced
   * via foounit.load and foounit.require
   */
  foounit.mount('src',  __dirname + '/../src');     // Change to your source directory
  foounit.mount('spec', __dirname);

})(foounit);


foounit.getSuite().addFile(':spec/example-spec');
foounit.getSuite().run();
