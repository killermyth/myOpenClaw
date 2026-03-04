export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? '\n' + error.stack : ''}`;
  }
  return String(error);
}

export function setupGlobalErrorHandlers(): void {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', formatError(error));
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', formatError(reason));
    process.exit(1);
  });
}
