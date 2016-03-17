// Load in our dependencies
var ipcRenderer = require('electron').ipcRenderer;
var Mousetrap = require('mousetrap');
var Unidragger = require('unidragger');

// Find our initial prompt and remove it after 7 seconds
var initialPromptEl = document.querySelector('.initial-prompt');
setTimeout(function removeInitialPrompt () {
  initialPromptEl.parentNode.removeChild(initialPromptEl);
}, 7000);

// Create a dragger for the body
var dragger = new Unidragger();
dragger.handles = [document.body];
dragger.bindHandles();
dragger.dragStart = function (evt, pointer) {
  document.body.classList.add('is-dragging');
  ipcRenderer.send('dragStart', {x: pointer.pageX, y: pointer.pageY});
};
dragger.dragMove = function (evt, pointer, moveVector) {
  ipcRenderer.send('dragMove', {x: pointer.pageX, y: pointer.pageY});
};
dragger.dragEnd = function (evt, pointer) {
  document.body.classList.remove('is-dragging');
  ipcRenderer.send('dragEnd', {x: pointer.pageX, y: pointer.pageY});
};

// Add enter listener so we can exit
Mousetrap.bind('enter', function handleEnter () {
  window.close();
});
