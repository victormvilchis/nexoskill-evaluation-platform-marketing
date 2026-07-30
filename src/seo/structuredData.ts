import { siteConfig } from './siteConfig';

export type StructuredData = Record<string, unknown>;

export const organizationSchema = (): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  logo: new URL('/icon-512.png', siteConfig.siteUrl).toString(),
  description: siteConfig.description,
  email: siteConfig.contactEmail || undefined,
});

export const websiteSchema = (): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  inLanguage: 'es-MX',
});

export const breadcrumbSchema = (path: string, title: string): StructuredData | null => {
  if (path === '/') return null;
  const segments = path.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    plataforma: 'Plataforma', tecnologias: 'Tecnologías', bootcamps: 'Bootcamps', capacitaciones: 'Capacitaciones',
    asesorias: 'Asesorías', planes: 'Planes', empresas: 'Empresas', nosotros: 'Nosotros', contacto: 'Contacto',
    'solicitar-demo': 'Solicitar demo', 'solicitar-cotizacion': 'Solicitar cotización', 'preguntas-frecuentes': 'Preguntas frecuentes',
    'aviso-de-privacidad': 'Aviso de privacidad', 'terminos-y-condiciones': 'Términos y condiciones',
  };
  const items = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.siteUrl }];
  segments.forEach((segment, index) => {
    const partial = `/${segments.slice(0, index + 1).join('/')}`;
    items.push({ '@type': 'ListItem', position: index + 2, name: index === segments.length - 1 ? title : labels[segment] || segment, item: new URL(partial, siteConfig.siteUrl).toString() });
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
};

export const faqSchema = (items: Array<{ question: string; answer: string }>): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

export const serviceSchema = (name: string, description: string, path: string, audience?: string[]): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: new URL(path, siteConfig.siteUrl).toString(),
  provider: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.siteUrl },
  audience: audience?.map((audienceType) => ({ '@type': 'Audience', audienceType })),
  areaServed: 'MX',
});
