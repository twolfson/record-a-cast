// Load in our dependencies
var ipcRenderer = require('electron').ipcRenderer;
var Mousetrap = require('mousetrap');
var Unidragger = require('unidragger');

// Find our initial prompt and remove it after 7 seconds
var initialPromptEl = document.querySelector('.initial-prompt');
setTimeout(function removeInitialPrompt() {
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

// When arrow keys are pressed, move and resize our window
function moveBy(params) {
  ipcRenderer.send('moveBy', params);
}
function resizeBy(params) {
  ipcRenderer.send('resizeBy', params);
}
// Traversal
// DEV: These are aligned because they are relevant to each other
Mousetrap.bind('up',    moveBy.bind(null, {x:  0, y: -1}));
Mousetrap.bind('down',  moveBy.bind(null, {x:  0, y: +1}));
Mousetrap.bind('left',  moveBy.bind(null, {x: -1, y:  0}));
Mousetrap.bind('right', moveBy.bind(null, {x: +1, y:  0}));
Mousetrap.bind('shift+up',    moveBy.bind(null, {x:  0, y: -5}));
Mousetrap.bind('shift+down',  moveBy.bind(null, {x:  0, y: +5}));
Mousetrap.bind('shift+left',  moveBy.bind(null, {x: -5, y:  0}));
Mousetrap.bind('shift+right', moveBy.bind(null, {x: +5, y:  0}));

// Resize
// DEV: Our directions are inverse to CSS directions so + means increase in that direction, not decrease
Mousetrap.bind('alt+up',     resizeBy.bind(null, {bottom: -1}));
Mousetrap.bind('alt+down',   resizeBy.bind(null, {bottom: +1}));
Mousetrap.bind('alt+left',   resizeBy.bind(null, {right:  -1}));
Mousetrap.bind('alt+right',  resizeBy.bind(null, {right:  +1}));
Mousetrap.bind('ctrl+up',    resizeBy.bind(null, {top:    +1}));
Mousetrap.bind('ctrl+down',  resizeBy.bind(null, {top:    -1}));
Mousetrap.bind('ctrl+left',  resizeBy.bind(null, {left:   +1}));
Mousetrap.bind('ctrl+right', resizeBy.bind(null, {left:   -1}));
Mousetrap.bind('shift+alt+up',     resizeBy.bind(null, {bottom: -5}));
Mousetrap.bind('shift+alt+down',   resizeBy.bind(null, {bottom: +5}));
Mousetrap.bind('shift+alt+left',   resizeBy.bind(null, {right:  -5}));
Mousetrap.bind('shift+alt+right',  resizeBy.bind(null, {right:  +5}));
Mousetrap.bind('shift+ctrl+up',    resizeBy.bind(null, {top:    +5}));
Mousetrap.bind('shift+ctrl+down',  resizeBy.bind(null, {top:    -5}));
Mousetrap.bind('shift+ctrl+left',  resizeBy.bind(null, {left:   +5}));
Mousetrap.bind('shift+ctrl+right', resizeBy.bind(null, {left:   -5}));

// When enter is pressed, close our window
Mousetrap.bind('enter', function handleEnter() {
  window.close();
});
