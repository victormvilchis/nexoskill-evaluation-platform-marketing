import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const start = await read('start-marketing.ps1');
const stop = await read('stop-marketing.ps1');
const env = await read('.env.example');
const compose = await read('docker-compose.yml');

test('el inicio solicita Oracle una sola vez y levanta frontend y backend', () => {
  assert.match(start, /\.env\.local/);
  assert.match(start, /Usuario\/esquema Oracle/);
  assert.match(start, /backend\\start-backend\.ps1/);
  assert.match(start, /Invoke-RestMethod -Uri 'http:\/\/localhost:8081\/actuator\/health'/);
  assert.match(start, /npm run dev/);
});

test('las variables y Docker utilizan una instancia Oracle externa', () => {
  assert.match(env, /DB_URL=jdbc:oracle:thin:/);
  assert.match(env, /DB_USERNAME=/);
  assert.match(env, /DB_PASSWORD=/);
  assert.match(compose, /marketing-api:/);
  assert.doesNotMatch(compose, /postgres|oracle-db|database:/i);
});

test('el script de apagado libera los puertos del proyecto de marketing', () => {
  assert.match(stop, /5174/);
  assert.match(stop, /8081/);
  assert.match(stop, /taskkill/);
});
