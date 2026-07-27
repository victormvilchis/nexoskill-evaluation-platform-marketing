# Changelog

Todos los cambios relevantes de NexoSkill Marketing se documentan en este archivo.

## Corrección RC1 r2 — contraste y navegación móvil

- Corrige contraste WCAG AA en los niveles de las tarjetas de tecnologías de la Home.
- Corrige el color de las listas en la tarjeta destacada de servicios.
- Adapta la prueba del dropdown de Soluciones para escritorio y navegación móvil.
- Agrega una prueba de regresión para evitar reintroducir estos errores.

## [1.0.0-rc.1]

### Correcciones de validación local Playwright

- Chrome instalado localmente se utiliza como canal de ejecución cuando no se está en CI.
- La grabación de video se desactiva localmente para evitar dependencia de FFmpeg; permanece activa en CI.
- La prueba 404 valida el contenido semántico real de la página.
- El backdrop móvil deja de exponerse como un segundo botón accesible.
- El diagnóstico de Java evita falsos `NativeCommandError` en PowerShell.
 - 2026-07-27

### Agregado

- Pruebas E2E con Playwright para navegación, formularios, 404 y móvil.
- Auditoría automática de accesibilidad con axe-core.
- GitHub Actions para frontend, backend y protección del repositorio.
- Perfiles Spring Boot `local` y `prod`.
- Identificador de correlación por solicitud y contrato de error estable.
- Scripts `.cmd` y validaciones operativas previas al arranque.
- Mailpit opcional para verificar correos en desarrollo.
- Documentación y checklist de Release Candidate.

### Cambiado

- Versión homologada en frontend y backend.
- Inicio local con validación explícita de herramientas, puertos, Oracle y variables.
- Configuración productiva con fail-fast para secretos y orígenes inseguros.

### Seguridad

- Validación para impedir el uso de `SYSTEM` como usuario productivo.
- Protección CI contra credenciales y archivos `.env` versionados.
