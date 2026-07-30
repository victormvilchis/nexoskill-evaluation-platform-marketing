export type AnalyticsConsent = 'granted' | 'denied' | 'unset';

export const analyticsConsentKey = 'valtieris.analytics-consent.v1';

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unset';
  try {
    const value = window.localStorage.getItem(analyticsConsentKey);
    if (value === 'granted' || value === 'denied') {
      window.localStorage.setItem(analyticsConsentKey, value);
      return value;
    }
    return 'unset';
  } catch {
    return 'unset';
  }
}
