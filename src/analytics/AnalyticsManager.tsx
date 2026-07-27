import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackEvent, trackPageView } from './analytics';

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
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-analytics-event]') : null;
      if (!target) return;
      trackEvent(target.dataset.analyticsEvent || 'cta_click', {
        label: target.dataset.analyticsLabel || target.textContent?.trim().slice(0, 120),
        destination: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
