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
const [moniker, env, locale, params] = process.argv.slice(2);

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

const getStyles = function(url) {
  // request css from url
  // write to file
};

const getDomain = function(env) {
  const domains = [
    'http://narvar.com/tracking',
    'http://tracking-qa01.narvar.qa/tracking',
    'http://tracking-st01.narvar.qa/tracking',
  ];

  if (!env || env.startsWith('prod')) {
    return domains[0];
  } else if (env === 'qa') {
    return domains[1];
  } else if (env.startsWith('stag')) {
    return domains[2];
  }
};

const date = new Date();
date.setHours(date.getHours() - 8);

// render path to new settings file
const path = `/Users/johnlukenoff/Desktop/Projects/${moniker}/config/RetailerSetting_${date
  .toUTCString()
  .replace(/[\s,]/g, '')
  .slice(0, -1)}${!env || env.startsWith('prod') ? '' : '-' + env}.json`;

// TODO: nest file in directories based on any non-standard locales and or attributes
// make dirs
shell.mkdir('-p', `/Users/johnlukenoff/Desktop/Projects/${moniker}/config`);

console.log('Getting retailerSettings...');

// get current track page
request(
  `${getDomain(env)}/${moniker}/ups?trackingnumbers=test&locale=${locale ||
    'en_US'}${params ? '&' + params : ''}`,
  { encoding: null },
  function(err, res, body) {
    if (err) console.error(err);
    // extract retailerSetting from html string
    const json = getRetailerSettingsFromHtmlString(body.toString());
    // TODO: add try/catch in case json did not exist in html string, handle failure response in catch
    const settings = JSON.parse(json);
    if (settings.custom) {
      const cssUrl = settings.custom.css_url;
      console.log('cssUrl:', cssUrl);
    }
    console.log('Writing File...');
    // write file
    fs.writeFile(path, json, err => {
      if (err) console.error(err);
      console.log('Success:', path);
    });
  }
);
