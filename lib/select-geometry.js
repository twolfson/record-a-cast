// Load in our dependencies
var assert = require('assert');
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var ipcMain = require('electron').ipcMain;

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

  // Save our window's current bounds
  // TODO: Remove console.log
  var bounds;
  function updateBounds() {
    bounds = browserWindow.getBounds();
  }
  updateBounds();

  // When our window is resized, update its bounds
  browserWindow.on('resize', updateBounds);

  // Set up drag handlers (using click handlers in the window)
  var dragStartPointerPosition;
  function calculateAbsolutePosition(browserPosition, pointerPosition) {
    /*
    +---------------+
    |               |
    |   +-------+   |
    |   |  *    |   |
    |   |       |   |
    |   +-------+   |
    |               |
    +---------------+
    */
    // browserPosition = [x, y] = [100, 200]
    // pointerPosition = {x, y} = {x: 20, y: 10}
    // absolutePosition = {x, y} = {x: 120, y: 210}
    return {
      x: browserPosition[0] + pointerPosition.x,
      y: browserPosition[1] + pointerPosition.y
    };
  }
  // When a drag starts, save the current pointer offset
  function handleDragStart(evt, data) {
    dragStartPointerPosition = data;
  }
  ipcMain.on('dragStart', handleDragStart);
  // When a drag moves
  function handleDragMove(evt, data) {
    // Verify we have a start position
    assert(dragStartPointerPosition);

    // Determine the current absolute position of the cursor
    var currentAbsolutePosition = calculateAbsolutePosition(browserWindow.getPosition(), data);

    // Calculate the new position of our window so the cursor stays in place
    //   and goes back to its original offset
    // DEV: dragStartPointerPosition is the position of the cursor with respect to the window's vieport
    //   when we started dragging
    var newX = currentAbsolutePosition.x - dragStartPointerPosition.x;
    var newY = currentAbsolutePosition.y - dragStartPointerPosition.y;

    // Update our location and save our bounds
    browserWindow.setPosition(newX, newY);
    updateBounds();
  }
  ipcMain.on('dragMove', handleDragMove);
  // When a drag ends, clean up
  function handleDragEnd(evt, data) {
    dragStartPointerPosition = null;
  }
  ipcMain.on('dragEnd', handleDragEnd);

  // When the window closes
  browserWindow.on('close', function handleClose () {
    // Remove our IPC subscriptions
    ipcMain.removeListener('dragStart', handleDragStart);
    ipcMain.removeListener('dragMove', handleDragMove);
    ipcMain.removeListener('dragEnd', handleDragEnd);

    // Callback with our bounds
    cb(null, bounds);
  });
}

// Export our function
module.exports = selectGeometry;
