# Seguridad

## Reporte responsable

No publiques credenciales, datos personales de prospectos ni detalles explotables en issues públicos. Utiliza un canal privado del propietario del repositorio.

## Controles de despliegue

- `.env.production` no se versiona y debe tener permisos `600`.
- El perfil `prod` rechaza `SYSTEM`, `SYS`, contraseñas débiles, salts cortas, CORS HTTP y placeholders.
- El backend productivo no publica `8081` al host.
- Oracle `1521` no debe exponerse a internet.
- Los contenedores productivos eliminan capacidades Linux, usan filesystem de solo lectura y `no-new-privileges`.
- El frontend debe colocarse detrás de TLS antes de publicarse.
- `ORACLE_DATAPUMP_CONNECT` debe utilizar Oracle Wallet cuando sea posible.

## Secretos

Los archivos `.env`, `.env.local` y `.env.production` no deben versionarse. Las credenciales compartidas durante desarrollo deben rotarse antes de cualquier instalación.
