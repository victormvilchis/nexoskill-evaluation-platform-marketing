# Seguridad

## Reporte responsable

No publiques credenciales, datos personales de prospectos ni detalles explotables en issues públicos. Utiliza un canal privado del propietario del repositorio para reportar vulnerabilidades.

Incluye:

- Versión o commit afectado.
- Descripción del impacto.
- Pasos mínimos para reproducir.
- Evidencia sin datos personales ni secretos.
- Mitigación propuesta, cuando exista.

## Alcance sensible

- Formularios y API `/api/v1/leads/*`.
- Persistencia Oracle `MKT_*`.
- Configuración CORS, CSP y reverse proxy.
- SMTP y datos de contacto.
- Scripts de despliegue y variables de ambiente.

## Secretos

Los archivos `.env`, `.env.local` y `.env.production` no deben versionarse. Las credenciales compartidas durante desarrollo deben rotarse antes de publicar.
