// Load in our dependencies
var app = require('electron').app;
var program = require('commander');
// var getGeometry = require('./get-geometry');

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
program.usage('[options] [outfile]').action(
    function main (outfile) {
  // Set `mainCalled` to true
  mainCalled = true;
  console.log(outfile);

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

      // Start a process to capture a video
      // TODO: Record and compare the following
      //  avconv recorded GIF
      //    avconv -video_size 300x200 -f x11grab -i "$DISPLAY"+100,200 -r 10 -frames 30 -pix_fmt rgb24 gif.gif
      //  avconv recorded MP4 that's converted to GIF via `avconv`
      //    avconv -video_size 300x200 -f x11grab -i "$DISPLAY"+100,200 -r 10 -frames 30 mp4.mp4
      //    avconv -i mp4.mp4 -vf palettegen palette.png
      //      https://ffmpeg.org/ffmpeg-filters.html#palettegen-1
      //    libav-tools seems to lack `palettegen` so this is not plausible
      //  avconv recorded MP4 that's converted to GIF via ImageMagick
      //    avconv -video_size 300x200 -f x11grab -i "$DISPLAY"+100,200 -r 10 -frames 30 mp4.mp4
      //    avconv -i mp4.mp4 frames/out%03d.png
      //    convert -loop 0 frames/*.png imagemagick.gif

      // TODO: For easier development, set `-frames` count and allow this to run on loop
      //   prob name the CLI parameter `--duration`

      // TODO: Set low frame rate like 10
      // Attribution to: https://gist.github.com/dergachev/4627207
      //   and https://trac.ffmpeg.org/wiki/Capture/Desktop
      // Never mind this is a literal GIF output and the colors are effed
      //   avconv -video_size 1024x768 -f x11grab -i "$DISPLAY"+100,200 -pix_fmt rgb24 -f gif - | cat
      // This is generating transparent images for some reason...
      //   avconv -video_size 1024x768 -f x11grab -i "$DISPLAY"+100,200 frames/ffout%03d.png
      // This works but mp4... =_=
      //   avconv -video_size 1024x768 -f x11grab -i "$DISPLAY"+100,200 out.mp4
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
