import * as readline from 'readline';
import type { MyClawConfig } from '../config/types.js';
import { Conversation } from '../ai/conversation.js';
import { streamChatCompletion } from '../ai/client.js';

export async function testChat(config: MyClawConfig): Promise<void> {
  const conversation = new Conversation(config.ai!);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n=== AI Chat Test ===');
  console.log('输入消息开始对话，输入 "exit" 退出，输入 "clear" 清除历史\n');

  const prompt = () => {
    rl.question('You: ', async (input) => {
      const text = input.trim();

      if (!text) {
        prompt();
        return;
      }

      if (text === 'exit') {
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
      }

      if (text === 'clear') {
        conversation.clear();
        console.log('对话历史已清除\n');
        prompt();
        return;
      }

      conversation.addUserMessage(text);

      process.stdout.write('AI: ');
      let fullResponse = '';

      try {
        for await (const chunk of streamChatCompletion(conversation.getMessages(), config.ai!)) {
          fullResponse += chunk;
          process.stdout.write(chunk);
        }
        console.log('\n');
        conversation.addAssistantMessage(fullResponse);
      } catch (error) {
        console.error('\n错误:', error instanceof Error ? error.message : String(error));
      }

      prompt();
    });
  };

  prompt();
}
