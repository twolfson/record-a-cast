#!/usr/bin/env node
// Load in our dependencies
var path = require('path');
var spawn = require('child_process').spawn;
var electronPath = require('electron-prebuilt');

// Find our application
var mockdeskPath = path.join(__dirname, '..');
var args = [mockdeskPath];

// Append all arguments after our node invocation
// e.g. `node bin/mockdesk.js --version` -> `--version`
args = args.concat(process.argv.slice(2));

// Run electron on our application and forward all stdio
spawn(electronPath, args, {stdio: [0, 1, 2]});
