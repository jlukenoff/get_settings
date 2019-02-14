/**
 * Script to pull current RetailerSettings from track pages
 *
 * I: retailerMoniker
 * O: write a json file with RetailerSetting_<datestring>.json of current prod retailerSettings
 * C: Parsing retailerSetting from html string
 * E:
 *
 * Pseudo-code:
 *
 * get cli args
 * create directories
 *  create config directory
 *  create styles directory
 * if a config exists in dir
 *  mv config and rename to prev
 * make request for track page
 *  parse json and extract css_url if exists
 *  get css
 *    rename existing to prev
 *    write to styles directory
 *  write json config to file
 *  commit changes
 */

// Modules
const fs = require('fs');
const request = require('request');
const shell = require('shelljs');

// Config
const { projectsDir } = require('./config.json');

// create directories
const makeDirs = function() {
  //  create config directory
  //  create styles directory
  // if a config exists in dir
  //  mv config and rename to prev
};
// make request for track page
//  parse json and extract css_url if exists
//  get css
//    rename existing to prev
//    write to styles directory
//  write json config to file
//  commit changes
//

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
  request(url, function(err, res, body) {
    if (err) console.error(`Error fetching styles`);
    // write to file
    fs.writeFile(PATH_TO_STYLES);
  });
};

// declare domain - default prod
let domain = 'http://narvar.com/tracking';
let filePath = '/';

// check for non-prod environment
if (env && env.startsWith('q')) {
  domain = 'http://tracking-st01.narvar.com/tracking';
  filePath += 'qa/';
} else if (env && env.startsWith('s')) {
  domain = 'http://tracking-st01.narvar.com/tracking';
  filePath += 'staging/';
}

// check for extra params and nest in dirs
if (params) {
  //split list of params on &
  let paramList = params
    .split('&')
    // iterate through list, split each value on '=', add split[1] + '/' to filePath
    .forEach(p => (filePath += p.split('=')[1]) + '/');
}

// render path to new settings file

// if file is in a non-prod environemnt

// rename most recent to RetailerSetting-prev.json
shell.mv(
  `${projectsDir}/${moniker}${filePath}RetailerSetting-current.json`,
  `${projectsDir}/${moniker}${filePath}RetailerSetting-prev.json`
);

// nest file in directory by given environment
// name new file RetailerSetting-current.json
// write file

// TODO: nest file in directories based on any non-standard locales and/or attributes
// make dirs
const PATH_TO_FILE = `${projectsDir}/${moniker}${filePath}`;
const PATH_TO_STYLES =
  PATH_TO_FILE.slice(0, PATH_TO_FILE.indexOf('/config')) + '/styles';
// create directories
shell.mkdir('-p', PATH_TO_FILE);
// create styles directory
shell.mkdir('-p', PATH_TO_STYLES);

console.log('Getting retailerSettings...');

// get current track page
request(
  `${domain}/${moniker}/ups?tracking_numbers=test&locale=${locale || 'en_US'}${
    params ? '&' + params : ''
  }`,
  { encoding: null },
  function(err, res, body) {
    if (err) console.error(err);
    // extract retailerSetting from html string
    const json = getRetailerSettingsFromHtmlString(body.toString());

    let settings = {};
    // try to parse json
    try {
      // set settings to parsed json
      settings = JSON.parse(json);
    } catch (e) {
      // if json did not parse, end script
      console.error(`Error: json not found\nFull error: ${e}`);
    }
    // if css url exists, download and write to file
    if (settings.custom) {
      const cssUrl = settings.custom.css_url;
    }
    console.log('Writing File...');
    // write file
    fs.writeFile(PATH_TO_FILE, json, err => {
      if (err) console.error(err);
      console.log('Success:', path);
    });
  }
);
