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

// Define a rounding helper (e.g. `(1, 2) -> 2`, `(0, 2) -> 2`, `(3, 2) -> 4`
function roundToDivisor(val, divisor) {
  // Calculate the remainder (e.g. `3 % 2 === 1`)
  var remainder = val % divisor;

  // If the remainder is closer to the divisor, then add the remaining amount to our value
  // DEV: We use multiplication to avoid floating point issues
  if (remainder * 2 >= divisor) {
    return val - remainder + divisor;
  // Otherwise, return the value without our remainder
  } else {
    return val - remainder;
  }
}

// Define our function
function selectGeometry(mainParams, cb) {
  // Verify we received width divisor and height divisor
  assert(mainParams.widthDivisor && !isNaN(mainParams.widthDivisor));
  assert(mainParams.heightDivisor && !isNaN(mainParams.heightDivisor));

  // Create a new transparent window
  // TODO: Occupy full viewport like Shutter?
  var browserWindow = new BrowserWindow({
    frame: false,
    height: roundToDivisor(600, mainParams.heightDivisor),
    width: roundToDivisor(800, mainParams.widthDivisor),
    transparent: true
  });
  browserWindow.loadURL('file://' + __dirname + '/browser/select-geometry.html');

  // Save our window's current bounds
  // https://github.com/atom/electron/blob/v0.37.2/docs/api/browser-window.md#wingetbounds
  var bounds;
  function updateBounds() {
    bounds = browserWindow.getBounds();
    console.log(bounds);
  }
  updateBounds();

  // When our window is resized, update its bounds
  browserWindow.on('resize', function handleResize () {
    // Get the resized bounds
    // bounds = {x, y, width, height} = {x: 20, y: 30, width: 400, height: 500}
    // TODO: Add divisor handler here

    // Round the height/width to their nearest divisor
    updateBounds();
  });

  // When a window movement is requested
  function handleMoveBy(evt, params) {
    // Move our window by the requested amount
    // https://github.com/atom/electron/blob/v0.37.2/docs/api/browser-window.md#winsetpositionx-y-animate
    // params = {x: +1, y: -2}
    // currentPosition = [x, y] = [100, 200]
    var currentPosition = browserWindow.getPosition();
    browserWindow.setPosition(currentPosition[0] + params.x, currentPosition[1] + params.y);

    // Update our bounds
    updateBounds();
  }
  ipcMain.on('moveBy', handleMoveBy);

  // When a window resizing is requested
  function handleResizeBy(evt, params) {
    // Resize our window by the requested amount
    // https://github.com/atom/electron/blob/v0.37.2/docs/api/browser-window.md#winsetpositionx-y-animate
    // params = {top: +1, left: +2, right: +2, bottom: +3}
    // bounds = {x, y, width, height} = {x: 20, y: 30, width: 400, height: 500}
    var bounds = browserWindow.getBounds();
    // jscs:disable
    // DEV: Our directions are inverse to CSS directions so + means increase in that direction, not decrease
    var amt;
    if (params.top) { amt = roundToDivisor(params.top, mainParams.heightDivisor); bounds.y -= amt; bounds.height += amt; }
    if (params.bottom) { bounds.height += roundToDivisor(params.bottom, mainParams.heightDivisor); }
    if (params.left) { amt = roundToDivisor(params.left, mainParams.widthDivisor); bounds.x -= amt; bounds.width += amt; }
    if (params.right) { bounds.width += roundToDivisor(params.right, mainParams.widthDivisor); }
    browserWindow.setBounds(bounds);
    // jscs:enable

    // Update our bounds
    // DEV: We don't directly write as we could go outside of the desktop bounds
    //   but Electron autocorrects this :tada:
    updateBounds();
  }
  ipcMain.on('resizeBy', handleResizeBy);

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
    // https://github.com/atom/electron/blob/v0.37.2/docs/api/browser-window.md#winsetpositionx-y-animate
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
  browserWindow.on('closed', function handleClosed () {
    // Remove our IPC subscriptions
    ipcMain.removeListener('dragStart', handleDragStart);
    ipcMain.removeListener('dragMove', handleDragMove);
    ipcMain.removeListener('dragEnd', handleDragEnd);
    ipcMain.removeListener('moveBy', handleMoveBy);
    ipcMain.removeListener('resizeBy', handleResizeBy);

    // Callback with our bounds
    cb(null, bounds);
  });
}

// Export our function
module.exports = selectGeometry;
