// Load in our dependencies
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;

// If we are on Linux, then add transparency flags
// https://github.com/atom/electron/blob/v0.37.2/docs/api/frameless-window.md#limitations
// https://github.com/atom/electron/blob/v0.37.2/docs/api/app.md#appcommandlineappendswitchswitch-value
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

// Define our function
function selectGeometry(cb) {
  // Create a new transparent window
  // TODO: Occupy full viewport like Shutter?
  var browserWindow = new BrowserWindow({transparent: true, frame: false});
  browserWindow.loadURL('file://' + __dirname + '/browser/select-geometry.html');

  // Create a funciton to update our
  // TODO: Remove console.log
  var bounds = browserWindow.getBounds();
  console.log(bounds);

  // When our window is resized, update its bounds
  browserWindow.on('resize', function handleResize () {
    bounds = browserWindow.getBounds();
    // TODO: Remove console.log
    console.log(bounds);
  });

  // When the window closes, callback with our bounds
  browserWindow.on('close', function handleClose () {
    cb(null, bounds);
  });
}

// Export our function
module.exports = selectGeometry;
