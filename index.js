/**
 * Script to pull current RetailerSettings from track pages
 *
 * I: retailerMoniker
 * O: write a json file with RetailerSetting_<datestring>.json of current prod retailerSettings
 * C: Parsing retailerSetting from html string
 * E:
 */

// Modules
const fs = require('fs');
const request = require('request');
const shell = require('shelljs');

// get cli args
const [moniker, env] = process.argv.slice(2);

// function to extract retailerSetting from html string
const getRetailerSettingsFromHtmlString = function(string) {
  const startIdx = string.indexOf('var retailerSetting =') + 21;
  const endIdx =
    string.indexOf('var shipmentCookie =') < 0
      ? string.indexOf('var locale =')
      : string.indexOf('var shipmentCookie =');
  return string
    .slice(startIdx, endIdx)
    .trim()
    .slice(0, -1);
};

// render path to new settings file
const path = `/Users/johnlukenoff/Desktop/Projects/${moniker}/config/RetailerSetting_${new Date()
  .toUTCString()
  .replace(/\s/g, '')
  .slice(0, -1)}.json`;

// make dirs
shell.mkdir('-p', `/Users/johnlukenoff/Desktop/Projects/${moniker}/config`);

console.log('Getting retailerSettings...');

// TODO: accept environment input but default to prod
// get current track page
request(
  `http://narvar.com/tracking/${moniker}/ups?trackingnumbers=test`,
  { encoding: null },
  function(err, res, body) {
    if (err) console.error(err);
    // extract retailerSetting from html string
    const json = getRetailerSettingsFromHtmlString(body.toString());
    console.log('Writing File...');
    // write file
    fs.writeFile(path, json, err => {
      if (err) console.error(err);
      console.log('Success:', path);
    });
  }
);
