# Deployment Readiness 1.0.1

Esta versión prepara el repositorio para una instalación productiva sin fijar dominio, DNS, proveedor de hosting ni SMTP. Los valores definitivos permanecen en `.env.production`, que no se versiona.

## Alcance

- Frontend React compilado y servido por Nginx sin privilegios.
- API Spring Boot ejecutada con usuario no privilegiado.
- API accesible únicamente dentro de la red de Docker.
- Sitio publicado en `127.0.0.1:8080` por defecto para colocarlo detrás de un reverse proxy externo.
- Health checks de frontend y readiness del backend.
- Rotación de logs de contenedores.
- Validación estricta de variables productivas.
- Despliegue, actualización, rollback y estado mediante scripts.
- Plantillas para respaldo y restauración de objetos Oracle `MKT_*` con Data Pump.

## Antes de contar con dominio

No ejecutes el perfil `prod` con los placeholders de `.env.production.example`. Copia el archivo y conserva la configuración sin activar hasta disponer de:

- endpoint HTTPS definitivo;
- servidor con Docker Compose;
- conectividad hacia Oracle;
- secretos rotados;
- reverse proxy o balanceador.

La preparación puede validarse con:

```bash
npm run deployment:validate
npm run deployment:check
```

## Archivos operativos

```text
docker-compose.production.yml
.env.production.example
scripts/deployment/preflight.sh
scripts/deployment/deploy.sh
scripts/deployment/update.sh
scripts/deployment/rollback.sh
scripts/deployment/status.sh
scripts/deployment/stop.sh
scripts/deployment/backup-oracle.sh
scripts/deployment/restore-oracle.sh
```

## Primer despliegue

```bash
cp .env.production.example .env.production
chmod 600 .env.production
# Completar todos los valores reales.
./scripts/deployment/preflight.sh
./scripts/deployment/deploy.sh
```

El frontend quedará disponible en:

```text
http://127.0.0.1:8080
```

El backend no publica el puerto `8081` al host.

## Actualización

Utiliza un tag de imagen único por versión o commit en `MARKETING_IMAGE_TAG` y ejecuta:

```bash
./scripts/deployment/update.sh
```

El script conserva la versión previa en `.deploy/previous.env`.

## Rollback

```bash
./scripts/deployment/rollback.sh
```

El rollback cambia las imágenes de frontend y backend. No revierte migraciones ni datos Oracle.
