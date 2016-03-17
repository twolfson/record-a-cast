// Load in our dependencies
var app = require('electron').app;
var program = require('commander');
var getGeometry = require('./get-geometry');

// Load in package info
var pkg = require('../package.json');

// Handle CLI arguments
program
  .version(pkg.version)
  // Allow unknown Chromium flags
  // https://github.com/atom/electron/blob/v0.26.0/docs/api/chrome-command-line-switches.md
  .allowUnknownOption();
program.parse(process.argv);

// When Electron is done loading, launch our application
app.on('ready', function handleReady () {
  // TODO: Allow receiving of geometry from CLI
  console.log('Ready :+1:');
});
