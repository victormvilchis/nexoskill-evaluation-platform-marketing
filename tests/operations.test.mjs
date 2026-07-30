import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const start = await read('start-marketing.ps1');
const startFrontend = await read('start-frontend.ps1');
const stop = await read('stop-marketing.ps1');
const env = await read('.env.example');
const compose = await read('docker-compose.yml');

const scripts = [
  start,
  startFrontend,
  stop,
  await read('check-marketing.ps1'),
  await read('backend/start-backend.ps1'),
];

test('el inicio solicita Oracle una sola vez y levanta frontend y backend', () => {
  assert.match(start, /\.env\.local/);
  assert.match(start, /Usuario\/esquema Oracle/);
  assert.match(start, /backend\\start-backend\.ps1/);
  assert.match(start, /start-frontend\.ps1/);
  assert.match(start, /Invoke-RestMethod -Uri 'http:\/\/localhost:8081\/actuator\/health'/);
  assert.match(start, /Invoke-WebRequest -Uri 'http:\/\/localhost:5174\/'/);
});

test('el inicio registra PID independientes y devuelve el control de la terminal', () => {
  assert.match(start, /marketing-backend\.pid/);
  assert.match(start, /marketing-frontend\.pid/);
  assert.match(start, /\$backendProcess = Start-Process/);
  assert.match(start, /\$frontendProcess = Start-Process/);
  assert.match(start, /backend\\start-backend\.ps1/);
  assert.match(start, /start-frontend\.ps1/);
  assert.match(startFrontend, /npm run dev -- --host 127\.0\.0\.1/);
});

test('las variables y Docker utilizan una instancia Oracle externa', () => {
  assert.match(env, /DB_URL=jdbc:oracle:thin:/);
  assert.match(env, /DB_USERNAME=/);
  assert.match(env, /DB_PASSWORD=/);
  assert.match(compose, /marketing-api:/);
  assert.doesNotMatch(compose, /postgres|oracle-db|database:/i);
});

test('el apagado libera procesos registrados y protege procesos ajenos', () => {
  assert.match(stop, /5174/);
  assert.match(stop, /8081/);
  assert.match(stop, /Get-ChildItem \$runtimeRoot -Filter '\*\.pid'/);
  assert.match(stop, /Test-ProcessBelongsToProject/);
  assert.match(stop, /ParentProcessId/);
  assert.match(stop, /taskkill \/PID \$ProcessId \/T \/F/);
  assert.match(stop, /IndexOf\(\$projectRoot, \[StringComparison\]::OrdinalIgnoreCase\) -ge 0/);
  assert.doesNotMatch(stop, /\.Contains\([^\n]+,\s*\[StringComparison\]/);
});

test('los scripts no contienen texto dañado por codificación', () => {
  for (const script of scripts) {
    assert.doesNotMatch(script, /Ã.|Â.|â€|ï»¿/);
  }
});
