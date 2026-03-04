export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason?: string;
  }>;
}
