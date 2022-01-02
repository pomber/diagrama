#!/usr/bin/env node
"use strict";

const handler = require("serve-handler");
const http = require("http");
const path = require("path");

const chromeLaunch = require("chrome-launch");
const { argv } = require("yargs");

// Serve Diagrama website
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: path.resolve(__dirname, "dist"),
  });
});

server.listen(3333, () => {
  console.log("Running at http://localhost:3333");
});

const EXTENSION_PATH = path.resolve(__dirname, "chrome/build/unpacked");

const [START_URL = "http://localhost:3333/"] = argv._;
console.log(EXTENSION_PATH, START_URL);

chromeLaunch(START_URL, {
  args: [
    // Load the React DevTools extension
    `--load-extension=${EXTENSION_PATH}`,

    // Automatically open DevTools window
    // "--auto-open-devtools-for-tabs",

    // Remembers previous session settings (e.g. DevTools size/position)
    "--user-data-dir=./.tempUserDataDir",
  ],
});
