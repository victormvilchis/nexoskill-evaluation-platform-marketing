# Valtieris Marketing Website

Sitio público y comercial de Valtieris. Este repositorio es independiente de `nexoskill-evaluation-platform` y no contiene la operación de evaluaciones, estudiantes ni administración SaaS.

## Estado

**1.1.0 Parte 1 — Conversión, atribución y consentimiento**

Esta versión conserva la experiencia comercial estable de `1.0.1` y agrega atribución UTM, eventos normalizados de conversión, persistencia de origen comercial en Oracle y consentimiento preparado para analítica externa.

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

Flyway agrega en `V2__add_marketing_attribution.sql` las columnas de campaña, página de entrada, página de conversión y consentimiento analítico.

Los formularios disponibles son:

- `POST /api/v1/leads/contact`
- `POST /api/v1/leads/demo`
- `POST /api/v1/leads/quote`
- `POST /api/v1/leads/advisory`
- `POST /api/v1/leads/bootcamp`

## Atribución de campañas

Valtieris conserva durante la sesión los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y los identificadores `gclid`, `fbclid`, `msclkid` o `li_fat_id`. Esta información se envía únicamente cuando la persona completa un formulario.

Ejemplo:

```text
http://localhost:5174/solicitar-demo?utm_source=linkedin&utm_medium=social&utm_campaign=java_backend_2026
```

Consulta [`docs/ATTRIBUTION_AND_ANALYTICS.md`](docs/ATTRIBUTION_AND_ANALYTICS.md).

## Marca y sistema visual

La identidad pública del sitio es **Valtieris**. Los activos y reglas de uso están documentados en [`docs/VALTIERIS_BRAND_SYSTEM.md`](docs/VALTIERIS_BRAND_SYSTEM.md).

## Analítica y consentimiento

La analítica externa permanece desactivada mientras:

```env
VITE_ENABLE_ANALYTICS=false
```

Cuando se configura Google Tag Manager o Google Analytics, el script solo se carga después de consentimiento explícito. Los eventos no incluyen datos escritos en los formularios.

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
- [`docs/ATTRIBUTION_AND_ANALYTICS.md`](docs/ATTRIBUTION_AND_ANALYTICS.md)

## Git y CI

GitHub Actions valida frontend, Playwright, backend Maven y Repository Guard. Flujo recomendado:

```text
main
feature/*
fix/*
release/*
hotfix/*
```
