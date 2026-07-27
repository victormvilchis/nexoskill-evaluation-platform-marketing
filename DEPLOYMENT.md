# Despliegue de NexoSkill Marketing

## Arquitectura objetivo

- `https://nexoskill.com`: sitio público y reverse proxy de `/api`.
- Backend de marketing accesible solo dentro de la red de despliegue.
- Plataforma de evaluaciones independiente, por ejemplo `https://app.nexoskill.com`.
- Oracle compartido a nivel de instancia, con objetos de marketing `MKT_*` y tabla Flyway propia.

Una falla de la plataforma operativa no debe impedir que el sitio comercial cargue.

## Requisitos

- Docker Engine y Docker Compose, o Node.js 22, Java 21 y Maven 3.9.
- Usuario aplicativo Oracle con `CREATE SESSION`, cuota y permisos sobre sus propios objetos.
- Reverse proxy con TLS.
- SMTP real cuando se habiliten notificaciones.

## Preparación

1. Copia `.env.production.example` a `.env.production`.
2. Configura dominio, identidad jurídica, domicilio y correos.
3. Configura `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `IP_HASH_SALT` de al menos 32 caracteres.
4. Usa un usuario aplicativo como `EVALUATION_APP`; el perfil productivo bloquea `SYSTEM` y `SYS`.
5. Configura `CORS_ALLOWED_ORIGINS` con orígenes HTTPS explícitos y sin comodines.
6. Mantén analítica y correo desactivados hasta contar con identificadores y SMTP reales.
7. Ejecuta `npm run release:check` antes de construir.

## Construcción y ejecución

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

El frontend queda publicado localmente en `127.0.0.1:8080` para que un reverse proxy externo gestione TLS y dominio.

## Verificaciones

```bash
curl -fsS http://127.0.0.1:8080/health
docker compose --env-file .env.production -f docker-compose.production.yml exec marketing-api \
  curl -fsS http://127.0.0.1:8081/actuator/health
```

Prueba funcional de una solicitud desde el dominio candidato y confirma el registro en Oracle:

```sql
SELECT id, request_type, status, email, company, created_at
FROM MKT_PROSPECT
ORDER BY created_at DESC
FETCH FIRST 10 ROWS ONLY;
```

## Seguridad

- No publiques `8081` ni `1521` directamente en internet.
- No versiones `.env.production` ni secretos.
- Rota credenciales utilizadas en desarrollo.
- Restringe CORS al dominio público.
- Mantén `TRUST_FORWARDED_HEADERS=true` solo detrás de un proxy confiable.
- Revisa el encabezado `X-Request-Id` para correlacionar errores sin registrar datos personales.
- Conserva Actuator fuera del reverse proxy público o protégelo mediante reglas de red.

## Oracle

Antes de publicar:

```sql
SELECT USER, SYS_CONTEXT('USERENV', 'CON_NAME') FROM dual;
SELECT object_name, object_type, status
FROM user_objects
WHERE object_name LIKE 'MKT_%';
SELECT installed_rank, version, description, success
FROM MKT_FLYWAY_HISTORY
ORDER BY installed_rank;
```

El respaldo debe incluir al menos `MKT_PROSPECT` y `MKT_FLYWAY_HISTORY`. Documenta y prueba restauración antes de promover RC1 a 1.0.0.

## Rollback

1. Conserva la imagen o artefacto de la versión anterior.
2. No reviertas migraciones Oracle manualmente si contienen datos de prospectos.
3. Restaura el frontend y backend anteriores.
4. Verifica `/health`, Actuator y un envío controlado.
5. Investiga mediante el `X-Request-Id` y los logs del backend.

## Promoción

La RC1 puede promoverse a `1.0.0` únicamente después de completar [`docs/RC1_CHECKLIST.md`](docs/RC1_CHECKLIST.md).
