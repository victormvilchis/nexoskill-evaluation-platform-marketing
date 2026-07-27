import { siteConfig } from '../seo/siteConfig';

export type AnalyticsConsent = 'granted' | 'denied' | 'unset';

const CONSENT_KEY = 'nexoskill.analytics-consent.v1';
const SCRIPT_ID = 'nexoskill-analytics-script';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const analyticsConsentKey = CONSENT_KEY;

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unset';
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : 'unset';
}

export function storeAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'unset'>) {
  window.localStorage.setItem(CONSENT_KEY, consent);
  window.dispatchEvent(new CustomEvent('nexoskill:analytics-consent', { detail: consent }));
  if (consent === 'granted') initializeAnalytics();
}

export function analyticsIsConfigured() {
  return siteConfig.analytics.enabled && Boolean(siteConfig.analytics.gtmId || siteConfig.analytics.gaMeasurementId);
}

export function initializeAnalytics() {
  if (typeof document === 'undefined' || !analyticsIsConfigured() || readAnalyticsConsent() !== 'granted') return;
  if (document.getElementById(SCRIPT_ID)) return;

  window.dataLayer = window.dataLayer || [];

  if (siteConfig.analytics.gtmId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(siteConfig.analytics.gtmId)}`;
    document.head.appendChild(script);
    return;
  }

  const measurementId = siteConfig.analytics.gaMeasurementId;
  if (!measurementId) return;
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false, anonymize_ip: true });
}

export function trackEvent(name: string, parameters: Record<string, string | number | boolean | undefined> = {}) {
  if (!analyticsIsConfigured() || readAnalyticsConsent() !== 'granted') return;
  const cleanParameters = Object.fromEntries(Object.entries(parameters).filter(([, value]) => value !== undefined));
  if (siteConfig.analytics.gtmId) {
    window.dataLayer?.push({ event: name, ...cleanParameters });
    return;
  }
  window.gtag?.('event', name, cleanParameters);
}

export function trackPageView(path: string, title: string) {
  trackEvent('page_view', {
    page_location: new URL(path, siteConfig.siteUrl).toString(),
    page_path: path,
    page_title: title,
  });
}
