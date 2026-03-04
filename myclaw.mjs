#!/usr/bin/env node

const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

if (majorVersion < 18) {
  console.error(`Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`);
  process.exit(1);
}

import('./dist/entry.js').catch((error) => {
  console.error('Failed to start myclaw:', error);
  process.exit(1);
});
