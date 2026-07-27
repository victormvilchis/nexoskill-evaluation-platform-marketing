# Despliegue de NexoSkill Marketing

## Arquitectura recomendada

- `https://nexoskill.com`: sitio público y reverse proxy de `/api`.
- `https://app.nexoskill.com`: plataforma de evaluaciones independiente.
- Oracle compartido a nivel de instancia, con objetos de marketing aislados mediante el prefijo `MKT_` y una tabla Flyway propia.

Una caída de la plataforma de evaluaciones no debe impedir que el sitio público cargue.

## Requisitos

- Docker Engine y Docker Compose, o Node.js 22, Java 21 y Maven 3.9.
- Acceso a Oracle mediante un usuario de aplicación; no usar `SYSTEM` en producción.
- DNS y certificado TLS gestionados por el reverse proxy del host.

## Configuración

1. Copiar `.env.production.example` a `.env.production`.
2. Configurar identidad jurídica, domicilio, correos y URL pública del sitio.
3. Configurar `DB_URL`, usuario, contraseña e `IP_HASH_SALT` fuerte.
4. Mantener `VITE_ENABLE_ANALYTICS=false` hasta validar consentimiento y los identificadores de analítica.
5. Mantener `MAIL_HEALTH_ENABLED=false` si SMTP no está configurado.

## Ejecución

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

## Verificaciones

```bash
curl -fsS http://127.0.0.1:8080/health
docker compose --env-file .env.production -f docker-compose.production.yml exec marketing-api curl -fsS http://127.0.0.1:8081/actuator/health
```

El endpoint Actuator se conserva en el backend, pero no debe exponerse públicamente mediante el reverse proxy externo salvo que exista una regla de acceso restringida.

## Seguridad operativa

- Rotar contraseñas y secretos fuera del repositorio.
- Ejecutar Oracle con un usuario de privilegios mínimos.
- Respaldar `MKT_PROSPECT` y `MKT_FLYWAY_HISTORY`.
- Revisar dependencias y construir imágenes periódicamente.
- Validar CSP, CORS, TLS y encabezados en el dominio final.
