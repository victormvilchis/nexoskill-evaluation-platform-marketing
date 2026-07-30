import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const [pkgText, compose, dockerfile, nginx, prodEnv, application, validator] = await Promise.all([
  read('package.json'),
  read('docker-compose.production.yml'),
  read('Dockerfile'),
  read('nginx.conf'),
  read('.env.production.example'),
  read('backend/src/main/resources/application.yml'),
  read('backend/src/main/java/com/nexoskill/marketing/config/ProductionConfigurationValidator.java'),
]);
const pkg = JSON.parse(pkgText);

test('la versión 1.1.0 está homologada', () => {
  assert.equal(pkg.version, '1.1.0');
  assert.match(application, /version: 1\.1\.0/);
  assert.match(application, /readiness:\n\s+include: readinessState,db/);
});

test('el frontend productivo usa nginx sin privilegios', () => {
  assert.match(dockerfile, /nginxinc\/nginx-unprivileged:1\.27-alpine/);
  assert.match(dockerfile, /EXPOSE 8080/);
  assert.match(nginx, /listen 8080;/);
});

test('la API no publica su puerto y ambos servicios tienen hardening', () => {
  const apiSection = compose.split(/\n  marketing-web:/)[0];
  assert.doesNotMatch(apiSection, /\n\s+ports:/);
  assert.match(compose, /read_only: true/g);
  assert.match(compose, /no-new-privileges:true/g);
  assert.match(compose, /cap_drop:\n\s+- ALL/g);
  assert.match(compose, /actuator\/health\/readiness/);
  assert.match(compose, /max-size:/);
  assert.match(compose, /MARKETING_BIND_ADDRESS/);
});

test('el archivo productivo conserva secretos vacíos y placeholders visibles', () => {
  assert.match(prodEnv, /^DB_PASSWORD=\s*$/m);
  assert.match(prodEnv, /^IP_HASH_SALT=\s*$/m);
  assert.match(prodEnv, /^MAIL_PASSWORD=\s*$/m);
  assert.match(prodEnv, /replace-with-domain\.example\.invalid/);
  assert.match(prodEnv, /REPLACE_WITH_ORACLE_HOST/);
});

test('el perfil productivo rechaza usuarios privilegiados y configuración incompleta', () => {
  assert.match(validator, /DB_URL/);
  assert.match(validator, /DB_PASSWORD/);
  assert.match(validator, /SYSTEM/);
  assert.match(validator, /SYS/);
  assert.match(validator, /CORS_ALLOWED_ORIGINS/);
  assert.match(validator, /MAIL_ENABLED/);
});

test('existen scripts de operación y documentación', async () => {
  const files = [
    'scripts/deployment/preflight.sh',
    'scripts/deployment/deploy.sh',
    'scripts/deployment/update.sh',
    'scripts/deployment/rollback.sh',
    'scripts/deployment/status.sh',
    'scripts/deployment/backup-oracle.sh',
    'scripts/deployment/restore-oracle.sh',
    'docs/DEPLOYMENT_READINESS.md',
    'docs/OPERATIONS_RUNBOOK.md',
    'docs/ORACLE_BACKUP_RESTORE.md',
  ];
  await Promise.all(files.map((file) => access(new URL(`../${file}`, import.meta.url))));
});
