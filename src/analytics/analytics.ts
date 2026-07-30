import { siteConfig } from '../seo/siteConfig';
import { attributionEventContext } from './attribution';
import { analyticsConsentKey, readAnalyticsConsent, type AnalyticsConsent } from './consent';

export { analyticsConsentKey, readAnalyticsConsent };
export type { AnalyticsConsent };
const SCRIPT_ID = 'valtieris-analytics-script';

const ANALYTICS_COOKIE_PREFIXES = ['_ga', '_gid', '_gat'];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return;
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name));

  for (const name of cookieNames) {
    if (!ANALYTICS_COOKIE_PREFIXES.some((prefix) => name === prefix || name.startsWith(`${prefix}_`))) continue;
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
  }
}

function revokeAnalytics() {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.dataLayer?.push({ event: 'consent_update', analytics_consent: 'denied' });
  clearAnalyticsCookies();
}

export function storeAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'unset'>) {
  try {
    window.localStorage.setItem(analyticsConsentKey, consent);
  } catch {
    // La preferencia sigue aplicándose durante la sesión aunque el almacenamiento esté bloqueado.
  }
  window.dispatchEvent(new CustomEvent('valtieris:analytics-consent', { detail: consent }));
  if (consent === 'granted') {
    initializeAnalytics();
    trackEvent('analytics_consent_update', { consent: 'granted' });
  } else {
    revokeAnalytics();
  }
}

export function analyticsIsConfigured() {
  return siteConfig.analytics.enabled && Boolean(siteConfig.analytics.gtmId || siteConfig.analytics.gaMeasurementId);
}

export function initializeAnalytics() {
  if (typeof document === 'undefined' || !analyticsIsConfigured() || readAnalyticsConsent() !== 'granted') return;
  if (document.getElementById(SCRIPT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'consent_default',
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

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
  window.gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function trackEvent(name: string, parameters: Record<string, string | number | boolean | undefined> = {}) {
  if (!analyticsIsConfigured() || readAnalyticsConsent() !== 'granted') return;
  const cleanParameters = Object.fromEntries(Object.entries({
    ...attributionEventContext(),
    ...parameters,
  }).filter(([, value]) => value !== undefined && value !== ''));

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
