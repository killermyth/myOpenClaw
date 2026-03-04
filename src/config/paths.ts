import { resolve } from 'path';
import { homedir } from 'os';

export function getMyClawDir(): string {
  return resolve(homedir(), '.myclaw');
}

export function getConfigPath(): string {
  return resolve(getMyClawDir(), 'myclaw.json');
}

export function getLogsDir(): string {
  return resolve(getMyClawDir(), 'logs');
}
