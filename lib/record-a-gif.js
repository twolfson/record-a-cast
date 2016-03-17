// Load in our dependencies
var app = require('electron').app;
var program = require('commander');

// Load in package info
var pkg = require('../package.json');

// Handle CLI arguments
program
  .version(pkg.version)
  // Allow unknown Chromium flags
  // https://github.com/atom/electron/blob/v0.26.0/docs/api/chrome-command-line-switches.md
  .allowUnknownOption();
program.parse(process.argv);

// When Electron is done loading, launch our applicaiton
app.on('ready', function handleReady () {
  console.log('Ready :+1:');
});
