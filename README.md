# NexoSkill Marketing Website

Sitio público y comercial de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform` y no contiene la operación de evaluaciones, estudiantes ni administración SaaS.

## Estado

**1.0.1 — Deployment Readiness**

Esta versión conserva la experiencia comercial estable de `1.0.0` y prepara el código para una instalación productiva futura: contenedores endurecidos, validación de variables, health checks, scripts de despliegue, actualización, rollback y respaldo Oracle.

## Servicios locales

| Servicio | URL |
|---|---|
| Marketing | `http://localhost:5174` |
| API comercial | `http://localhost:8081` |
| Health | `http://localhost:8081/actuator/health` |
| Mailpit opcional | `http://localhost:8025` |

## Requisitos locales

- Node.js 22.12 o superior y npm 10 o superior.
- Java 21 y Maven 3.9 o superior.
- Oracle `XEPDB1` con usuario aplicativo, por ejemplo `EVALUATION_APP`.
- PowerShell 5.1 o superior en Windows.

No utilices `SYSTEM` o `SYS` como usuario de la aplicación.

## Inicio local

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\check-marketing.ps1
.\start-marketing.ps1
```

Detener:

```powershell
.\stop-marketing.ps1
```

## Oracle

Los objetos del sitio comercial permanecen aislados mediante el prefijo `MKT_`:

- `MKT_PROSPECT`
- `MKT_PROSPECT_SEQ`
- `MKT_FLYWAY_HISTORY`

Los formularios disponibles son:

- `POST /api/v1/leads/contact`
- `POST /api/v1/leads/demo`
- `POST /api/v1/leads/quote`
- `POST /api/v1/leads/advisory`
- `POST /api/v1/leads/bootcamp`

## Validaciones

```powershell
npm install
npm run check
npm run test:e2e -- --project=chromium

cd backend
mvn clean verify
cd ..
```

Validación de preparación productiva:

```powershell
npm run deployment:validate
npm run deployment:check
```

## Despliegue futuro

No es necesario contar ahora con dominio o DNS para mantener listo el código. La instalación real requiere completar `.env.production` con endpoint HTTPS, Oracle, secretos y configuración del servidor.

Documentación:

- [`DEPLOYMENT.md`](DEPLOYMENT.md)
- [`docs/DEPLOYMENT_READINESS.md`](docs/DEPLOYMENT_READINESS.md)
- [`docs/OPERATIONS_RUNBOOK.md`](docs/OPERATIONS_RUNBOOK.md)
- [`docs/ORACLE_BACKUP_RESTORE.md`](docs/ORACLE_BACKUP_RESTORE.md)

## Git y CI

GitHub Actions valida frontend, Playwright, backend Maven y Repository Guard. Flujo recomendado:

```text
main
feature/*
fix/*
release/*
hotfix/*
```
