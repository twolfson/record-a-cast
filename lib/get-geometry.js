// Load in our dependencies
var BrowserWindow = require('electron').BrowserWindow;
var ipcMain = require('electron').ipcMain;

// Define our function
function getGeometry(cb) {
  // Create a new transparent window
  // TODO: Actually use transparency
  var browserWindow = new BrowserWindow();
  browserWindow.loadURL('file://' + __dirname + '/views/get-geometry.html');

  // Add a listener to receive resize events
  ipcMain.on('geometry-resize', function handleGeometryResize (evt) {
    console.log(evt.data);
  });
}

// Export our function
module.exports = getGeometry;
