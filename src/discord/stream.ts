import type { Message } from 'discord.js';

export class DiscordStream {
  private message?: Message;
  private lastUpdate = 0;
  private throttleMs = 1000;
  private fullText = '';

  async update(text: string, channel: any): Promise<void> {
    this.fullText = text.slice(0, 2000);
    const now = Date.now();

    if (now - this.lastUpdate < this.throttleMs) return;

    this.lastUpdate = now;

    try {
      if (!this.message) {
        this.message = await channel.send(this.fullText);
      } else {
        await this.message.edit(this.fullText);
      }
    } catch (error) {
      // Ignore edit errors
    }
  }

  async stop(): Promise<void> {
    if (this.message && this.fullText) {
      try {
        await this.message.edit(this.fullText);
      } catch (error) {
        // Ignore final edit errors
      }
    }
  }
}
