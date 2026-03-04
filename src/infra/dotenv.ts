import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

export function loadDotEnv(): void {
  const cwdEnv = resolve(process.cwd(), '.env');
  const homeEnv = resolve(process.env.HOME || '~', '.myclaw', '.env');

  if (existsSync(cwdEnv)) {
    config({ path: cwdEnv });
  } else if (existsSync(homeEnv)) {
    config({ path: homeEnv });
  }
}
