# NexoSkill Marketing Website

Sitio público y comercial de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform`.

## Puertos locales

- Sitio de marketing: `http://localhost:5174`
- API de prospectos: `http://localhost:8081`
- Plataforma administrativa existente: `http://localhost:5173/evaluaciones/admin/students`

## Requisitos

- Node.js 22.12 o superior.
- npm 10 o superior.
- Java 21.
- Maven 3.9 o superior.
- Acceso a la instancia Oracle utilizada por la plataforma.

## Inicio local

Ejecuta:

```powershell
.\start-marketing.ps1
```

En la primera ejecución se solicitarán:

- URL JDBC de Oracle.
- Usuario/esquema Oracle.
- Contraseña Oracle.

La configuración se guarda en `.env.local`, archivo excluido de Git. El backend crea únicamente objetos con prefijo `MKT_`, por lo que puede utilizar la misma instancia y el mismo esquema de la plataforma sin reutilizar sus tablas.

Para detener ambos procesos:

```powershell
.\stop-marketing.ps1
```

## Backend

El backend Spring Boot expone:

- `POST /api/v1/leads/contact`
- `POST /api/v1/leads/demo`
- `POST /api/v1/leads/quote`
- `POST /api/v1/leads/advisory`
- `POST /api/v1/leads/bootcamp`
- `GET /actuator/health`

La migración Oracle crea:

- `MKT_PROSPECT`
- `MKT_PROSPECT_SEQ`
- `MKT_FLYWAY_HISTORY`

## Correo

Los prospectos siempre se guardan en Oracle. El correo es opcional y está desactivado inicialmente. Para habilitarlo configura en `.env.local`:

```env
MAIL_ENABLED=true
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
MAIL_STARTTLS_REQUIRED=true
MAIL_FROM=no-reply@example.com
CONTACT_RECIPIENT=ventas@example.com
```

## Validación

Frontend:

```powershell
npm test
npm run build
```

Backend:

```powershell
cd backend
mvn test
mvn package
```

## Docker

Docker Compose no levanta una base de datos adicional; utiliza la instancia Oracle configurada por variables de entorno:

```powershell
docker compose up --build
```

El sitio queda en `http://localhost:8080` y la API en `http://localhost:8081`.
