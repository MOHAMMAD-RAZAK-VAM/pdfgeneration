const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Skip downloading Chrome during npm install
  skipDownload: true,
  
  // Tell Puppeteer where to find Chrome on Render
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
}
