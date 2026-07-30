import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackEvent, trackPageView } from './analytics';

type ClickEventDefinition = {
  name: string;
  category?: string;
};

function inferClickEvent(target: HTMLElement): ClickEventDefinition | null {
  const explicitName = target.dataset.analyticsEvent;
  if (explicitName) return { name: explicitName, category: target.dataset.analyticsCategory };

  if (!(target instanceof HTMLAnchorElement)) return null;
  let destination: URL;
  try {
    destination = new URL(target.href, window.location.origin);
  } catch {
    return null;
  }

  if (destination.origin !== window.location.origin) return { name: 'outbound_link_click', category: 'outbound' };

  const path = destination.pathname;
  if (path === '/solicitar-demo') return { name: 'demo_cta_click', category: 'conversion' };
  if (path === '/solicitar-cotizacion') return { name: 'quote_cta_click', category: 'conversion' };
  if (path === '/contacto') return { name: 'contact_cta_click', category: 'conversion' };
  if (path === '/planes') return { name: 'plans_click', category: 'consideration' };
  if (path.startsWith('/tecnologias/')) return { name: 'technology_click', category: 'consideration' };
  if (['/plataforma', '/bootcamps', '/capacitaciones', '/asesorias', '/empresas'].includes(path)) {
    return { name: 'service_click', category: 'consideration' };
  }
  return null;
}

export function AnalyticsManager() {
  const location = useLocation();

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => trackPageView(`${location.pathname}${location.search}`, document.title));
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('a, button, [data-analytics-event]')
        : null;
      if (!target) return;

      const definition = inferClickEvent(target);
      if (!definition) return;

      trackEvent(definition.name, {
        event_category: definition.category,
        label: target.dataset.analyticsLabel || target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120),
        destination: target instanceof HTMLAnchorElement ? target.href : undefined,
        page_path: `${window.location.pathname}${window.location.search}`,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
