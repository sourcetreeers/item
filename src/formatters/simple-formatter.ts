import { BaseFormatter, ILogFormatter } from './base-formatter'
import { LogEntry } from '../types'
import { getLogLevelLabel } from '../types'

/**
 * 简单文本格式化器
 *
 * 输出格式：[YYYY-MM-DDTHH:mm:ss.sssZ][LEVEL] message {meta}
 *
 * 示例：
 * [2024-06-25T14:30:00.000Z][INFO] Application started {"version":"1.0.0"}
 */
export class SimpleFormatter extends BaseFormatter implements ILogFormatter {
  /**
   * 配置选项
   */
  private readonly options: {
    includeTimestamp: boolean
    includeMeta: boolean
  }

  constructor(options?: { includeTimestamp?: boolean; includeMeta?: boolean }) {
    super()
    this.options = {
      includeTimestamp: options?.includeTimestamp ?? true,
      includeMeta: options?.includeMeta ?? true,
    }
  }

  format(entry: LogEntry): string {
    const parts: string[] = []

    // 时间戳前缀
    if (this.options.includeTimestamp) {
      parts.push(`[${this.formatTimestamp(entry.timestamp)}]`)
    }

    // 日志等级标识
    parts.push(`[${getLogLevelLabel(entry.level)}]`)

    // 消息内容
    parts.push(entry.message)

    // 元数据
    if (this.options.includeMeta && entry.meta) {
      parts.push(this.serializeMeta(entry.meta))
    }

    return parts.join(' ')
  }
}
