import type { CallSite } from "callsite"

const path = require('path')
const util = require('util')

const DEFAULT_CONSOLE_COLOR = '\x1b[0m' // reset
const DEFAULT_TIME_COLOR = '\x1b[34m' // blue
const DEFAULT_POSITION_COLOR = '\x1b[35m' // magenta
const DEFAULT_LOG_COLOR = '\x1b[0m' // reset
const DEFAULT_INFO_COLOR = '\x1b[36m' // cyan
const DEFAULT_WARN_COLOR = '\x1b[33m' // yellow
const DEFAULT_ERROR_COLOR = '\x1b[31m' // red
const DEFAULT_SUCCESS_COLOR = '\x1b[32m' // green

const SLICK_CONSOLE_CALL_STACK_OWN_DEPTH = 2

declare global {
  interface Console {
    success: (...args: any[]) => void
  }
}

type stdType = 'stderr' | 'stdout'

interface IGenerateConsoleLine {
  color: string
  content: any[]
  stdType?: stdType
}

interface IPaintPrintReset {
  color: string
  content: string
  stdType: stdType
}

export interface IConsoleColors {
  default: string
  time: string
  position: string
  log: string
  info: string
  warn: string
  error: string
  success: string
}

export interface ISuperLogConfigs {
  relativeDepth?: number
  consoleColors?: Partial<IConsoleColors>
}

module.exports = ({
  relativeDepth = 1,
  consoleColors = {},
}: ISuperLogConfigs = {}): void => {
  const requestedCallStackDepthIndex = SLICK_CONSOLE_CALL_STACK_OWN_DEPTH + relativeDepth
  const requestedCallStackDepth = requestedCallStackDepthIndex + 1
  const {
    default: defaultColor = DEFAULT_CONSOLE_COLOR,
    time: timeColor = DEFAULT_TIME_COLOR,
    position: positionColor = DEFAULT_POSITION_COLOR,
    log: logColor = DEFAULT_LOG_COLOR,
    info: infoColor = DEFAULT_INFO_COLOR,
    warn: warnColor = DEFAULT_WARN_COLOR,
    error: errorColor = DEFAULT_ERROR_COLOR,
    success: successColor = DEFAULT_SUCCESS_COLOR,
  } = consoleColors

  const getPosition = (myStack: CallSite[]) => {
    const fileFromStack = myStack[requestedCallStackDepthIndex]
    const absoluteProgramPath = process.cwd()
    const absoluteFilePath = fileFromStack.getFileName()
    const relativeFilePath = path.relative(absoluteProgramPath, absoluteFilePath)
    const lineNumber = fileFromStack.getLineNumber()
    const columnNumber = fileFromStack.getColumnNumber()
    return `${relativeFilePath}:${lineNumber}:${columnNumber}`
  }

  const getTime = () => new Date().toLocaleString()

  const errStack = (): CallSite[] => {
    const origStackTraceLimit = Error.stackTraceLimit
    const origPrepareStackTrace = Error.prepareStackTrace
    Error.stackTraceLimit = requestedCallStackDepth
    Error.prepareStackTrace = (err, stack) => stack
    const err = new Error()
    Error.captureStackTrace(err, errStack)
    const { stack } = err
    Error.stackTraceLimit = origStackTraceLimit
    Error.prepareStackTrace = origPrepareStackTrace
    return stack as unknown as CallSite[]
  }

  const paintPrintReset = ({ color, content, stdType }: IPaintPrintReset) => {
    process[stdType].write(color)
    process[stdType].write(content)
    process[stdType].write(defaultColor)
  }

  const printPos = (myPos: string, stdType: stdType) => {
    paintPrintReset({ color: positionColor, content: `${myPos} `, stdType })
  }

  const printTime = (myTime: string, stdType: stdType) => {
    paintPrintReset({ color: timeColor, content: `${myTime} `, stdType })
  }

  const printInfo = (stdType: stdType) => {
    printTime(getTime(), stdType)
    printPos(getPosition(errStack()), stdType)
  }

  const generateConsoleLine = ({ color, content, stdType = 'stdout' }: IGenerateConsoleLine) => {
    printInfo(stdType)
    paintPrintReset({
      color,
      content: util.format(...content) + '\n',
      stdType,
    })
  }

  global.console.log = (...value) => {
    generateConsoleLine({
      color: logColor,
      content: value
    })
  }

  global.console.info = (...value) => {
    generateConsoleLine({
      color: infoColor,
      content: value
    })
  }

  global.console.success = (...value) => {
    generateConsoleLine({
      color: successColor,
      content: value
    })
  }

  global.console.warn = (...value) => {
    generateConsoleLine({
      color: warnColor,
      content: value,
      stdType: 'stderr'
    })
  }

  global.console.error = (...value) => {
    generateConsoleLine({
      color: errorColor,
      content: value,
      stdType: 'stderr'
    })
  }
}
