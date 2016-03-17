// Load in our dependencies
var ipcRenderer = require('electron').ipcRenderer;
var Mousetrap = require('mousetrap');
var Unidragger = require('unidragger');

// Create a dragger for the body
var dragger = new Unidragger();
dragger.handles = [document.body];
dragger.bindHandles();
dragger.dragStart = function (evt, pointer) {
  ipcRenderer.send('dragStart');
};
dragger.dragMove = function (evt, pointer, moveVector) {
  ipcRenderer.send('dragMove', moveVector);
};
dragger.dragEnd = function (evt, pointer) {
  ipcRenderer.send('dragEnd');
};

// Add enter listener so we can exit
Mousetrap.bind('enter', function handleEnter () {
  window.close();
});
