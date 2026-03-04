import { setupGlobalErrorHandlers } from './infra/errors.js';
import { runMain } from './cli/run-main.js';

setupGlobalErrorHandlers();
runMain();
