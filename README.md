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

### Configuration

- The `config.json` file is the source for any configurations that can be made to the script

| Property                | Description                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `PROJECTS_DIR`          | String - The file path to use when writing new configuration updates. Important: DO NOT end this path with a `/`, this will break the script |
| `should_use_git`        | Boolean - whether or not the script should use git for version control                                                                       |
| `should_get_styles`     | Boolean - whether or not the script should pull the custom stylesheet for the page                                                           |
| `text_editor_shell_cmd` | String - the command to be used in the terminal to open a file in the text editor (i.e. `code <file name>`)                                  |

---
