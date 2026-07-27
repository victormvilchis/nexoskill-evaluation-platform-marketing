# NexoSkill Marketing Website

Sitio público y comercial de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform`.

## Puertos locales

- Sitio de marketing: `http://localhost:5174`
- API de prospectos: `http://localhost:8081`
- Plataforma de evaluaciones: `http://localhost:5173/evaluaciones/dashboard`

## Requisitos

- Node.js 22.12 o superior y npm 10 o superior.
- Java 21 y Maven 3.9 o superior.
- Acceso a la instancia Oracle utilizada por la plataforma.

## Inicio local

En PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-marketing.ps1
```

En la primera ejecución se solicitan URL JDBC, usuario y contraseña Oracle. La configuración queda en `.env.local`, excluido de Git.

Para detener ambos procesos:

```powershell
.\stop-marketing.ps1
```

## Separación de aplicaciones

- Marketing se publica en la raíz de su dominio: `https://nexoskill.com`.
- La plataforma se publica de forma independiente: `https://app.nexoskill.com`.
- En local, el botón **Iniciar sesión** dirige a `http://localhost:5173/evaluaciones/dashboard`.

## Backend y Oracle

Endpoints:

- `POST /api/v1/leads/contact`
- `POST /api/v1/leads/demo`
- `POST /api/v1/leads/quote`
- `POST /api/v1/leads/advisory`
- `POST /api/v1/leads/bootcamp`
- `GET /actuator/health`

Objetos Oracle aislados:

- `MKT_PROSPECT`
- `MKT_PROSPECT_SEQ`
- `MKT_FLYWAY_HISTORY`

Aunque técnicamente puede compartir esquema, en producción se recomienda un usuario Oracle de aplicación con privilegios mínimos y no utilizar `SYSTEM`.

## Analítica y consentimiento

La analítica está desactivada por defecto. Para habilitarla configura uno de estos identificadores y activa la bandera:

```env
VITE_ENABLE_ANALYTICS=true
VITE_GTM_ID=GTM-XXXXXXX
# o
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Los scripts de medición no se cargan hasta que la persona acepta la analítica opcional.

## Correo

Los prospectos se guardan en Oracle aunque SMTP esté desactivado. Para evitar que Actuator marque el servicio como no saludable mientras no exista SMTP:

```env
MAIL_ENABLED=false
MAIL_HEALTH_ENABLED=false
```

## Validación

```powershell
npm test
npm run build
cd backend
mvn test
mvn clean package
```

## Docker y producción

Consulta [`DEPLOYMENT.md`](DEPLOYMENT.md). Para desarrollo:

```powershell
docker compose up --build
```
