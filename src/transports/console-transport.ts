import { BaseTransport, ILogTransport } from './base-transport'
import { LogEntry, LogLevel } from '../types'
import type { ILogFormatter } from '../formatters/base-formatter'

/**
 * 控制台传输器
 *
 * 将日志输出到浏览器/Node.js 控制台，根据日志等级选择对应方法：
 * - Verbose / Info → console.log()
 * - Warning → console.warn()
 * - Error → console.error()
 *
 * 使用示例：
 * ```typescript
 * const transport = new ConsoleTransport(new SimpleFormatter())
 * logger.addTransport(transport)
 * ```
 */
export class ConsoleTransport extends BaseTransport implements ILogTransport {
  constructor(formatter: ILogFormatter) {
    super(formatter)
  }

  log(entry: LogEntry): void {
    const formattedMessage = this.formatter.format(entry)

    switch (entry.level) {
      case LogLevel.Verbose:
      case LogLevel.Info:
        console.log(formattedMessage)
        break
      case LogLevel.Warning:
        console.warn(formattedMessage)
        break
      case LogLevel.Error:
        console.error(formattedMessage)
        break
      default:
        console.log(formattedMessage)
    }
  }
}
