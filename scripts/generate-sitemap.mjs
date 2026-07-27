import { readFile, writeFile } from 'node:fs/promises';

const baseUrl = (process.env.VITE_SITE_URL || 'https://nexoskill.com').replace(/\/$/, '');
const technologySource = await readFile(new URL('../src/content/technologies.ts', import.meta.url), 'utf8');
const slugs = [...technologySource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
const staticRoutes = [
  '/', '/plataforma', '/tecnologias', '/bootcamps', '/capacitaciones', '/asesorias', '/planes', '/empresas',
  '/nosotros', '/contacto', '/solicitar-demo', '/solicitar-cotizacion', '/preguntas-frecuentes',
  '/aviso-de-privacidad', '/terminos-y-condiciones',
];
const routes = [...staticRoutes, ...slugs.map((slug) => `/tecnologias/${slug}`)];
const lastModified = new Date().toISOString().slice(0, 10);
const priority = (route) => route === '/' ? '1.0' : route.startsWith('/tecnologias/') ? '0.7' : '0.8';
const changeFrequency = (route) => route === '/' ? 'weekly' : 'monthly';
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url>\n    <loc>${baseUrl}${route === '/' ? '/' : route}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>${changeFrequency(route)}</changefreq>\n    <priority>${priority(route)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`Sitemap generado con ${routes.length} rutas.`);
