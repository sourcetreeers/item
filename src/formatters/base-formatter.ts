import { LogEntry } from '../types'

/**
 * 日志格式化器接口
 * 负责将 LogEntry 对象转换为可输出的字符串
 * 可通过实现此接口来支持不同的日志格式（如 JSON、纯文本等）
 */
export interface ILogFormatter {
  /**
   * 格式化日志条目
   * @param entry 标准日志条目
   * @returns 格式化后的字符串
   */
  format(entry: LogEntry): string
}

/**
 * 抽象格式化器基类
 * 提供时间戳格式化等通用方法供子类复用
 */
export abstract class BaseFormatter implements ILogFormatter {
  abstract format(entry: LogEntry): string

  /**
   * 格式化时间为 ISO 字符串
   */
  protected formatTimestamp(date: Date): string {
    return date.toISOString()
  }

  /**
   * 安全序列化元数据对象
   */
  protected serializeMeta(meta?: Record<string, unknown>): string {
    if (!meta) return ''
    try {
      return ` ${JSON.stringify(meta)}`
    } catch {
      return ' [Unable to serialize meta]'
    }
  }
}
