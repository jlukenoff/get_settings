# Narvar Retailer Settings/Stylesheet script

### A command line NodeJS script that pulls current retailer configurations and stylesheets from live Narvar track pages, then writes to files locally, initializes a local git repo, and commits the changes with a timestamp.

## Related Projects

  <!-- - https://github.com/Vacationly/photos -->
  <!-- - https://github.com/Vacationly/reviews -->
  <!-- - https://github.com/Vacationly/listing-details -->

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Set up instructions](#SetupInstructions)

## Usage

The script accepts 4 arguments, only retailer_moniker is required: `get-settings <retailer_moniker> <environment> <locale> <parameters>`

- retailer_moniker (required): The retailer moniker that is used in the URL (i.e. `https://narvar.com/tracking/<retailer_moniker>`)
- environment (optional): The Narvar environment in which desired track page is hosted (i.e. prod, qa, staging) (default: prod)
- locale (optional): The ISO locale representation of the desired track page locale (i.e. en_GB, es_US, fr_CA) (default: en_US)
- parameters (optional): A string of additional parameters to append to the URL (i.e. category=women&preview=true&version=13.0&order=1234) (default: null)

## Requirements

- Node >= 6.13.0
- Git >= 2.0

## Set up Instructions

### From the root directory of the repo:

```
npm install
npm link
```

### Configure which path the script should write files to:

- Open the `config.json` file in the root directory of the repo.
- Change the `PROJECTS_DIR` value to the absolute path of the folder where you would like the files to be written - Important: DO NOT end this path with a slash (`/`), this will break the script
- Change any other configurations at this time like whether the script should use git and whether it should pull the custom stylesheet each time (`should_use_git` and `should_get_styles`)
- Save and Exit
