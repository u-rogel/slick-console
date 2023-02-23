/* eslint-disable */
const path = require('path')

const DEFAULT_CONSOLE_COLOR = '\x1b[0m'
const DEFAULT_TIME_COLOR = '\x1b[34m'
const DEFAULT_POSITION_COLOR = '\x1b[35m'
const DEFAULT_LOG_COLOR = '\x1b[0m'
const DEFAULT_INFO_COLOR = '\x1b[36m'
const DEFAULT_WARN_COLOR = '\x1b[33m'
const DEFAULT_ERROR_COLOR = '\x1b[31m'
const DEFAULT_SUCCESS_COLOR = '\x1b[32m'

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
}

module.exports = ({
  depth: stackDepth = 1,
  logsColors = {},
} = {}) => {
  const {
    default: defaultColor = DEFAULT_CONSOLE_COLOR,
    time: timeColor = DEFAULT_TIME_COLOR,
    position: positionColor = DEFAULT_POSITION_COLOR,
    log: logColor = DEFAULT_LOG_COLOR,
    info: infoColor = DEFAULT_INFO_COLOR,
    warn: warnColor = DEFAULT_WARN_COLOR,
    error: errorColor = DEFAULT_ERROR_COLOR,
    success: successColor = DEFAULT_SUCCESS_COLOR,
  } = logsColors

  const getPosition = (myStack) => {
    return `${path.relative(process.cwd(), myStack.getFileName())}:${myStack.getLineNumber()}`
  }

  const getTime = () => new Date().toLocaleString()

  const getFile = (stackArr) => stackArr[stackDepth]

  ////////
  // attaching '__stack' to the global scope
  ////////
  Object.defineProperty(global, '__stack', {
    get: function () {
      const orig = Error.prepareStackTrace
      Error.prepareStackTrace = function (_, stack) { return stack }
      const err = new Error
      Error.captureStackTrace(err, arguments.callee)
      const { stack } = err
      Error.prepareStackTrace = orig
      return getFile(Array.from(stack))
    }
  })

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  }

  const printPos = (myPos) => {
    process.stdout.write(positionColor)
    process.stdout.write(`${myPos} `)
    process.stdout.write(defaultColor)
  }

  const printTime = (myTime) => {
    process.stdout.write(timeColor)
    process.stdout.write(`${myTime} `)
    process.stdout.write(defaultColor)
  }

  global.console.log = (...value) => {

    process.stdout.write(logColor)
    originalConsole.log(...value)
    process.stdout.write(defaultColor)
  }

  global.console.success = (...value) => {
    const myTime = getTime()
    const myPos = getPosition(__stack)
    printTime(myTime)
    printPos(myPos)
    process.stdout.write(successColor)
    originalConsole.log(...value)
    process.stdout.write(defaultColor)
  }

  global.console.warn = (...value) => {
    const myTime = getTime()
    const myPos = getPosition(__stack)
    printTime(myTime)
    printPos(myPos)
    process.stdout.write(warnColor)
    originalConsole.warn(...value)
    process.stdout.write(defaultColor)

  }

  global.console.error = (...value) => {
    const myTime = getTime()
    const myPos = getPosition(__stack)
    printTime(myTime)
    printPos(myPos)
    process.stdout.write(errorColor)
    originalConsole.error(...value)
    process.stdout.write(defaultColor)
  }

  global.console.info = (...value) => {
    const myTime = getTime()
    const myPos = getPosition(__stack)
    printTime(myTime)
    printPos(myPos)
    process.stdout.write(infoColor)
    originalConsole.log(...value)
    process.stdout.write(defaultColor)
  }
}
