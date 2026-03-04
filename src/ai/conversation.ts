import type { ChatMessage } from './types.js';
import type { AIConfig } from '../config/types.js';

export class Conversation {
  private messages: ChatMessage[] = [];

  constructor(private config: AIConfig) {
    if (config.systemPrompt) {
      this.messages.push({ role: 'system', content: config.systemPrompt });
    }
  }

  addUserMessage(content: string): void {
    this.messages.push({ role: 'user', content });
  }

  addAssistantMessage(content: string): void {
    this.messages.push({ role: 'assistant', content });
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  clear(): void {
    this.messages = [];
    if (this.config.systemPrompt) {
      this.messages.push({ role: 'system', content: this.config.systemPrompt });
    }
  }
}
