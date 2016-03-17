// Load in our dependencies
var BrowserWindow = require('electron').BrowserWindow;
var ipcMain = require('electron').ipcMain;

// Define our function
function selectBoundingRect(cb) {
  // Create a new transparent window
  // TODO: Actually use transparency
  var browserWindow = new BrowserWindow();
  browserWindow.loadURL('file://' + __dirname + '/views/get-bounding-rect.html');

  // Add a listener to receive resize events
  ipcMain.on('bounding-rect-resize', function handleBoundingRectResize (evt) {
    console.log(evt.data);
  });
}

// Export our function
module.exports = selectBoundingRect;
