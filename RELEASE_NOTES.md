## Corrección RC1 r2

Esta revisión corrige los últimos hallazgos reales de Playwright: contraste insuficiente en la Home y una prueba de dropdown que asumía navegación de escritorio en el proyecto móvil.

# NexoSkill Marketing 1.0.0 RC1

Esta versión es un candidato de publicación. No agrega nuevas líneas comerciales; estabiliza la experiencia existente y prepara el proyecto para despliegue.

## Alcance

- Sitio comercial completo y responsivo.
- Formularios persistentes sobre Oracle con objetos `MKT_*`.
- Pruebas E2E y accesibilidad en navegador real.
- Configuración local y productiva separada.
- CI de GitHub para frontend, backend y control de secretos.
- Scripts operativos de inicio, apagado y diagnóstico.

## Condiciones para promover a 1.0.0

- Definir dominio y URL pública.
- Configurar SMTP real y correos legales/comerciales.
- Completar datos jurídicos del aviso de privacidad.
- Ejecutar la suite E2E contra el entorno candidato.
- Confirmar respaldo y restauración de Oracle.
- Rotar todas las credenciales utilizadas durante desarrollo.


## Ajustes correctivos de RC1

- Ejecución local de Playwright sobre Google Chrome instalado.
- Video local deshabilitado para no requerir FFmpeg.
- Prueba 404 alineada con la página real.
- Control móvil único y backdrop fuera del árbol accesible.
- Diagnóstico de Java corregido para PowerShell.

## Corrección del pipeline de seguridad

El job `Repository guard` ahora ejecuta `npm run repository:guard`. La validación revisa archivos sensibles y asignaciones reales sin interpretar sus propias expresiones regulares o pruebas como credenciales. Esta corrección no modifica la aplicación, la base de datos ni los contratos de API.
