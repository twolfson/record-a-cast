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
  // getGeometry(function handleGeometry (err, geometry) {
  //   // If there was an error, then throw it
  //   if (err) {
  //     throw err;
  //   }
  // TODO: Remove dev next tick
  process.nextTick(function handleNextTick () {
    var geometry = {x: 1520, y: 227, width: 800, height: 600};

    // Otherwise, log the geometry
    console.log('got geometry', geometry);
  });
});
