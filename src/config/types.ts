export interface AIConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface TelegramConfig {
  botToken?: string;
}

export interface DiscordConfig {
  botToken?: string;
}

export interface MyClawConfig {
  telegram?: TelegramConfig;
  discord?: DiscordConfig;
  ai?: AIConfig;
}
