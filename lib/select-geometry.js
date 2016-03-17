// Load in our dependencies
var BrowserWindow = require('electron').BrowserWindow;

// Define our function
function selectGeometry(cb) {
  // Create a new transparent window
  // TODO: Occupy full viewport?
  var browserWindow = new BrowserWindow({transparent: true, frame: false});
  browserWindow.loadURL('file://' + __dirname + '/browser/get-geometry.html');

  // Create a funciton to update our
  var bounds = browserWindow.getBounds();
  console.log(bounds);

  // When our window is resized, update its bounds
  browserWindow.on('resize', function handleResize () {
    bounds = browserWindow.getBounds();
    console.log(bounds);
  });

  // When the window closes, callback with our bounds
  browserWindow.on('close', function handleClose () {
    cb(null, bounds);
  });
}

// Export our function
module.exports = selectGeometry;
