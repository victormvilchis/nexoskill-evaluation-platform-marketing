import { useEffect } from 'react';
import { siteConfig } from './siteConfig';
import { breadcrumbSchema, organizationSchema, websiteSchema, type StructuredData } from './structuredData';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
  keywords?: string[];
  structuredData?: StructuredData | StructuredData[];
}

const ensureMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
};

const ensureLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
};

export function Seo({ title, description, path = '/', noIndex = false, image = '/og-image.png', keywords = [], structuredData }: SeoProps) {
  useEffect(() => {
    const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
    const canonicalUrl = new URL(path, siteConfig.siteUrl).toString();
    const imageUrl = new URL(image, siteConfig.siteUrl).toString();
    document.title = fullTitle;

    ensureMeta('meta[name="description"]', { name: 'description', content: description });
    ensureMeta('meta[name="robots"]', { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
    ensureMeta('meta[name="googlebot"]', { name: 'googlebot', content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
    if (keywords.length) {
      ensureMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
    } else {
      document.head.querySelector('meta[name="keywords"]')?.remove();
    }

    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    ensureMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${siteConfig.name}: evaluación y desarrollo de talento tecnológico` });
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteConfig.name });
    ensureMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'es_MX' });

    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

    ensureLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    ensureLink('link[rel="alternate"][hreflang="es-MX"]', { rel: 'alternate', hreflang: 'es-MX', href: canonicalUrl });
    ensureLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl });

    const extra = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];
    const breadcrumb = breadcrumbSchema(path, title);
    const schemas = [organizationSchema(), websiteSchema(), breadcrumb, ...extra].filter(Boolean);
    let script = document.head.querySelector<HTMLScriptElement>('#nexoskill-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'nexoskill-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas);
  }, [description, image, keywords, noIndex, path, structuredData, title]);

  return null;
}
