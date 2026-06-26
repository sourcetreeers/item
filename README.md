# TypeScript Logger 日志系统

> 一套为 TypeScript Web 应用设计的模块化日志系统  
> 支持 **四种日志等级** | **多目标输出** | **可扩展架构** | **零第三方依赖**

---

## 📋 目录

- [功能特性](#-功能特性)
- [设计理念](#-设计理念)
- [快速开始](#-快速开始)
- [架构说明](#-架构说明)
- [API 文档](#-api-文档)
- [使用示例](#-使用示例)
- [未来扩展指南](#-未来扩展指南)
- [项目结构](#-项目结构)

---

## ✨ 功能特性

### 核心能力

- ✅ **四档日志等级**：`verbose` / `info` / `warning` / `error`
- ✅ **统一接口**：一致的 API 设计（`logger.info(msg, meta?)`）
- ✅ **多目标输出**：支持同时写控制台 + 文件（可扩展至更多目标）
- ✅ **等级过滤**：运行时可动态调整最小日志阈值
- ✅ **格式化层解耦**：可插拔的 Formatter，支持自定义输出格式
- ✅ **类型安全**：完整的 TypeScript 类型定义（strict mode 编译）
- ✅ **零依赖**：不依赖任何第三方库，纯原生实现

---

## 💡 设计理念

### 1. 三层分离架构（Separation of Concerns）

```
┌─────────────────────────────────────┐
│            Logger (入口层)           │
│  对外提供 verbose/info/warn/error   │
│  组装 LogEntry 并分发               │
└──────────────┬──────────────────────┘
               │ 分发 LogEntry
               ▼
┌─────────────────────────────────────┐
│        Formatter (格式化层)          │
│  将 LogEntry → 可读字符串           │
│  支持自定义格式（JSON/文本等）       │
└──────────────┬──────────────────────┘
               │ 格式化后的字符串
               ▼
┌─────────────────────────────────────┐
│        Transport (传输层)            │
│  抽象输出目标接口                    │
│  Console / File / HTTP / DB ...     │
└─────────────────────────────────────┘
```

**优势：**
- **Logger** 只负责"组装+分发"，不关心"如何格式化"
- **Formatter** 只关心"怎么展示"，不关心"输出到哪里"
- **Transport** 只关心"写到哪去"，不关心"数据来源"

### 2. Strategy 策略模式（Transport）

每个 `Transport` 是一个独立的策略实现：
```typescript
interface ILogTransport {
  log(entry: LogEntry): void  // 统一的写入契约
}
```

新增输出目标？只需实现此接口并 `addTransport()` 即可。

### 3. 依赖注入（Dependency Injection）

`Transport` 和 `Formatter` 均从外部注入到 `Logger`，而非内部硬编码创建：
```typescript
// ✅ 推荐：注入依赖，便于测试和替换
const transport = new ConsoleTransport(myCustomFormatter)
logger.addTransport(transport)
```

这带来两个好处：
- **可测试性**：单元测试时注入 MockTransport，无需真实 IO
- **灵活性**：运行时动态替换 Formatter/Transport

### 4. 开放封闭原则（OCP）

- **对扩展开放**：新增 Transport/Formatter 无需修改现有代码
- **对修改封闭**：核心 Logger 类在添加新功能时保持稳定

---

## 🚀 快速开始

### 安装与编译

```bash
# 安装 TypeScript（开发依赖）
npm install

# 编译 TypeScript → JavaScript
npm run build

# 运行示例
npm start
```

### 最简示例

```typescript
import { Logger, ConsoleTransport, SimpleFormatter } from './src'

const logger = new Logger()
logger.addTransport(new ConsoleTransport(new SimpleFormatter()))

logger.info('Hello, Logger! 🎉')
```

**输出：**
```
[INFO] Hello, Logger! 🎉
```

---

## 🏗 架构说明

### 层级职责

| 层级 | 类名/接口 | 职责 |
|------|----------|------|
| **类型定义** | `LogLevel`, `LogEntry` | 定义枚举和数据结构 |
| **格式化层** | `ILogFormatter`, `SimpleFormatter` | LogEntry → 字符串 |
| **传输层** | `ILogTransport`, `BaseTransport`, `ConsoleTransport`, `FileTransport` | 字符串 → 输出目标 |
| **核心层** | `Logger` | 组装 + 过滤 + 分发 |

### 数据流

```
用户调用 logger.info("msg", meta)
    ↓
1. 检查 level >= minLevel? （否则丢弃）
    ↓
2. 构建 LogEntry { timestamp, level, message, meta }
    ↓
3. 遍历 transports[]，逐一调用 transport.log(entry)
    ↓
4. 每个 Transport 内部调用 formatter.format(entry) 得到字符串
    ↓
5. 写入具体目标（console.log / file.write / ...）
```

---

## 📖 API 文档

### Logger 类

#### 构造函数

```typescript
constructor(minLevel: LogLevel = LogLevel.Verbose)
```

- **参数**: `minLevel` 最小日志等级（默认输出所有级别）
- **示例**: `new Logger(LogLevel.Info)` // 仅输出 info 及以上

#### 方法

##### addTransport(transport)

注册新的输出目标。

```typescript
addTransport(transport: ILogTransport): this
```

- **返回值**: `this`（支持链式调用）
- **示例**: `logger.addTransport(consoleTransport).addTransport(fileTransport)`

##### removeTransport(transport)

移除已注册的传输器。

```typescript
removeTransport(transport: ILogTransport): this
```

##### setMinLevel(level)

动态调整最小日志等级。

```typescript
setMinLevel(level: LogLevel): void
```

##### verbose(message, meta?)

记录 VERBOSE 级别日志（调试信息）。

```typescript
verbose(message: string, meta?: Record<string, unknown>): void
```

##### info(message, meta?)

记录 INFO 级别日志（常规信息）。

```typescript
info(message: string, meta?: Record<string, unknown>): void
```

##### warning(message, meta?)

记录 WARNING 级别日志（潜在问题）。

```typescript
warning(message: string, meta?: Record<string, unknown>): void
```

##### error(message, meta?)

记录 ERROR 级别日志（错误信息）。

```typescript
error(message: string, meta?: Record<string, unknown>): void
```

### SimpleFormatter 类

#### 构造函数

```typescript
constructor(options?: {
  includeTimestamp?: boolean  // 是否包含时间戳（默认 true）
  includeMeta?: boolean      // 是否包含元数据（默认 true）
})
```

**输出格式示例：**
```
[2024-06-25T14:30:00.000Z][INFO] Application started {"version":"1.0.0"}
```

### ConsoleTransport 类

#### 构造函数

```typescript
constructor(formatter: ILogFormatter)
```

**行为映射：**
- `verbose` / `info` → `console.log()`
- `warning` → `console.warn()`
- `error` → `console.error()`

### FileTransport 类

#### 构造函数

```typescript
constructor(formatter: ILogFormatter, filePath: string)
```

- **参数**:
  - `formatter`: 格式化器实例
  - `filePath`: 目标文件路径（如 `'./logs/app.log'`）
- **当前实现**: 使用模拟的 `NativeFileWriteSync()` 函数（见源码注释）
- **未来替换**: 改为 Node.js 的 `fs.writeFileSync()` 或异步 `fs.promises.appendFile()`

---

## 💻 使用示例

### 示例 1：基本控制台日志

```typescript
import { Logger, ConsoleTransport, SimpleFormatter } from './src'

const logger = new Logger(LogLevel.Verbose)
logger.addTransport(new ConsoleTransport(new SimpleFormatter()))

logger.info('服务器启动成功', { port: 3000, env: 'development' })
// 输出：[2024-06-25T14:30:00.000Z][INFO] 服务器启动成功 {"port":3000,"env":"development"}
```

### 示例 2：多目标输出

```typescript
import { Logger, ConsoleTransport, FileTransport, SimpleFormatter } from './src'

const logger = new Logger()

logger
  .addTransport(new ConsoleTransport(new SimpleFormatter()))
  .addTransport(new FileTransport(new SimpleFormatter(), './logs/app.log'))

logger.error('数据库连接超时', { timeout: 5000, retries: 3 })
// 控制台输出 + 文件同步写入
```

### 示例 3：环境感知工厂

```typescript
function createLogger(): Logger {
  const isProd = process.env.NODE_ENV === 'production'
  const logger = new Logger(isProd ? LogLevel.Info : LogLevel.Verbose)

  if (isProd) {
    logger.addTransport(new ConsoleTransport(new SimpleFormatter()))
    logger.addTransport(new FileTransport(new SimpleFormatter(), '/var/log/app.log'))
  } else {
    logger.addTransport(new ConsoleTransport(new SimpleFormatter()))
  }

  return logger
}
```

完整示例请参见 [`examples/usage-example.ts`](./examples/usage-example.ts)。

---

## 🔮 未来扩展指南

### 场景 1：切换为真实文件写入

**当前状态**: 使用 `NativeFileWriteSync()` 模拟

**操作步骤**:
1. 打开 `src/transports/file-transport.ts`
2. 替换顶部的 `NativeFileWriteSync` 函数：

```typescript
// 替换前（模拟）
function NativeFileWriteSync(filePath: string, buffer: string) {
  console.log(`[File IO ${filePath}] ${buffer}`)
}

// 替换后（真实 Node.js fs）
import * as fs from 'fs'

function NativeFileWriteSync(filePath: string, buffer: string): void {
  fs.appendFileSync(filePath, buffer, 'utf8')
}
```

3. 其他代码无需任何修改 ✅

### 场景 2：新增 JSON 格式化器

创建 `src/formatters/json-formatter.ts`:

```typescript
import { BaseFormatter, ILogFormatter } from './base-formatter'
import { LogEntry } from '../types'

export class JsonFormatter extends BaseFormatter implements ILogFormatter {
  format(entry: LogEntry): string {
    return JSON.stringify({
      timestamp: entry.timestamp.toISOString(),
      level: entry.level,
      message: entry.message,
      ...(entry.meta && { meta: entry.meta }),
    })
  }
}
```

使用：
```typescript
import { JsonFormatter } from './formatters/json-formatter'
const transport = new ConsoleTransport(new JsonFormatter())
```

### 场景 3：新增远程日志传输器

创建 `src/transports/http-transport.ts`:

```typescript
import { BaseTransport, ILogTransport } from './base-transport'
import { LogEntry } from '../types'
import type { ILogFormatter } from '../formatters/base-formatter'

export class HttpTransport extends BaseTransport implements ILogTransport {
  private readonly endpoint: URL

  constructor(formatter: ILogFormatter, endpoint: string) {
    super(formatter)
    this.endpoint = new URL(endpoint)
  }

  log(entry: LogEntry): void {
    const payload = this.formatter.format(entry)
    
    fetch(this.endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: payload }),
    }).catch(err => console.error('[HttpTransport] Send failed:', err))
  }
}
```

注册使用：
```typescript
logger.addTransport(new HttpTransport(new SimpleFormatter(), 'https://log.example.com/api/logs'))
```

### 场景 4：添加新的日志等级

1. 在 `src/types/log-level.ts` 扩展枚举：

```typescript
export enum LogLevel {
  Debug = -1,     // 新增：比 Verbose 更细粒度
  Verbose = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  Fatal = 4,      // 新增：致命错误
}
```

2. 更新 `getLogLevelLabel()` 函数
3. 在 `Logger` 类中添加对应方法：

```typescript
fatal(message: string, meta?: Record<string, unknown>): void {
  this.dispatch(LogLevel.Fatal, message, meta)
}
```

### 场景 5：异步日志支持

如果需要高性能异步写入，可以：

1. 创建 `AsyncTransport` 基类，将 `log()` 包装为 Promise
2. 或引入队列机制，批量写入减少 IO 次数
3. 当前同步设计适用于大多数 Web 应用场景

---

## 📂 项目结构

```
任务一/
├── src/                          # 源代码目录
│   ├── types/                    # 类型定义
│   │   ├── log-level.ts         # LogLevel 枚举 + 辅助函数
│   │   ├── log-entry.ts         # LogEntry 接口
│   │   └── index.ts             # 类型统一导出
│   ├── formatters/              # 格式化器
│   │   ├── base-formatter.ts    # ILogFormatter 接口 + 抽象基类
│   │   └── simple-formatter.ts  # 默认文本格式化器
│   ├── transports/             # 传输器
│   │   ├── base-transport.ts   # ILogTransport 接口 + 抽象基类
│   │   ├── console-transport.ts # 控制台输出
│   │   └── file-transport.ts   # 文件输出（模拟 I/O）
│   ├── core/
│   │   └── logger.ts           # Logger 主类
│   └── index.ts                # 公共 API 入口
├── examples/
│   └── usage-example.ts        # 完整使用示例
├── README.md                    # 本文档
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目元信息
```

---

## ⚠️ 注意事项

1. **数据类型限制**: 当前设计假设日志内容仅为字符串或可通过 `JSON.stringify` 序列化的数据
2. **线程安全**: JavaScript 单线程模型天然安全，但若未来移植到 Worker 环境，需考虑锁机制
3. **性能影响**: 高频日志场景建议增加缓冲区或采样率控制
4. **文件权限**: 真实文件写入需确保进程有目标目录的读写权限

---

## 📝 License

MIT License - 自由使用和修改

---

