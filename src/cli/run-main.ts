import { loadDotEnv } from '../infra/dotenv.js';
import { buildProgram } from './program.js';

export async function runMain(): Promise<void> {
  loadDotEnv();
  const program = buildProgram();
  await program.parseAsync(process.argv);
}
