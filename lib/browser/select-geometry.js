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

// When arrow keys are pressed
function moveBy(params) {
  ipcRenderer.send('moveBy', params);
}
function bindArrowMove(fn, prefix, value /* aka eigenvalue */) {
  Mousetrap.bind(prefix + 'up', function handleUp (evt) {
    fn({x: 0, y: -1 * value});
  });
  Mousetrap.bind('down', function handleUp () {
    fn({x: 0, y:  1 * value});
  });
  Mousetrap.bind('left', function handleUp () {
    fn({x: -1 * value, y: 0});
  });
  Mousetrap.bind('right', function handleUp () {
    fn({x:  1 * value, y: 0});
  });
}
bindArrowMove(moveBy, '', 1);
bindArrowMove(moveBy, 'shift+', 1);

// When enter is pressed, close our window
Mousetrap.bind('enter', function handleEnter () {
  window.close();
});
