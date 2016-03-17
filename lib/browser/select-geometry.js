// Load in our dependencies
var ipcRenderer = require('electron').ipcRenderer;
var Mousetrap = require('mousetrap');
var Unidragger = require('unidragger');

// In 500ms, emulate some drag actions
setTimeout(function emulateDragStart () {
  ipcRenderer.send('dragStart', {x: 20, y: 30});
}, 500);
setTimeout(function emulateDragMove () {
  ipcRenderer.send('dragMove', {x: 40, y: 50});
}, 600);
setTimeout(function emulateDragMove () {
  ipcRenderer.send('dragMove', {x: 40, y: 50});
}, 700);
setTimeout(function closeWindow () {
  window.close();
});

// Add enter listener so we can exit
Mousetrap.bind('enter', function handleEnter () {
  window.close();
});
