// When an unknown exception occurs, fully bail
// DEV: By default, Electron will log/alert but keep on running
process.on('uncaughtException', function handleUncaughtException(err) {
  throw err;
});

// Load in our dependencies
var app = require('electron').app;
var async = require('async');
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

// Load in package info
var pkg = require('../package.json');

// When all windows close, keep our app open
app.on('window-all-closed', function handleWindowAllClosed() {
  // Do nothing, this listener keeps our app open
});

// Define helper for parsing CLI
function parseInt10(str) {
  var val = parseInt(str, 10);
  if (isNaN(val)) {
    throw new Error('"' + str + '" could not be parsed as an integer');
  }
  return val;
}

// Set up CLI parser
program.name = pkg.name;
program.version(pkg.version);

// Set up our main command
var mainCalled = false;
program
  .usage('[options] <outfile> [-- ffmpeg-options]')
  .option('--delay <delay>', 'Milliseconds to wait before recording starts\n' +
            '                   (default: 50 to prevent visible overlays)', parseInt10, 50)
  .option('--height-divisor <divisor>', 'Resize only to heights divisible by `m`', parseInt10, 1)
  .option('--width-divisor <divisor>', 'Resize only to widths divisible by `n`', parseInt10, 1);

program.action(function main(outfile/* , userFfmpegArgs..., program */) {
  // Set `mainCalled` to true
  mainCalled = true;

  // Extract our user's ffmpegArgs
  var userFfmpegArgs = [].slice.call(arguments, 1, -1);

  // When Electron is done loading, launch our application
  app.on('ready', function handleReady() {
    // Set up a SIGINT handler to fully quit
    // DEV: This is to prevent any FFmpeg starting while we kill our process
    var receivedSIGINT = false;
    function handleSIGINT() {
      console.error('SIGINT received. Exiting...');
      receivedSIGINT = true;
      process.exit(1);
    }
    process.on('SIGINT', handleSIGINT);

    // In series
    var geometry;
    async.waterfall([
      function selectGeometryFn(cb) {
        selectGeometry({
          heightDivisor: program.heightDivisor,
          widthDivisor: program.widthDivisor
        }, cb);
      },
      function handleSelectGeometry(_geometry, cb) {
        // If we received a SIGINT, then stop
        if (receivedSIGINT) {
          return;
        }

        // Log and save our requested geometry
        console.log('Requested geometry:', _geometry);
        geometry = _geometry;
        cb();
      },
      function waitForDelay(cb) {
        // If there is a delay, then wait for it
        if (program.delay) {
          console.log('Waiting for ' + program.delay + 'ms before recording...');
          setTimeout(function handleSetTimeout() {
            cb();
          }, program.delay);
        // Otherwise, wait for the next tick (to prevent Zalgo)
        } else {
          process.nextTick(cb);
        }
      },
      function recordFfmpeg() {
        // Remove our SIGINT handler
        process.removeListener('SIGINT', handleSIGINT);

        // If we received a SIGINT, then stop
        if (receivedSIGINT) {
          return;
        }

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
          // DEV: If we want to support overwrite prompting, then do it in Electron
          '-y'
          // Concatenate user input arguments
        ].concat(userFfmpegArgs).concat([
          // Indicate our output
          outfile
        ]);

        // Log our information
        console.log('Starting FFmpeg via:', shellQuote([ffmpegCmd].concat(ffmpegArgs)));

        // Start our child process
        // DEV: SIGINT will automatically propagate to the child
        var child = spawn(ffmpegCmd, ffmpegArgs, {stdio: 'inherit'});

        // When the child exits, we exit with the same code
        child.on('close', function handleClose(code, signal) {
          process.exit(code);
        });
      }
    ], function handleError(err) {
      // If there was an error, then throw it
      if (err) {
        throw err;
      }
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
