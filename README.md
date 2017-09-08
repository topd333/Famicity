# front [![Build Status](https://magnum.travis-ci.com/famicity/front.svg?token=q96CoGGzRYWmazbkJW7z&branch=develop)](https://magnum.travis-ci.com/famicity/front) [![Code Climate](https://codeclimate.com/repos/55defae66956803a27013cf5/badges/6eb0df0ccfed4e8bda34/gpa.svg)](https://codeclimate.com/repos/55defae66956803a27013cf5/feed) [![Test Coverage](https://codeclimate.com/repos/55defae66956803a27013cf5/badges/6eb0df0ccfed4e8bda34/coverage.svg)](https://codeclimate.com/repos/55defae66956803a27013cf5/coverage)

Famicity front app.

## Install dependencies

`sudo npm install -g gulp`

`npm install`

## Build

### Using npm (preferred way):

`npm run build:nodev` builds the project with a development environment.

Options are the same as described below, and can be passed this way:

`npm run build:nodev -- --version 1.2.3 --no-img`

### Using gulp:

```shell
gulp build
  [--target target] environment where calls will be made [development (default), staging, production, or any name corresponding to a env file]
  [--version x] set application version (timestamp by default)
  [--bower] allow bower to perform version check request against repositories, which requires an internet connection (true by default)
  [--img] minimize images during build (true by default)
```

For example: `gulp build --version 1.2.3 --no-bower`

## Development

### Using npm:

`npm run build`

### Using gulp:

```shell
gulp
  [--target target] environment where calls will be made [development (default), staging, production, or any name corresponding to a env file]
  [--version x] set application version (timestamp by default)
  [--bower] allow bower to perform version check request against repositories, which requires an internet connection (true by default)
  [--weinre] add weinre (false by default)
  [--watch] watch files (true by default)
```

For example: `gulp --weinre --no-watch`

## Lint

`gulp eslint`, `gulp csshint`, `gulp htmlhint`

