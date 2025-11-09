import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async () => {
  process.env.NODE_ENV = 'test';
  if (process.env.SKIP_JEST_DB_RESET === 'true') {
    return;
  }
  const cwd = __dirname;

  execSync('npm run migrate', { stdio: 'inherit', cwd });
  execSync('npm run seed', { stdio: 'inherit', cwd });
};
