export type AnalyticsConsent = 'granted' | 'denied' | 'unset';

export const analyticsConsentKey = 'valtieris.analytics-consent.v1';
const legacyAnalyticsConsentKey = 'nexoskill.analytics-consent.v1';

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unset';
  try {
    const value = window.localStorage.getItem(analyticsConsentKey)
      ?? window.localStorage.getItem(legacyAnalyticsConsentKey);
    if (value === 'granted' || value === 'denied') {
      window.localStorage.setItem(analyticsConsentKey, value);
      window.localStorage.removeItem(legacyAnalyticsConsentKey);
      return value;
    }
    return 'unset';
  } catch {
    return 'unset';
  }
}
