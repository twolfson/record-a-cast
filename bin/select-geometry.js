// DEV: This file should be run via `npm run select-geometry`
// Load in our dependencies
var app = require('electron').app;
var selectGeometry = require('../lib/select-geometry');

// When all windows are closed, exit out
app.on('window-all-closed', function handleWindowsClosed() {
  app.quit();
});

// When Electron is done loading, launch our geometry selector
app.on('ready', function handleReady() {
  selectGeometry({
    heightDivisor: 2,
    widthDivisor: 2
  }, function handleSelectGeometry(err, geometry) {
    // If there was an error, throw it
    if (err) {
      throw err;
    }

    // Otherwise, log the geometry
    console.log('Selected geometry:', geometry);
  });
});
