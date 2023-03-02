# Install

```
# npm
npm i @u-rogel/slick-console

# yarn
yarn add @u-rogel/slick-console
```

# Usage

At your root file require and call it

```js
// ./src/index.js
require('@u-rogel/slick-console')()

console.log('test log')

// 3/2/2023 2:00:00 PM src/index.js:3:9
```

# Configs

| prop | type | default | description |
| - | - | - | - |
| relativeDepth | number | `1` | Call stack depth. If used inside logger utils increase to see where the logger function was called
| consoleColors | object | `{}` | The default console colors |

`consoleColors` accepts those optional props:
default, time, position, log, info, warn, error, success.
Each one is a string of node.js console color. Look on the default bellow for example.

By default the colors will be:
```js
const DEFAULT_CONSOLE = '\x1b[0m' // reset
const DEFAULT_TIME = '\x1b[34m' // blue
const DEFAULT_POSITION = '\x1b[35m' // magenta
const DEFAULT_LOG = '\x1b[0m' // reset
const DEFAULT_INFO = '\x1b[36m' // cyan
const DEFAULT_WARN = '\x1b[33m' // yellow
const DEFAULT_ERROR = '\x1b[31m' // red
const DEFAULT_SUCCESS = '\x1b[32m' // green
```

Check [this gist](https://gist.github.com/abritinthebay/d80eb99b2726c83feb0d97eab95206c4) for more console codes

# Road Map

1. Log level printed out
2. Config what part of the enhancers you would like to see
3. Return a console instance that will not override the global console
4. Allow configuration change for single log call