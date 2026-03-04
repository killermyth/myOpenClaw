import type { Bot, Context } from 'grammy';
import type { MyClawConfig } from '../config/types.js';
import { Conversation } from '../ai/conversation.js';
import { streamChatCompletion } from '../ai/client.js';
import { TelegramStream } from './stream.js';
import { createSubsystemLogger } from '../logging/subsystem.js';

const log = createSubsystemLogger('handlers');
const conversations = new Map<number, Conversation>();

export function setupHandlers(bot: Bot, config: MyClawConfig): void {
  bot.command('start', async (ctx) => {
    await ctx.reply('欢迎使用 myOpenClaw AI 助手！\n\n发送消息开始对话。\n\n命令：\n/clear - 清除对话历史\n/model - 查看当前模型\n/help - 帮助信息');
  });

  bot.command('help', async (ctx) => {
    await ctx.reply('可用命令：\n/start - 开始使用\n/clear - 清除对话历史\n/model - 查看当前模型信息\n/help - 显示此帮助');
  });

  bot.command('clear', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId) {
      conversations.delete(chatId);
      await ctx.reply('对话历史已清除。');
    }
  });

  bot.command('model', async (ctx) => {
    await ctx.reply(`当前模型：${config.ai?.model}\nAPI: ${config.ai?.baseUrl}`);
  });

  bot.on('message:text', async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const text = ctx.message?.text;
    if (!text || text.startsWith('/')) return;

    let conversation = conversations.get(chatId);
    if (!conversation) {
      conversation = new Conversation(config.ai!);
      conversations.set(chatId, conversation);
    }

    conversation.addUserMessage(text);

    await ctx.replyWithChatAction('typing');

    const stream = new TelegramStream(ctx);
    let fullResponse = '';

    try {
      for await (const chunk of streamChatCompletion(conversation.getMessages(), config.ai!)) {
        fullResponse += chunk;
        await stream.update(fullResponse);
      }

      await stream.stop();
      conversation.addAssistantMessage(fullResponse);
    } catch (error) {
      log.error('AI error:', error);
      await ctx.reply('抱歉，处理您的请求时出错了。');
    }
  });
}
