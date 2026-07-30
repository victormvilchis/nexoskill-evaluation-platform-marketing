# Checklist Valtieris Marketing 1.0.0 RC1

## Código

- [ ] `npm run check` finaliza correctamente.
- [ ] `npm run test:e2e -- --project=chromium` finaliza correctamente.
- [ ] Firefox y WebKit se validan al menos una vez antes de producción.
- [ ] `mvn -f backend/pom.xml clean verify` finaliza correctamente.
- [ ] No existen errores de consola ni solicitudes 404 inesperadas.
- [ ] No existe scroll horizontal en 320, 375, 768, 1024, 1280 y 1440 px.

## Formularios

- [ ] Contacto guarda un registro `CONTACT`.
- [ ] Demo guarda un registro `DEMO`.
- [ ] Cotización guarda un registro `QUOTE` con `PLAN_ID`.
- [ ] Asesoría guarda un registro `ADVISORY`.
- [ ] Bootcamp guarda un registro `BOOTCAMP`.
- [ ] Se validaron carga, doble envío, error, reintento y confirmación.
- [ ] Rate limit, duplicados y honeypot funcionan.

## Oracle

- [ ] El usuario es aplicativo y no `SYSTEM`/`SYS`.
- [ ] `MKT_FLYWAY_HISTORY` está en versión esperada.
- [ ] Se confirmó respaldo de `MKT_PROSPECT`.
- [ ] Se probó la restauración en un ambiente controlado.

## Seguridad y legal

- [ ] Se rotaron contraseñas compartidas durante desarrollo.
- [ ] `.env.production` no está versionado.
- [ ] `IP_HASH_SALT` tiene al menos 32 caracteres.
- [ ] CORS contiene únicamente el dominio HTTPS final.
- [ ] Aviso de privacidad contiene responsable, domicilio y correo reales.
- [ ] Términos y medios de contacto fueron revisados.

## Operación

- [ ] Dominio y DNS resuelven al servidor.
- [ ] HTTPS es válido y se renueva automáticamente.
- [ ] SMTP real envía notificación interna y confirmación.
- [ ] Health checks están en `UP`.
- [ ] Logs no contienen datos personales ni secretos.
- [ ] Existe procedimiento de rollback.
