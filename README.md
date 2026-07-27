# NexoSkill Marketing Website

Sitio público y comercial de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform` y no contiene la operación de evaluaciones, estudiantes ni administración SaaS.

## Estado

**1.0.0 RC1 — Release Candidate**

Esta versión estabiliza el producto existente mediante pruebas E2E, accesibilidad automática, configuración por ambiente, scripts operativos, control de errores y automatización de GitHub. No agrega nuevas líneas comerciales.

## Servicios locales

| Servicio | URL |
|---|---|
| Marketing | `http://localhost:5174` |
| API comercial | `http://localhost:8081` |
| Health | `http://localhost:8081/actuator/health` |
| Mailpit opcional | `http://localhost:8025` |

La plataforma de evaluaciones continúa como aplicación independiente.

## Requisitos

- Node.js 22.12 o superior y npm 10 o superior.
- Java 21 y Maven 3.9 o superior.
- Acceso a Oracle `XEPDB1` mediante un usuario aplicativo, por ejemplo `EVALUATION_APP`.
- PowerShell 5.1 o superior en Windows.

No utilices `SYSTEM` o `SYS` como usuario de la aplicación.

## Inicio local

El diagnóstico previo comprueba herramientas, variables, puertos y conectividad TCP con Oracle:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\check-marketing.ps1
```

Inicia frontend y backend:

```powershell
.\start-marketing.ps1
```

También puedes ejecutar:

```text
start-marketing.cmd
```

La primera ejecución solicita la conexión Oracle y guarda la configuración en `.env.local`, excluido de Git.

Detener:

```powershell
.\stop-marketing.ps1
```

El script solo finaliza procesos cuya línea de comandos pertenece a este repositorio. No detiene automáticamente la plataforma principal.

## Oracle

Los objetos del sitio comercial permanecen aislados dentro del esquema compartido:

- `MKT_PROSPECT`
- `MKT_PROSPECT_SEQ`
- `MKT_FLYWAY_HISTORY`

Verificación rápida desde SQL Developer:

```sql
@scripts/oracle/verify-marketing.sql
```

Los formularios disponibles son:

- `POST /api/v1/leads/contact`
- `POST /api/v1/leads/demo`
- `POST /api/v1/leads/quote`
- `POST /api/v1/leads/advisory`
- `POST /api/v1/leads/bootcamp`

## Correo local con Mailpit

El guardado en Oracle funciona aunque SMTP esté desactivado. Para probar las notificaciones sin enviar correos reales:

```powershell
docker compose -f docker-compose.yml -f docker-compose.mail.yml up --build
```

Abre `http://localhost:8025` para consultar los mensajes capturados.

## Validaciones

### Frontend y validaciones estáticas

```powershell
npm install
npm run check
```

### Navegador real

Instala los navegadores una sola vez:

```powershell
npx playwright install
```

Ejecuta:

```powershell
npm run test:e2e
```

Para Chromium únicamente:

```powershell
npm run test:e2e -- --project=chromium
```

### Backend

```powershell
cd backend
mvn clean verify
cd ..
```

### Validación completa

```powershell
npm run check:all
```

## Perfiles Spring Boot

- `local`: configuración de desarrollo y health de correo desactivado.
- `prod`: exige credenciales, sal de IP fuerte, CORS HTTPS explícito y usuario Oracle no privilegiado.

El script local establece automáticamente:

```env
SPRING_PROFILES_ACTIVE=local
```

Docker productivo utiliza `prod`.

## Git y CI

GitHub Actions ejecuta:

- Validación TypeScript, contenido, SEO y build.
- Playwright y axe sobre Chromium.
- Pruebas y empaquetado Maven.
- Control para impedir archivos `.env` o credenciales versionadas.

Flujo recomendado:

```text
main
feature/*
fix/*
release/*
hotfix/*
```

Consulta [`RELEASE_NOTES.md`](RELEASE_NOTES.md), [`CHANGELOG.md`](CHANGELOG.md) y [`docs/RC1_CHECKLIST.md`](docs/RC1_CHECKLIST.md).
