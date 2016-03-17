// When an unknown exception occurs, fully bail
// DEV: By default, Electron will log/alert but keep on running
process.on('uncaughtException', function handleUncaughtException (err) {
  throw err;
});

// Load in our dependencies
var app = require('electron').app;
var program = require('commander');
var shellQuote = require('shell-quote').quote;
var which = require('which');
var spawn = require('child_process').spawn;
var selectGeometry = require('./select-geometry');

// Resolve our FFmpeg path
var FFMPEG_BIN = process.env.FFMPEG_BIN;
if (FFMPEG_BIN === undefined) {
  try { FFMPEG_BIN = which.sync('ffmpeg'); } catch (err) {}
  if (FFMPEG_BIN === undefined) {
    try { FFMPEG_BIN = which.sync('avconv'); } catch (err) {}
  }
}
if (FFMPEG_BIN === undefined) {
  throw new Error('Failed to find `ffmpeg` or `avconv`. ' +
    'Please verify either one is installed and on the `PATH` environment variable ' +
    'or use the `FFMPEG_BIN` environment variable');
}

// Resolve our current DISPLAY
var DISPLAY = process.env.DISPLAY;
if (DISPLAY === undefined) {
  throw new Error('Expected `DISPLAY` environment variable to be defined but it was not. ' +
    'This is required for FFmpeg\'s `x11grab`, please define it');
}

// If we are on Linux, then add transparency flags
// https://github.com/atom/electron/blob/v0.37.2/docs/api/frameless-window.md#limitations
// https://github.com/atom/electron/blob/v0.37.2/docs/api/app.md#appcommandlineappendswitchswitch-value
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

// Load in package info
var pkg = require('../package.json');

// Set up CLI parser
program.name = pkg.name;
program.version(pkg.version);

// Set up our main command
var mainCalled = false;
program.usage('[options] <outfile>').action(
    function main (outfile) {
  // Set `mainCalled` to true
  mainCalled = true;

  // When Electron is done loading, launch our application
  app.on('ready', function handleReady () {
    // Retrieve our current geometry
    selectGeometry(function handleGeometry (err, geometry) {
      // If there was an error, then throw it
      if (err) {
        throw err;
      }

      // Log our requested geometry
      console.log('Requested geometry:', geometry);

      // Set up our process invocation
      // https://trac.ffmpeg.org/wiki/Capture/Desktop
      var ffmpegCmd = FFMPEG_BIN;
      var ffmpegArgs = [
        // Specify record area dimensions
        //   -video_size 300x200
        '-video_size', geometry.width + 'x' + geometry.height,
        // Indicate our source
        '-f', 'x11grab',
        //   :0.0+100,200
        '-i', DISPLAY + '+' + geometry.x + ',' + geometry.y,
        // Overwrite existing files
        '-y',
        // Indicate our output
        outfile
      ];

      // Log our information
      console.log('Starting FFmpeg via:', shellQuote([ffmpegCmd].concat(ffmpegArgs)));

      // Start our child process
      // DEV: SIGINT will automatically propagate to the child
      var child = spawn(ffmpegCmd, ffmpegArgs, {stdio: 'inherit'});

      // When the child exits, we exit with the same code
      child.on('close', function handleClose (code, signal) {
        process.exit(code);
      });
    });
  });
});

// Parse our CLI
program.parse(process.argv);

// If main wasn't called, then display our help and exit
if (!mainCalled) {
  program.outputHelp();
  process.exit(0);
}
