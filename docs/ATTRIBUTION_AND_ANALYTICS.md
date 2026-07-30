# Atribución comercial y analítica

## Objetivo

Valtieris Marketing captura el contexto de campaña que originó una solicitud comercial sin activar herramientas externas de analítica. Los parámetros se conservan temporalmente en `sessionStorage` y se envían únicamente cuando la persona completa un formulario.

## Parámetros admitidos

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`
- `msclkid`
- `li_fat_id`

También se registra, cuando está disponible:

- referente externo;
- página de entrada;
- página de conversión;
- fecha de captura;
- estado del consentimiento analítico.

## Ejemplo de campaña

```text
http://localhost:5174/solicitar-demo?utm_source=linkedin&utm_medium=social&utm_campaign=java_backend_2026&utm_content=hero_demo
```

Al enviar el formulario, la API persiste el contexto en `MKT_PROSPECT` mediante las columnas `UTM_*`, `LANDING_PAGE`, `CONVERSION_PAGE`, `REFERRER_URL`, `CLICK_ID` y `ANALYTICS_CONSENT`.

## Consentimiento

La atribución del formulario y la analítica externa son mecanismos distintos:

- La atribución de campaña se utiliza para contextualizar la solicitud enviada.
- Google Analytics o Google Tag Manager permanecen desactivados mientras `VITE_ENABLE_ANALYTICS=false`.
- Cuando la analítica está configurada, el script externo solo se carga después de consentimiento explícito.
- Rechazar la analítica no impide navegar ni enviar formularios.

## Eventos normalizados

- `page_view`
- `demo_cta_click`
- `quote_cta_click`
- `contact_cta_click`
- `plans_click`
- `technology_click`
- `service_click`
- `lead_form_start`
- `lead_form_validation_error`
- `lead_submit_attempt`
- `lead_submit_success`
- `lead_submit_error`
- `plan_select`
- `analytics_consent_update`

Los eventos no incluyen nombre, correo, teléfono, empresa ni el mensaje escrito en el formulario.
