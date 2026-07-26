# NexoSkill Marketing Website

Sitio público, comercial e institucional de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform`.

## Versión

`0.1.0 Parte 2 — Plataforma y servicios`

Esta entrega incluye:

- Home comercial y navegación responsiva.
- Catálogo tecnológico basado únicamente en tecnologías públicas.
- Página completa de Plataforma.
- Página completa de Bootcamps.
- Página completa de Capacitaciones.
- Página completa de Asesorías.
- Página completa de Evaluación de talento.
- Componentes reutilizables para páginas comerciales.
- Pruebas que bloquean referencias a tecnologías o marcas internas.

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
