import { BaseTransport, ILogTransport } from './base-transport'
import { LogEntry } from '../types'
import type { ILogFormatter } from '../formatters/base-formatter'

/**
 * 模拟原生文件同步写入函数
 *
 * 真实场景下应替换为 Node.js 的 fs.writeFileSync 或浏览器 File System Access API
 * 此处使用 console.log 模拟以演示架构设计
 *
 * @param filePath 目标文件路径
 * @param buffer 要写入的内容（字符串或 Buffer）
 */
function NativeFileWriteSync(filePath: string, buffer: string | Buffer): void {
  console.log(`[File IO ${filePath}] ${buffer}`)
}

/**
 * 文件传输器
 *
 * 将日志写入本地文件系统（当前为模拟实现）
 * 支持追加模式（append），每次调用 log() 都会向文件末尾添加新内容
 *
 * 使用示例：
 * ```typescript
 * const fileTransport = new FileTransport(
 *   new SimpleFormatter(),
 *   './logs/app.log'  // 文件路径
 * )
 * logger.addTransport(fileTransport)
 * ```
 *
 * 未来真实集成时：
 * 1. 替换 NativeFileWriteSync 为 require('fs').writeFileSync
 * 2. 或引入异步版本 fs.promises.appendFile 以提升性能
 */
export class FileTransport extends BaseTransport implements ILogTransport {
  private readonly filePath: string

  /**
   * @param formatter 日志格式化器
   * @param filePath 目标日志文件路径（如 './logs/app.log'）
   */
  constructor(formatter: ILogFormatter, filePath: string) {
    super(formatter)
    this.filePath = filePath
  }

  log(entry: LogEntry): void {
    const formattedMessage = this.formatter.format(entry)
    const lineWithNewline = formattedMessage + '\n'

    try {
      NativeFileWriteSync(this.filePath, lineWithNewline)
    } catch (error) {
      // 文件写入失败时降级到控制台输出，避免丢失日志
      console.error(`[FileTransport] Failed to write to ${this.filePath}:`, error)
      console.error(formattedMessage)
    }
  }

  /**
   * 获取当前配置的目标文件路径
   */
  getFilePath(): string {
    return this.filePath
  }
}
