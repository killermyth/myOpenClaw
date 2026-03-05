import type { Client, Message } from 'discord.js';
import type { MyClawConfig } from '../config/types.js';
import { Conversation } from '../ai/conversation.js';
import { streamChatCompletion } from '../ai/client.js';
import { DiscordStream } from './stream.js';
import { createSubsystemLogger } from '../logging/subsystem.js';

const log = createSubsystemLogger('discord-handlers');
const conversations = new Map<string, Conversation>();

export function setupHandlers(client: Client, config: MyClawConfig): void {
  log.info('Setting up Discord message handlers...');

  client.on('messageCreate', async (message: Message) => {
    log.info(`Received message from ${message.author.tag} in #${message.channel.id}: ${message.content}`);

    if (message.author.bot) {
      log.info('Ignoring bot message');
      return;
    }

    const content = message.content.trim();
    const channelId = message.channelId;

    if (content === '!start') {
      await message.reply('欢迎使用 myOpenClaw AI 助手！\n\n发送消息开始对话。\n\n命令：\n!clear - 清除对话历史\n!model - 查看当前模型\n!help - 帮助信息');
      return;
    }

    if (content === '!help') {
      await message.reply('可用命令：\n!start - 开始使用\n!clear - 清除对话历史\n!model - 查看当前模型信息\n!help - 显示此帮助');
      return;
    }

    if (content === '!clear') {
      conversations.delete(channelId);
      await message.reply('对话历史已清除。');
      return;
    }

    if (content === '!model') {
      await message.reply(`当前模型：${config.ai?.model}\nAPI: ${config.ai?.baseUrl}`);
      return;
    }

    if (content.startsWith('!')) return;

    let conversation = conversations.get(channelId);
    if (!conversation) {
      conversation = new Conversation(config.ai!);
      conversations.set(channelId, conversation);
    }

    conversation.addUserMessage(content);

    if ('sendTyping' in message.channel) {
      await message.channel.sendTyping();
    }

    const stream = new DiscordStream();
    let fullResponse = '';

    try {
      for await (const chunk of streamChatCompletion(conversation.getMessages(), config.ai!)) {
        fullResponse += chunk;
        await stream.update(fullResponse, message.channel);
      }

      await stream.stop();
      conversation.addAssistantMessage(fullResponse);
    } catch (error) {
      log.error('AI error:', error);
      await message.reply('抱歉，处理您的请求时出错了。');
    }
  });
}
