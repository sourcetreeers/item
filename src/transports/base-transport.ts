import { LogEntry } from '../types'
import type { ILogFormatter } from '../formatters/base-formatter'

/**
 * 日志传输器接口
 * 定义输出目标的抽象契约，所有 Transport 必须实现此接口
 *
 * 扩展方式：实现 ILogTransport 接口即可新增输出目标
 * - ConsoleTransport → 输出到控制台
 * - FileTransport → 写入本地文件
 * - HttpTransport → 发送到远程服务器（未来扩展）
 * - DatabaseTransport → 写入数据库（未来扩展）
 */
export interface ILogTransport {
  /**
   * 将日志条目写入目标
   * @param entry 已格式化的标准日志条目
   */
  log(entry: LogEntry): void

  /**
   * 设置/更新传输器的格式化器
   * @param formatter 新的格式化器实例
   */
  setFormatter(formatter: ILogFormatter): void

  /**
   * 获取当前使用的格式化器
   */
  getFormatter(): ILogFormatter
}

/**
 * 抽象传输器基类
 * 提供格式化器管理和通用逻辑的默认实现
 */
export abstract class BaseTransport implements ILogTransport {
  protected formatter: ILogFormatter

  constructor(formatter: ILogFormatter) {
    this.formatter = formatter
  }

  abstract log(entry: LogEntry): void

  setFormatter(formatter: ILogFormatter): void {
    this.formatter = formatter
  }

  getFormatter(): ILogFormatter {
    return this.formatter
  }
}
