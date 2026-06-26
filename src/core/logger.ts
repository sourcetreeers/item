import { LogLevel, LogEntry } from '../types'
import { ILogTransport } from '../transports/base-transport'

/**
 * Logger 主类
 *
 * 提供统一的日志记录接口（verbose / info / warning / error）
 * 支持多 Transport 同时输出（如同时写控制台 + 文件）
 * 通过最小日志等级过滤低优先级消息
 *
 * 设计原则：
 * - 单一职责：Logger 仅负责组装 LogEntry 并分发至各 Transport
 * - 开放封闭：新增输出目标通过 addTransport() 扩展，无需修改源码
 * - 依赖注入：Transport 和 Formatter 均从外部注入，便于测试和替换
 *
 * 使用示例：
 * ```typescript
 * const logger = new Logger(LogLevel.Info)
 * logger.addTransport(new ConsoleTransport(new SimpleFormatter()))
 *
 * logger.info('Server started on port 3000')
 * logger.error('Database connection failed', { error: 'ECONNREFUSED' })
 * ```
 */
export class Logger {
  /** 最小日志等级阈值，低于此等级的日志将被忽略 */
  private minLevel: LogLevel

  /** 已注册的传输器列表 */
  private transports: ILogTransport[] = []

  /**
   * 创建 Logger 实例
   * @param minLevel 最小日志等级（默认输出所有级别）
   */
  constructor(minLevel: LogLevel = LogLevel.Verbose) {
    this.minLevel = minLevel
  }

  /**
   * 注册一个新的传输器
   * @param transport 实现 ILogTransport 接口的传输器实例
   * @returns this（支持链式调用）
   */
  addTransport(transport: ILogTransport): this {
    this.transports.push(transport)
    return this
  }

  /**
   * 移除已注册的传输器
   * @param transport 要移除的传输器实例
   * @returns this（支持链式调用）
   */
  removeTransport(transport: ILogTransport): this {
    const index = this.transports.indexOf(transport)
    if (index > -1) {
      this.transports.splice(index, 1)
    }
    return this
  }

  /**
   * 更新最小日志等级
   * @param level 新的最小等级
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level
  }

  /**
   * 获取当前最小日志等级
   */
  getMinLevel(): LogLevel {
    return this.minLevel
  }

  /**
   * 记录 VERBOSE 级别日志（最低优先级，用于详细调试信息）
   * @param message 日志消息内容（字符串或可序列化的数据）
   * @param meta 可选的附加元数据
   */
  verbose(message: string, meta?: Record<string, unknown>): void {
    this.dispatch(LogLevel.Verbose, message, meta)
  }

  /**
   * 记录 INFO 级别日志（常规信息，如启动/停止事件）
   * @param message 日志消息内容
   * @param meta 可选的附加元数据
   */
  info(message: string, meta?: Record<string, unknown>): void {
    this.dispatch(LogLevel.Info, message, meta)
  }

  /**
   * 记录 WARNING 级别日志（潜在问题，不影响运行但需关注）
   * @param message 日志消息内容
   * @param meta 可选的附加元数据
   */
  warning(message: string, meta?: Record<string, unknown>): void {
    this.dispatch(LogLevel.Warning, message, meta)
  }

  /**
   * 记录 ERROR 级别日志（错误信息，需要立即处理）
   * @param message 日志消息内容
   * @param meta 可选的附加元数据（建议包含 error 对象）
   */
  error(message: string, meta?: Record<string, unknown>): void {
    this.dispatch(LogLevel.Error, message, meta)
  }

  /**
   * 内部分发方法
   * 构建标准 LogEntry 并广播至所有注册的 Transport
   */
  protected dispatch(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    // 等级过滤：低于阈值的日志直接丢弃
    if (level < this.minLevel) return

    // 参数安全校验
    const safeMessage = typeof message === 'string' ? message : String(message)

    // 组装标准化日志条目
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message: safeMessage,
      ...(meta && { meta }),
    }

    // 分发至所有 Transport
    for (const transport of this.transports) {
      try {
        transport.log(entry)
      } catch (error) {
        // 防止单个 Transport 异常影响其他 Transport
        console.error(`[Logger] Transport failed to log:`, error)
      }
    }
  }
}
