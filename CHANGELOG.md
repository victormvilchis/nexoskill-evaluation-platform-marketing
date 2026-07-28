# Changelog

## [1.0.1] - 2026-07-27
- Corrige `stop-marketing.ps1` para compatibilidad con Windows PowerShell 5.1 al validar procesos por ruta sin usar la sobrecarga no disponible de `String.Contains`.

### Added

- Validación de configuración productiva y placeholders.
- Scripts de preflight, deploy, update, rollback, status y stop.
- Plantillas Data Pump para objetos Oracle `MKT_*`.
- Runbook operativo y documentación de deployment readiness.
- Manifiesto de artefactos con hashes SHA-256.

### Changed

- Nginx productivo ahora utiliza una imagen sin privilegios y escucha en `8080`.
- Docker Compose productivo restringe capacidades, filesystem y exposición de puertos.
- Health check del backend utiliza readiness.
- Frontend, backend y Actuator se homologaron a `1.0.1`.

### Security

- El perfil productivo valida URL Oracle, contraseña, usuario aplicativo, salt y CORS HTTPS.
- Se incorporó rotación de logs y metadatos de commit/build.

## [1.0.0] - 2026-07-27

Primera versión estable del sitio comercial de NexoSkill.
