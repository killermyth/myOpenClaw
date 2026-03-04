# myOpenClaw

个人 AI 助手 - 通过 Telegram 提供流式 AI 对话

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 填入你的配置：

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

### 3. 构建

```bash
npm run build
```

### 4. 运行

```bash
npm start
```

或直接使用：

```bash
node myclaw.mjs start
```

## 命令

- `myclaw start` - 启动 Telegram bot
- `myclaw config` - 查看当前配置

## Telegram 命令

- `/start` - 开始使用
- `/clear` - 清除对话历史
- `/model` - 查看当前模型
- `/help` - 帮助信息

## 配置方式

支持三种配置方式（优先级从高到低）：

1. 环境变量
2. `.env` 文件（项目目录或 `~/.myclaw/.env`）
3. JSON 配置文件 `~/.myclaw/myclaw.json`

JSON 配置示例：

```json
{
  "telegram": {
    "botToken": "your_token"
  },
  "ai": {
    "apiKey": "your_key",
    "baseUrl": "https://api.deepseek.com/v1",
    "model": "deepseek-chat",
    "maxTokens": 2048,
    "temperature": 0.7,
    "systemPrompt": "你是一个有用的个人 AI 助手。"
  }
}
```

## 开发

```bash
npm run dev
```
