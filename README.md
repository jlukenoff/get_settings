# Narvar Retailer Settings/Stylesheet script

### A command line NodeJS script that pulls current retailer configurations and stylesheets from live Narvar track pages, then writes to files locally, initialized a local git repo, and commits the changes with a timestamp.

## Related Projects

  <!-- - https://github.com/Vacationly/photos -->
  <!-- - https://github.com/Vacationly/reviews -->
  <!-- - https://github.com/Vacationly/listing-details -->

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Set up instructions](#SetupInstructions)

## Usage

The script accepts 4 arguments, only retailer_moniker is required: `get_settings <retailer_moniker> <environment> <locale> <parameters>`

- retailer_moniker (required): The retailer moniker that is used in the URL (i.e. https://narvar.com/tracking/<retailer_moniker>)
- environment (optional): The Narvar environment in which the track page is hosted (i.e. 'prod', 'qa', 'staging') (default: 'prod')
- locale (optional): The ISO locale representation of the desired track page locale (i.e. en_GB, es_US, fr_CA) (default: 'en_US')
- parameters (optional): A string of additional parameters to append to the URL (i.e. 'category=womens&preview=true&version=13.0&order=1234') (default: null)

## Requirements

- Node >= 6.13.0
- Git >= 2.0

## Set up Instructions

### From the root directory:

```
npm install
```

### Now you will need to configure which path the script should use to write files to:

- Open the `config.json` file in the root directory of the repo.
- Change the `PROJECTS_DIR` value to the absolute path of the folder where you would like the files to be written
- Save and Exit

### This is not a necessary step but I recommend adding this alias to your .bash_aliases for ease of use, this can be done from the terminal like so:

- ```sh
   nano ~/.bash_aliases
  ```

* Paste: `alias get_settings="node <path_to_script>"` replacing <path_to_script> with the absolute path to the directory of the script. (i.e. `/Users/username/scripts/get_settings`)

* Then, save and exit by pressing Control+X then Enter
