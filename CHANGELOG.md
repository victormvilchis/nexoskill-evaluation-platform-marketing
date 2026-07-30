# Changelog

## [1.1.0] - 2026-07-28

### Added

- Atribución UTM y click IDs conservada durante la sesión.
- Eventos normalizados de conversión para navegación, CTA y formularios.
- Migración Oracle `V2__add_marketing_attribution.sql`.
- Persistencia de referente, landing, página de conversión y consentimiento analítico.
- Documentación de campañas y privacidad.

### Rebranding Valtieris

- La marca pública cambia de NexoSkill a **Valtieris**.
- Se incorporan logotipo horizontal, variante inversa, símbolo, favicon, iconos PWA y Open Graph.
- El sistema visual adopta navy profundo, azul ejecutivo y teal con superficies claras.
- Header, hero, navegación, tarjetas, formularios, planes, CTA y footer quedan homologados.
- SEO, manifest, JSON-LD, correos y metadatos del backend utilizan Valtieris.
- Los identificadores técnicos compatibles, paquetes Java y objetos Oracle `MKT_*` se conservan para evitar una migración disruptiva.

### Changed

- Frontend, backend, Docker y Actuator homologados a `1.1.0`.
- El correo interno muestra contexto de campaña.
- El aviso de privacidad explica atribución y analítica opcional.

### Privacy

- Las herramientas externas permanecen bloqueadas hasta consentimiento explícito.
- Los eventos no incluyen datos personales de los formularios.

### Ajuste comercial de planes

- Starter tecnológico incluye 15 asientos activos y opera con contenido propio.
- Professional Academy incluye 25 asientos activos y un banco de preguntas de una tecnología.
- Business Certification cambia a Business Talent, con 40 asientos activos y contenido de hasta cuatro tecnologías.
- La gestión de certificaciones y el seguimiento integral de estudiantes y colaboradores se habilitan desde Business Talent.
- Enterprise mantiene asientos personalizados, catálogo tecnológico amplio y seguimiento de múltiples academias, áreas o programas.
- Se eliminan de Enterprise las referencias a integraciones, SSO, API, identidad visual y condiciones de servicio como beneficios exclusivos.
- La configuración inicial, la identidad visual y el acompañamiento de adopción quedan disponibles para todos los planes.

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

Primera versión estable del sitio comercial de Valtieris.

### Corregido

- Inicio y apagado local mediante PID independientes para frontend y backend.
- Limpieza de PID obsoletos y validación del árbol de procesos antes de finalizar servicios.
- Codificación UTF-8 con BOM en scripts PowerShell para Windows PowerShell 5.1.

### Ajuste comercial de planes

- La definición inicial de planes fue sustituida por el modelo comercial vigente documentado en la versión 1.1.0.
