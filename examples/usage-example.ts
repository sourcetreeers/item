/**
 * Logger 日志系统 - 完整使用示例
 *
 * 运行方式：
 * 1. npm install
 * 2. npm run build
 * 3. npm start
 */

import {
  Logger,
  LogLevel,
  ConsoleTransport,
  FileTransport,
  SimpleFormatter,
} from '../src/index'

// ==================== 示例 1：基本使用（仅控制台输出） ====================
console.log('===== 示例 1：基础控制台日志 =====')

const basicLogger = new Logger(LogLevel.Verbose)
basicLogger.addTransport(new ConsoleTransport(new SimpleFormatter()))

basicLogger.verbose('这是 verbose 级别日志（详细调试信息）')
basicLogger.info('应用已启动，版本 1.0.0')
basicLogger.warning('内存使用率超过 80%，请关注性能')
basicLogger.error('数据库连接失败', { errorCode: 'ECONNREFUSED', host: 'localhost:5432' })

// ==================== 示例 2：多 Transport 同时输出 ====================
console.log('\n===== 示例 2：控制台 + 文件同时输出 =====')

const multiLogger = new Logger(LogLevel.Info) // 仅记录 Info 及以上级别

// 添加控制台传输器（带时间戳）
multiLogger.addTransport(
  new ConsoleTransport(new SimpleFormatter({ includeTimestamp: true, includeMeta: true }))
)

// 添加文件传输器（写入 ./logs/app.log）
multiLogger.addTransport(
  new FileTransport(new SimpleFormatter(), './logs/app.log')
)

multiLogger.info('用户登录成功', { userId: 'user-123', ip: '192.168.1.100' })
multiLogger.verbose('这条消息不会出现（被等级过滤）') // 会被过滤
multiLogger.warning('API 响应时间过长', { endpoint: '/api/data', duration: 2500 })
multiLogger.error('支付处理失败', { transactionId: 'txn-456', amount: 99.99 })

// ==================== 示例 3：运行时动态调整 ====================
console.log('\n===== 示例 3：动态调整日志等级 =====')

const dynamicLogger = new Logger(LogLevel.Error)
dynamicLogger.addTransport(new ConsoleTransport(new SimpleFormatter()))

dynamicLogger.info('这条 Info 日志不会显示') // 被过滤
dynamicLogger.error('但这条 Error 会显示')

console.log('--- 将等级调整为 Verbose ---')
dynamicLogger.setMinLevel(LogLevel.Verbose)

dynamicLogger.info('现在 Info 级别也能显示了！')

// ==================== 示例 4：链式调用风格 ====================
console.log('\n===== 示例 4：链式配置 =====')

const chainedLogger = new Logger()
chainedLogger
  .addTransport(new ConsoleTransport(new SimpleFormatter()))
  .addTransport(new FileTransport(new SimpleFormatter(), './logs/debug.log'))

chainedLogger.info('通过链式调用创建的 Logger 实例')

// ==================== 示例 5：生产环境建议用法 ====================
console.log('\n===== 示例 5：环境感知的 Logger 工厂函数 =====')

function createProductionLogger(): Logger {
  const logger = new Logger(LogLevel.Info)

  // 生产环境：控制台 + 文件双写
  logger.addTransport(new ConsoleTransport(new SimpleFormatter()))
  logger.addTransport(new FileTransport(new SimpleFormatter(), './logs/production.log'))

  return logger
}

function createDevelopmentLogger(): Logger {
  const logger = new Logger(LogLevel.Verbose)

  // 开发环境：仅控制台，显示所有级别
  logger.addTransport(new ConsoleTransport(new SimpleFormatter()))

  return logger
}

// 根据环境变量选择
const isProduction = process.env.NODE_ENV === 'production'
const appLogger = isProduction ? createProductionLogger() : createDevelopmentLogger()

appLogger.info(`当前模式：${isProduction ? '生产' : '开发'}环境`)

// ==================== 总结 ====================
console.log('\n✅ 所有示例执行完毕！')
console.log('📁 文件传输器的模拟输出已显示在上方 [File IO] 标记行中')
