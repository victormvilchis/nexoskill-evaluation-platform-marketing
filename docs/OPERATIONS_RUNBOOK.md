# Runbook operativo

## Estado

```bash
./scripts/deployment/status.sh
```

## Logs

```bash
docker compose --env-file .env.production -f docker-compose.production.yml logs -f --tail=200 marketing-api
docker compose --env-file .env.production -f docker-compose.production.yml logs -f --tail=200 marketing-web
```

Los logs de Docker se limitan mediante `LOG_MAX_SIZE` y `LOG_MAX_FILES`.

## Health checks

```bash
curl -fsS http://127.0.0.1:8080/health

docker compose --env-file .env.production -f docker-compose.production.yml exec marketing-api \
  curl -fsS http://127.0.0.1:8081/actuator/health/readiness
```

## Detener

```bash
./scripts/deployment/stop.sh
```

No utilices `docker compose down -v`; la solución no administra Oracle, pero esa práctica puede eliminar otros volúmenes del proyecto si se agregan posteriormente.

## Incidente de formularios

1. Obtén el `X-Request-Id` mostrado por el frontend o por la respuesta HTTP.
2. Busca el identificador en los logs del backend.
3. Valida la conectividad Oracle y el estado de `MKT_FLYWAY_HISTORY`.
4. No copies datos personales completos en tickets públicos.

## Actualización fallida

1. Revisa `docker compose ps` y los últimos logs.
2. Si el frontend o backend no alcanza health, ejecuta `rollback.sh`.
3. No modifiques manualmente las tablas Flyway.
4. Conserva el dump Oracle y los logs antes de realizar cambios correctivos.
