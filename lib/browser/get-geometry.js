// Load in our dependencies
var Mousetrap = require('mousetrap');

// Add enter listener so we can exit
Mousetrap.bind('enter', function handleEnter () {
  window.close();
});
