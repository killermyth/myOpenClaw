import type { Context } from 'grammy';

export class TelegramStream {
  private messageId?: number;
  private lastUpdate = 0;
  private throttleMs = 1000;
  private fullText = '';

  constructor(private ctx: Context) {}

  async update(text: string): Promise<void> {
    this.fullText = text;
    const now = Date.now();

    if (now - this.lastUpdate < this.throttleMs) return;

    this.lastUpdate = now;

    try {
      if (!this.messageId) {
        const msg = await this.ctx.reply(text);
        this.messageId = msg.message_id;
      } else {
        await this.ctx.api.editMessageText(
          this.ctx.chat!.id,
          this.messageId,
          text
        );
      }
    } catch (error) {
      // Ignore edit errors (message not modified, etc.)
    }
  }

  async stop(): Promise<void> {
    if (this.messageId && this.fullText) {
      try {
        await this.ctx.api.editMessageText(
          this.ctx.chat!.id,
          this.messageId,
          this.fullText
        );
      } catch (error) {
        // Ignore final edit errors
      }
    }
  }
}
