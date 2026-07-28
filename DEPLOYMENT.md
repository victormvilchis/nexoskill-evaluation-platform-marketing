# Despliegue de NexoSkill Marketing 1.0.1

## Objetivo

La versión 1.0.1 deja el sitio preparado para desplegarse cuando exista servidor y endpoint HTTPS. No requiere definir ahora un dominio real, pero el perfil productivo no inicia con placeholders ni secretos vacíos.

## Arquitectura

```text
Reverse proxy / balanceador HTTPS
└── 127.0.0.1:8080  marketing-web (Nginx sin privilegios)
    └── /api         marketing-api:8081 (red Docker, sin puerto público)
                     └── Oracle externo / esquema aplicativo
```

La plataforma de evaluaciones continúa como proyecto y despliegue independiente.

## Preparación

```bash
cp .env.production.example .env.production
chmod 600 .env.production
```

Completa al menos:

```text
VITE_SITE_URL
DB_URL
DB_USERNAME
DB_PASSWORD
CORS_ALLOWED_ORIGINS
IP_HASH_SALT
MARKETING_IMAGE_TAG
```

`VITE_SITE_URL` y CORS deben utilizar HTTPS. El usuario Oracle no puede ser `SYSTEM` ni `SYS`.

## Validación

```bash
node scripts/deployment/validate-production-env.mjs --env .env.production
./scripts/deployment/preflight.sh
```

## Despliegue

```bash
./scripts/deployment/deploy.sh
```

## Actualización y rollback

```bash
./scripts/deployment/update.sh
./scripts/deployment/rollback.sh
```

El rollback solo restaura imágenes. No revierte datos ni migraciones Oracle.

## Operación

Consulta:

- [`docs/DEPLOYMENT_READINESS.md`](docs/DEPLOYMENT_READINESS.md)
- [`docs/OPERATIONS_RUNBOOK.md`](docs/OPERATIONS_RUNBOOK.md)
- [`docs/ORACLE_BACKUP_RESTORE.md`](docs/ORACLE_BACKUP_RESTORE.md)
