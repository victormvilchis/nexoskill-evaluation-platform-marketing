# NexoSkill Marketing 1.0.1

## Deployment Readiness

Esta versión no agrega páginas ni funcionalidades comerciales. Su objetivo es dejar la versión estable `1.0.0` preparada para una instalación futura cuando exista infraestructura.

### Incluye

- Versiones frontend, backend y Actuator homologadas en `1.0.1`.
- Nginx ejecutado mediante imagen sin privilegios y puerto interno `8080`.
- Backend sin puerto público en Docker Compose productivo.
- Contenedores con filesystem de solo lectura, `cap_drop`, health checks y rotación de logs.
- Readiness de Spring Boot para validar dependencias antes de publicar tráfico.
- Validación estricta de variables productivas y rechazo de placeholders.
- Scripts Linux de preflight, despliegue, actualización, rollback, estado y apagado.
- Plantillas Data Pump para respaldo y restauración de objetos `MKT_*`.
- Manifiesto SHA-256 de artefactos generados.
- Documentación de operación, incidentes y rollback.

### No incluye

- Dominio, DNS o certificado TLS.
- Servidor o proveedor de hosting.
- Credenciales Oracle o SMTP.
- Cambios de esquema o migraciones nuevas.
- Panel de administración comercial.

## Corrección de compatibilidad

- Compatibilidad corregida con Windows PowerShell 5.1 en el apagado seguro de procesos de marketing.
