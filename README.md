# NexoSkill Marketing Website

Sitio público, comercial e institucional de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform`.

## Versión

`0.1.0 Parte 4 — Planes comerciales`

Esta entrega incluye:

- Home comercial y navegación responsiva.
- Páginas completas de Plataforma y servicios.
- Catálogo de 10 especialidades tecnológicas públicas.
- Página completa de planes comerciales.
- Cuatro planes centralizados y configurables.
- Comparación de capacidad, tecnologías, roles, reportes, sustituciones y soporte.
- Preguntas frecuentes generales y de contratación.
- Solicitud de cotización con validaciones y preparación de correo real.
- SEO y sitemap actualizados.
- Contenido original sin referencias a tecnologías internas ni afiliaciones no autorizadas.
- Pruebas automáticas de rutas, contenido, tecnologías y planes.


## URLs locales

- Sitio de marketing: `http://localhost:5174/`
- Plataforma administrativa: `http://localhost:5173/evaluaciones/admin/students`

El sitio de marketing se ejecuta de forma independiente en el puerto `5174`. El botón **Iniciar sesión** dirige a la plataforma administrativa configurada mediante `VITE_PLATFORM_URL`.

## Instalación y ejecución en Windows

Descomprime el ZIP directamente dentro de:

```text
C:\xampp\htdocs\nexoskill-evaluation-platform-marketing
```

Después ejecuta únicamente:

```powershell
.\start-marketing.ps1
```

También puedes abrir `iniciar-marketing.cmd` con doble clic.

El script:

1. Utiliza la configuración `.env` incluida.
2. Instala dependencias únicamente cuando no existe `node_modules`.
3. Limpia la caché de Vite.
4. Inicia el sitio en `http://localhost:5174/`.

## Validaciones opcionales

```powershell
npm test
npm run build
```

## Stack

- React 19.
- TypeScript estricto.
- Vite 8.
- React Router.
- CSS propio.
- Docker y Nginx para despliegue posterior.
