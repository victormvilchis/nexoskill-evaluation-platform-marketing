# NexoSkill Marketing Website

Sitio público, comercial e institucional de NexoSkill. Este repositorio es independiente de `nexoskill-evaluation-platform`.

## Versión

`0.1.0 Parte 1 — Base del sitio comercial`

## URLs previstas

- Sitio de marketing: `http://localhost:5174/`
- Plataforma administrativa: `http://localhost:5173/evaluaciones/admin/students`

El sitio de marketing se ejecuta de forma independiente en el puerto `5174`. El botón **Iniciar sesión** dirige a `http://localhost:5173/evaluaciones/admin/students`.

> En desarrollo local, el sitio de marketing usa `5174` y la plataforma administrativa puede permanecer activa en `5173`.

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
3. Inicia el sitio en `http://localhost:5174/`.

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
