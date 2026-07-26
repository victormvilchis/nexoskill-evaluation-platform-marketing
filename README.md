# NexoSkill Marketing Website

Sitio público, comercial e institucional de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform`.

## Versión

`0.1.0 Parte 3 — Catálogo de tecnologías`

Esta entrega incluye:

- Home comercial y navegación responsiva.
- Páginas completas de Plataforma y servicios.
- Catálogo de 10 especialidades tecnológicas públicas.
- Búsqueda y filtro por área tecnológica.
- Páginas individuales mediante `/tecnologias/:slug`.
- Competencias, niveles, modalidades y rutas por especialidad.
- Programas relacionados y preguntas frecuentes por tecnología.
- SEO individual y sitemap actualizado.
- Contenido original sin referencias a tecnologías internas ni afiliaciones no autorizadas.
- Pruebas automáticas de rutas, contenido y estructura tecnológica.

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
