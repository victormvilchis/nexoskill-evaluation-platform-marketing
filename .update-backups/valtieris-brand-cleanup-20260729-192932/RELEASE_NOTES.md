# Valtieris Marketing 1.1.0 Parte 1

## Conversión, atribución y consentimiento

Esta entrega agrega medición comercial y atribución de campañas sin incorporar paneles administrativos ni mezclar código con la plataforma principal.

### Mejora del flujo de formularios

- El enlace al aviso de privacidad dentro de los formularios abre un modal y no abandona la solicitud en curso.
- Los valores capturados se conservan al abrir y cerrar el aviso.
- Se mantiene la ruta pública `/aviso-de-privacidad` para navegación legal desde el footer y acceso directo.
- El modal incluye control de foco, cierre con teclado, bloqueo de scroll y presentación responsiva.

### Incluye

- Captura de `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term`.
- Captura de `gclid`, `fbclid`, `msclkid` y `li_fat_id`.
- Conservación temporal de la atribución mediante `sessionStorage`.
- Registro de página de entrada, referente externo y página de conversión.
- Persistencia Oracle mediante `V2__add_marketing_attribution.sql`.
- Registro del estado de consentimiento analítico junto con la solicitud.
- Eventos normalizados para CTA, tecnologías, servicios, planes y formularios.
- Analítica externa bloqueada hasta obtener consentimiento explícito.
- Revocación de analítica y limpieza de cookies conocidas cuando se rechaza.
- Aviso de privacidad actualizado.
- Correos comerciales enriquecidos con campaña y contexto de conversión.
- Pruebas unitarias, E2E y backend para atribución.

### No incluye

- Panel de prospectos o cotizaciones.
- Login o administración comercial.
- Activación automática de Google Analytics o Google Tag Manager.
- Dominio, DNS, servidor, certificado TLS o SMTP productivo.

### Migración Oracle

Flyway aplicará automáticamente:

```text
V2__add_marketing_attribution.sql
```

La migración conserva todos los registros actuales y únicamente agrega columnas e índice de campaña.

## Ajuste comercial de planes

- Starter tecnológico: 15 asientos activos y contenido creado por la organización.
- Professional Academy: 25 asientos activos y banco de preguntas de una tecnología.
- Business Talent: 40 asientos activos, hasta cuatro tecnologías, gestión de certificaciones y seguimiento de estudiantes y colaboradores.
- Enterprise: asientos personalizados, catálogo tecnológico amplio, configuración de certificaciones por organización y seguimiento de múltiples academias, áreas o programas.
- Se eliminan de Enterprise las referencias a integraciones, SSO, API, identidad visual y condiciones de servicio como capacidades exclusivas.
- La configuración inicial, la identidad visual y el acompañamiento de adopción se ofrecen en todos los planes.
- Los enlaces anteriores con `plan=business-certification` se normalizan a `business-talent`.
