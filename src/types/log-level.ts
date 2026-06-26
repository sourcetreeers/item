/**
 * 日志等级枚举
 * 按优先级从低到高排列：Verbose(0) < Info(1) < Warning(2) < Error(3)
 */
export enum LogLevel {
  Verbose = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

/**
 * 获取日志等级的字符串标识
 * @param level 日志等级
 * @returns 大写标识（如 'INFO', 'ERROR'）
 */
export function getLogLevelLabel(level: LogLevel): string {
  switch (level) {
    case LogLevel.Verbose:
      return 'VERBOSE'
    case LogLevel.Info:
      return 'INFO'
    case LogLevel.Warning:
      return 'WARNING'
    case LogLevel.Error:
      return 'ERROR'
    default:
      return 'UNKNOWN'
  }
}
