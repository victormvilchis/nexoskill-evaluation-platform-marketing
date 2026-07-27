import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

test('el repository guard se ejecuta localmente sin detectarse a sí mismo', () => {
  const output = execFileSync(process.execPath, ['scripts/repository-guard.mjs'], {
    cwd: new URL('.', root),
    encoding: 'utf8',
  });

  assert.match(output, /Repository guard aprobado/);
});

test('GitHub Actions utiliza el guard centralizado y no un grep autorreferencial', async () => {
  const workflow = await read('.github/workflows/ci.yml');

  assert.match(workflow, /npm run repository:guard/);
  assert.doesNotMatch(workflow, /git grep/);
  assert.doesNotMatch(workflow, /DB_PASSWORD\|MAIL_PASSWORD/);
});

test('los archivos de ejemplo conservan secretos vacíos', async () => {
  for (const file of ['.env.example', '.env.production.example']) {
    const content = await read(file);
    assert.match(content, /^DB_PASSWORD=\s*$/m);
    assert.match(content, /^MAIL_PASSWORD=\s*$/m);
    assert.match(content, /^IP_HASH_SALT=\s*$/m);
  }
});
