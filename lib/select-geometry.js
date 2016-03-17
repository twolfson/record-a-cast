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
    console.log('bounds updated', bounds);
  }
  updateBounds();

  // When our window is resized, update its bounds
  browserWindow.on('resize', updateBounds);

  // When our window is dragged from the inside
  // DEV: We are creating our own move vector but in absolute desktop coordinates
  var dragStartBrowserPosition, dragStartAbsolutePosition;
  function calculateAbsolutePosition(browserPosition, pointerPosition) {
    // DEV: `browserPosition = [x, y] = [100, 200]`
    // DEV: `pointerPosition = {x, y} = {x: 100, y: 200}`
    return {
      x: browserPosition[0] + pointerPosition.x,
      y: browserPosition[1] + pointerPosition.y
    };
  }
  // TODO: Remove our listeners
  ipcMain.on('dragStart', function handleDragStart (evt, data) {
    // Record our current start position
    dragStartBrowserPosition = browserWindow.getPosition();
    dragStartAbsolutePosition = calculateAbsolutePosition(dragStartBrowserPosition, data);
  });
  function handleDragMove(evt, data) {
    // Verify we have a start position
    assert(dragStartBrowserPosition);

    // Calculate distance from start
    var currentAbsolutePosition = calculateAbsolutePosition(browserWindow.getPosition(), data);
    var moveVector = {
      x: currentAbsolutePosition.x - dragStartAbsolutePosition.x,
      y: currentAbsolutePosition.y - dragStartAbsolutePosition.y
    };
    var newX = dragStartAbsolutePosition.x + moveVector.x;
    var newY = dragStartAbsolutePosition.y + moveVector.y;

    // Update our location
    console.log(dragStartBrowserPosition, moveVector, newX, newY);
    browserWindow.setPosition(newX, newY);

    // Update our bounds
    updateBounds();
  }
  ipcMain.on('dragMove', handleDragMove);
  ipcMain.on('dragEnd', function handleDragEnd (evt, data) {
    // Call our drag move handler
    // TODO: Do we need this?

    // Clean up our start/end points
    dragStartBrowserPosition = null;
  });

  // When the window closes, callback with our bounds
  browserWindow.on('close', function handleClose () {
    cb(null, bounds);
  });
}

// Export our function
module.exports = selectGeometry;
