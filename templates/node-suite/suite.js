foounit = typeof foounit == 'undefined' ? require('foounit') : foounit;

foounit.mount('src',  __dirname + '/../src');     // Change to your source directory
foounit.mount('spec', __dirname);

/**
 * Add test files to your suite
 */
foounit.getSuite().addFile(':spec/example-spec');
foounit.getSuite().run();
