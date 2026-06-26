import { LogLevel } from './log-level'

/**
 * 标准日志条目接口
 * 作为 Logger → Formatter → Transport 层间传递的数据载体
 */
export interface LogEntry {
  /** 日志创建时间戳 */
  timestamp: Date
  /** 日志等级 */
  level: LogLevel
  /** 日志消息内容（已序列化为字符串） */
  message: string
  /** 可选的附加元数据（如错误堆栈、请求 ID 等） */
  meta?: Record<string, unknown>
}
