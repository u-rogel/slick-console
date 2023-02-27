const path = require('path')
const util = require('util')

const DEFAULT_CONSOLE_COLOR = '\x1b[0m'
const DEFAULT_TIME_COLOR = '\x1b[34m'
const DEFAULT_POSITION_COLOR = '\x1b[35m'
const DEFAULT_LOG_COLOR = '\x1b[0m'
const DEFAULT_INFO_COLOR = '\x1b[36m'
const DEFAULT_WARN_COLOR = '\x1b[33m'
const DEFAULT_ERROR_COLOR = '\x1b[31m'
const DEFAULT_SUCCESS_COLOR = '\x1b[32m'

declare global {
  interface Console {
    success: (...data: any[]) => void
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

type TStack = any

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
  logsColors?: Partial<IConsoleColors>
}

module.exports = ({
  relativeDepth: stackDepth = 1,
  logsColors = {},
}: ISuperLogConfigs = {}): void => {
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

  const getFile = (stackArr: TStack[]) => stackArr[2 + stackDepth]

  const getPosition = (myStack: TStack) => {
    const fileStack = getFile(myStack)
    return `${path.relative(process.cwd(), fileStack.getFileName())}:${fileStack.getLineNumber()}`
  }

  const getTime = () => new Date().toLocaleString()

  const errStack = () => {
    const orig = Error.prepareStackTrace
    Error.prepareStackTrace = function (_, stack) { return stack }
    const err = new Error()
    Error.captureStackTrace(err, errStack)
    const { stack } = err
    Error.prepareStackTrace = orig
    return stack as any
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

  console.log = (...value) => {
    generateConsoleLine({
      color: logColor,
      content: value
    })
  }

  console.info = (...value) => {
    generateConsoleLine({
      color: infoColor,
      content: value
    })
  }

  console.success = (...value) => {
    generateConsoleLine({
      color: successColor,
      content: value
    })
  }

  console.warn = (...value) => {
    generateConsoleLine({
      color: warnColor,
      content: value,
      stdType: 'stderr'
    })
  }

  console.error = (...value) => {
    generateConsoleLine({
      color: errorColor,
      content: value,
      stdType: 'stderr'
    })
  }
}
