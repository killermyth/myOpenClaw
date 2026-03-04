import { logger } from './logger.js';

export function createSubsystemLogger(subsystem: string) {
  return logger.getSubLogger({ name: subsystem });
}
