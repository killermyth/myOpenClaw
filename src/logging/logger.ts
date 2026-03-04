import { Logger } from 'tslog';
import { resolve } from 'path';
import { mkdirSync, existsSync } from 'fs';

const logsDir = resolve(process.env.HOME || '~', '.myclaw', 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

export const logger = new Logger({
  type: 'pretty',
  minLevel: 0,
  prettyLogTemplate: '{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}} ',
});
