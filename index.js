#!/usr/bin/env node

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
 *  write json config to file
 *  get css
 *    rename existing to prev
 *    write to styles directory
 *  commit changes
 */

// Modules
const fs = require('fs');
const request = require('request');
const shell = require('shelljs');

// Config
const {
  PROJECTS_DIR,
  should_use_git: shouldUseGit,
  should_get_styles: shouldGetStyles,
} = require('./config.json');

// Get CLI Args
const [moniker, env, locale, params] = process.argv.slice(2);

if (!moniker) {
  console.error(`Error: please pass a valid retailerMoniker`);
  process.exit(1);
}

// Render Paths
const RETAILER_DIR = `${PROJECTS_DIR}/${moniker}`;

const SUB_DIR =
  !env || env.startsWith('p') ? '' : env.startsWith('q') ? '/qa' : '/staging';

const CONFIG_DIR = `${RETAILER_DIR}/config${SUB_DIR}`;
const STYLES_DIR = `${RETAILER_DIR}/styles${SUB_DIR}`;

console.log('Making Directories...');

// make directories
shell.mkdir('-p', CONFIG_DIR);

const renderFiles = function(json, done) {
  // mv config and rename to prev
  shell.mv(
    `${CONFIG_DIR}/RetailerSettings-current${
      locale && locale !== 'en_US' ? '_' + locale : ''
    }${params ? '-' + params : ''}.json`,
    `${CONFIG_DIR}/RetailerSettings-prev${locale ? '_' + locale : ''}${
      params ? '-' + params : ''
    }.json`
  );

  // write JSON to file
  fs.writeFile(
    `${CONFIG_DIR}/RetailerSettings-current${locale ? '_' + locale : ''}${
      params ? '-' + params : ''
    }.json`,
    json,
    done
  );
};

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

const getStyles = function(url, done) {
  if (shouldGetStyles) {
    console.log('Getting Styles...');

    shell.mkdir('-p', STYLES_DIR);

    // mv existing styles and rename to prev
    shell.mv(
      `${STYLES_DIR}/styles-current${params ? '-' + params : ''}.css`,
      `${STYLES_DIR}/styles-prev${params ? '-' + params : ''}.css`
    );

    // request css from url
    request(url, function(err, res, body) {
      if (err) console.error(`Error fetching styles`);
      // write to file
      fs.writeFile(
        `${STYLES_DIR}/styles-current${params ? '-' + params : ''}.css`,
        body.toString(),
        done
      );
    });
  }
};

const pullSettings = function(done) {
  // declare domain - default prod
  let domain =
    !env || env.startsWith('p')
      ? 'http://narvar.com/tracking'
      : env.startsWith('q')
      ? 'http://tracking-qa01.narvar.qa/tracking'
      : 'http://tracking-st01.narvar.qa/tracking';

  console.log(
    'Getting track page...',
    `${domain}/${moniker}/ups?tracking_numbers=test&locale=${locale ||
      'en_US'}${params ? '&' + params : ''}`
  );
  request(
    `${domain}/${moniker}/ups?tracking_numbers=test&locale=${locale ||
      'en_US'}${params ? '&' + params : ''}`,
    { encoding: null },
    function(err, res, body) {
      if (err) console.error(err);
      // extract retailerSetting from html string
      const json = getRetailerSettingsFromHtmlString(body.toString());
      // declare variable to store config object
      let settings = {};
      // try to parse json
      try {
        // set settings to parsed json
        settings = JSON.parse(json);
      } catch (e) {
        // if json did not parse, end script
        console.error(`Error: invalid json: ${e}`);
        process.exit(1);
      }
      console.log('Writing File...');
      renderFiles(JSON.stringify(settings, null, 2), function(err) {
        // if css url exists, download and write to file
        if (settings.custom && settings.custom.css_url) {
          const cssUrl = settings.custom.css_url;
          getStyles(cssUrl, done);
        } else {
          done(null);
        }
      });
    }
  );
};

const commitChanges = function(err) {
  if (err) console.error('Error writing files:', err);
  if (shouldUseGit) {
    shell.cd(RETAILER_DIR);
    const isInitialized = shell.exec('git status');
    if (isInitialized.code !== 0) {
      shell.exec('git init');
      fs.writeFile(`${RETAILER_DIR}/.gitignore`, '.*', err => {
        if (err) console.error(`Error intializing git repo`);
        shell.exec('git add *');
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() - 8);
        shell.exec(
          `git commit -m "Updated settings: ${currentTime
            .toUTCString()
            .replace(' GMT', '')}"`
        );
      });
    } else {
      shell.exec('git add *');
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() - 8);
      shell.exec(
        `git commit -m "Updated settings: ${currentTime
          .toUTCString()
          .replace(' GMT', '')}"`
      );
    }
  }

  console.log(
    'Success:',
    `${CONFIG_DIR}/RetailerSettings-current${locale ? '_' + locale : ''}${
      params ? '-' + params : ''
    }.json`
  );
};

pullSettings(commitChanges);
