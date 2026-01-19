#!/bin/bash
echo "Installing Chrome dependencies for Render deployment..."

# Install Chrome dependencies
apt-get update
apt-get install -y wget gnupg

# Add Google Chrome repository
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list

# Update package list and install Chrome
apt-get update
apt-get install -y google-chrome-stable

# Set environment variable
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

echo "Chrome installation complete!"
echo "Chrome location: $(which google-chrome)"

# Install npm dependencies with Puppeteer skip
npm install
