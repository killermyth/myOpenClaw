import { readFileSync, existsSync } from 'fs';
import { getConfigPath } from './paths.js';
import type { MyClawConfig, AIConfig, TelegramConfig, DiscordConfig } from './types.js';

let cachedConfig: MyClawConfig | null = null;

export function loadConfig(): MyClawConfig {
  if (cachedConfig) return cachedConfig;

  const configPath = getConfigPath();
  let fileConfig: MyClawConfig = {};

  if (existsSync(configPath)) {
    try {
      fileConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch (error) {
      console.warn(`Failed to load config from ${configPath}:`, error);
    }
  }

  const config: MyClawConfig = {
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN || fileConfig.telegram?.botToken,
    },
    discord: {
      botToken: process.env.DISCORD_BOT_TOKEN || fileConfig.discord?.botToken,
    },
    ai: {
      apiKey: process.env.OPENAI_API_KEY || fileConfig.ai?.apiKey,
      baseUrl: process.env.OPENAI_BASE_URL || fileConfig.ai?.baseUrl || 'https://api.openai.com/v1',
      model: process.env.OPENAI_MODEL || fileConfig.ai?.model || 'gpt-3.5-turbo',
      maxTokens: fileConfig.ai?.maxTokens || 2048,
      temperature: fileConfig.ai?.temperature || 0.7,
      systemPrompt: fileConfig.ai?.systemPrompt || '你是一个有用的个人 AI 助手。',
    },
  };

  cachedConfig = config;
  return config;
}

export function clearConfigCache(): void {
  cachedConfig = null;
}
