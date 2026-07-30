import { readAnalyticsConsent } from './consent';

const ATTRIBUTION_KEY = 'valtieris.marketing-attribution.v1';
const LEGACY_ATTRIBUTION_KEY = 'nexoskill.marketing-attribution.v1';
const MAX_URL_LENGTH = 500;

const LIMITS = {
  utmSource: 100,
  utmMedium: 100,
  utmCampaign: 160,
  utmContent: 160,
  utmTerm: 160,
  clickId: 200,
  clickIdType: 30,
} as const;

const CLICK_ID_PARAMETERS = ['gclid', 'fbclid', 'msclkid', 'li_fat_id'] as const;

export interface MarketingAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  clickId?: string;
  clickIdType?: string;
  referrer?: string;
  landingPage?: string;
  attributionCapturedAt?: string;
}

export interface LeadAttributionPayload extends MarketingAttribution {
  conversionPage: string;
  analyticsConsent: 'GRANTED' | 'DENIED' | 'UNSET';
}

function limit(value: string | null | undefined, maxLength: number): string | undefined {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  return normalized.slice(0, maxLength);
}

function campaignOnlyUrl(url: URL): string {
  const safe = new URL(url.pathname, url.origin);
  safe.hash = '';
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', ...CLICK_ID_PARAMETERS]) {
    const value = url.searchParams.get(key);
    if (value) safe.searchParams.set(key, value.slice(0, 200));
  }
  return `${safe.pathname}${safe.search}`.slice(0, MAX_URL_LENGTH);
}

function externalReferrer(value: string): string | undefined {
  if (!value) return undefined;
  try {
    const referrer = new URL(value);
    if (typeof window !== 'undefined' && referrer.origin === window.location.origin) return undefined;
    referrer.hash = '';
    return referrer.toString().slice(0, MAX_URL_LENGTH);
  } catch {
    return undefined;
  }
}


function normalizeStoredAttribution(value: MarketingAttribution): MarketingAttribution {
  return {
    utmSource: limit(typeof value.utmSource === 'string' ? value.utmSource : undefined, LIMITS.utmSource),
    utmMedium: limit(typeof value.utmMedium === 'string' ? value.utmMedium : undefined, LIMITS.utmMedium),
    utmCampaign: limit(typeof value.utmCampaign === 'string' ? value.utmCampaign : undefined, LIMITS.utmCampaign),
    utmContent: limit(typeof value.utmContent === 'string' ? value.utmContent : undefined, LIMITS.utmContent),
    utmTerm: limit(typeof value.utmTerm === 'string' ? value.utmTerm : undefined, LIMITS.utmTerm),
    clickId: limit(typeof value.clickId === 'string' ? value.clickId : undefined, LIMITS.clickId),
    clickIdType: limit(typeof value.clickIdType === 'string' ? value.clickIdType : undefined, LIMITS.clickIdType),
    referrer: limit(typeof value.referrer === 'string' ? value.referrer : undefined, MAX_URL_LENGTH),
    landingPage: limit(typeof value.landingPage === 'string' ? value.landingPage : undefined, MAX_URL_LENGTH),
    attributionCapturedAt: limit(typeof value.attributionCapturedAt === 'string' ? value.attributionCapturedAt : undefined, 40),
  };
}

function readStoredAttribution(): MarketingAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY)
      ?? window.sessionStorage.getItem(LEGACY_ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as MarketingAttribution;
    return parsed && typeof parsed === 'object' ? normalizeStoredAttribution(parsed) : {};
  } catch {
    return {};
  }
}

function storeAttribution(value: MarketingAttribution): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
    window.sessionStorage.removeItem(LEGACY_ATTRIBUTION_KEY);
  } catch {
    // El formulario debe seguir operando aunque el navegador bloquee sessionStorage.
  }
}

function readClickId(parameters: URLSearchParams): Pick<MarketingAttribution, 'clickId' | 'clickIdType'> {
  for (const parameter of CLICK_ID_PARAMETERS) {
    const value = limit(parameters.get(parameter), LIMITS.clickId);
    if (value) return { clickId: value, clickIdType: parameter.slice(0, LIMITS.clickIdType) };
  }
  return {};
}

function hasExplicitCampaign(value: MarketingAttribution): boolean {
  return Boolean(value.utmSource || value.utmMedium || value.utmCampaign || value.utmContent || value.utmTerm || value.clickId);
}

export function captureAttribution(): MarketingAttribution {
  if (typeof window === 'undefined') return {};

  const currentUrl = new URL(window.location.href);
  const explicit: MarketingAttribution = {
    utmSource: limit(currentUrl.searchParams.get('utm_source'), LIMITS.utmSource),
    utmMedium: limit(currentUrl.searchParams.get('utm_medium'), LIMITS.utmMedium),
    utmCampaign: limit(currentUrl.searchParams.get('utm_campaign'), LIMITS.utmCampaign),
    utmContent: limit(currentUrl.searchParams.get('utm_content'), LIMITS.utmContent),
    utmTerm: limit(currentUrl.searchParams.get('utm_term'), LIMITS.utmTerm),
    ...readClickId(currentUrl.searchParams),
  };

  const existing = readStoredAttribution();
  const shouldReplaceCampaign = hasExplicitCampaign(explicit);
  const attribution: MarketingAttribution = {
    ...(shouldReplaceCampaign ? explicit : existing),
    referrer: shouldReplaceCampaign
      ? externalReferrer(document.referrer) ?? existing.referrer
      : existing.referrer ?? externalReferrer(document.referrer),
    landingPage: shouldReplaceCampaign
      ? campaignOnlyUrl(currentUrl)
      : existing.landingPage ?? campaignOnlyUrl(currentUrl),
    attributionCapturedAt: shouldReplaceCampaign
      ? new Date().toISOString()
      : existing.attributionCapturedAt ?? new Date().toISOString(),
  };

  storeAttribution(attribution);
  return attribution;
}

export function getLeadAttribution(): LeadAttributionPayload {
  const attribution = captureAttribution();
  const consent = readAnalyticsConsent();
  const conversionPage = typeof window === 'undefined'
    ? '/'
    : campaignOnlyUrl(new URL(window.location.href));

  return {
    ...attribution,
    conversionPage,
    analyticsConsent: consent === 'granted' ? 'GRANTED' : consent === 'denied' ? 'DENIED' : 'UNSET',
  };
}

export function attributionEventContext(): Record<string, string | undefined> {
  const attribution = readStoredAttribution();
  return {
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
    utm_content: attribution.utmContent,
    utm_term: attribution.utmTerm,
  };
}

export const attributionStorageKey = ATTRIBUTION_KEY;
