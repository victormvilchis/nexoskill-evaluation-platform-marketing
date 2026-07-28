import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const exampleIndex = args.indexOf('--example');
const envIndex = args.indexOf('--env');
const exampleMode = exampleIndex >= 0;
const requestedPath = exampleMode
  ? args[exampleIndex + 1]
  : envIndex >= 0
    ? args[envIndex + 1]
    : '.env.production';

if (!requestedPath) {
  throw new Error('Indica la ruta después de --example o --env.');
}

const path = resolve(process.cwd(), requestedPath);
const content = await readFile(path, 'utf8');
const variables = new Map();

for (const [index, rawLine] of content.split(/\r?\n/).entries()) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const match = rawLine.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (!match) throw new Error(`${requestedPath}:${index + 1}: línea de variable inválida.`);
  variables.set(match[1], match[2].replace(/^['"]|['"]$/g, '').trim());
}

const required = [
  'COMPOSE_PROJECT_NAME',
  'MARKETING_IMAGE_TAG',
  'MARKETING_BIND_ADDRESS',
  'MARKETING_HTTP_PORT',
  'VITE_SITE_URL',
  'DB_URL',
  'DB_USERNAME',
  'DB_PASSWORD',
  'CORS_ALLOWED_ORIGINS',
  'IP_HASH_SALT',
  'MAIL_ENABLED',
];

const errors = [];
for (const name of required) {
  if (!variables.has(name)) errors.push(`Falta ${name}.`);
}

const value = (name) => variables.get(name) ?? '';
const isPlaceholder = (candidate) => /replace[_-]?with|example\.invalid|change-?me|placeholder|<required>|<secret>/i.test(candidate);
const isHttpsUrl = (candidate) => {
  try {
    return new URL(candidate).protocol === 'https:';
  } catch {
    return false;
  }
};

if (value('COMPOSE_PROJECT_NAME') && !/^[a-z0-9][a-z0-9_-]+$/i.test(value('COMPOSE_PROJECT_NAME'))) {
  errors.push('COMPOSE_PROJECT_NAME contiene caracteres no permitidos.');
}
if (value('MARKETING_IMAGE_TAG') && !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value('MARKETING_IMAGE_TAG'))) {
  errors.push('MARKETING_IMAGE_TAG no es un tag de imagen válido.');
}
if (value('MARKETING_HTTP_PORT') && !/^\d{2,5}$/.test(value('MARKETING_HTTP_PORT'))) {
  errors.push('MARKETING_HTTP_PORT debe ser numérico.');
}
if (value('VITE_SITE_URL') && !isHttpsUrl(value('VITE_SITE_URL'))) {
  errors.push('VITE_SITE_URL debe utilizar HTTPS para el despliegue productivo.');
}
if (value('CORS_ALLOWED_ORIGINS')) {
  const origins = value('CORS_ALLOWED_ORIGINS').split(',').map((item) => item.trim()).filter(Boolean);
  if (origins.length === 0 || origins.some((origin) => !isHttpsUrl(origin) || origin.includes('*'))) {
    errors.push('CORS_ALLOWED_ORIGINS debe contener orígenes HTTPS explícitos y sin comodines.');
  }
}
if (value('DB_URL') && !value('DB_URL').startsWith('jdbc:oracle:thin:@//')) {
  errors.push('DB_URL debe usar jdbc:oracle:thin:@//host:puerto/servicio.');
}
if (['SYSTEM', 'SYS'].includes(value('DB_USERNAME').toUpperCase())) {
  errors.push('DB_USERNAME debe ser un usuario aplicativo.');
}

for (const secret of ['DB_PASSWORD', 'IP_HASH_SALT', 'MAIL_PASSWORD']) {
  if (exampleMode) {
    if (value(secret) !== '') errors.push(`${secret} debe permanecer vacío en el archivo de ejemplo.`);
  } else if (secret !== 'MAIL_PASSWORD' || value('MAIL_ENABLED').toLowerCase() === 'true') {
    if (!value(secret)) errors.push(`${secret} es obligatorio.`);
    if (isPlaceholder(value(secret))) errors.push(`${secret} no puede usar un placeholder.`);
  }
}

if (!exampleMode) {
  if (value('DB_PASSWORD').length < 12) errors.push('DB_PASSWORD debe tener al menos 12 caracteres.');
  if (value('IP_HASH_SALT').length < 32) errors.push('IP_HASH_SALT debe tener al menos 32 caracteres.');
  for (const field of ['VITE_SITE_URL', 'DB_URL', 'CORS_ALLOWED_ORIGINS']) {
    if (isPlaceholder(value(field))) errors.push(`${field} todavía contiene un placeholder.`);
  }
}

if (value('MAIL_ENABLED').toLowerCase() === 'true') {
  for (const field of ['MAIL_HOST', 'MAIL_PORT', 'MAIL_FROM', 'CONTACT_RECIPIENT']) {
    if (!value(field)) errors.push(`${field} es obligatorio cuando MAIL_ENABLED=true.`);
  }
}

if (errors.length > 0) {
  console.error(`Configuración inválida en ${requestedPath}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Configuración ${exampleMode ? 'de ejemplo' : 'productiva'} validada: ${requestedPath}`);
}
