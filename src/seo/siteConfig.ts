type EnvKey =
  | 'VITE_SITE_URL'
  | 'VITE_PLATFORM_URL'
  | 'VITE_CONTACT_EMAIL'
  | 'VITE_API_URL'
  | 'VITE_ENABLE_ANALYTICS'
  | 'VITE_GTM_ID'
  | 'VITE_GA_MEASUREMENT_ID'
  | 'VITE_LEGAL_ENTITY'
  | 'VITE_LEGAL_ADDRESS'
  | 'VITE_PRIVACY_EMAIL';

const readEnv = (key: EnvKey) => {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
};

const readUrl = (key: EnvKey) => readEnv(key).replace(/\/$/, '');

export const siteConfig = {
  name: 'NexoSkill',
  description: 'Evaluación, preparación y analítica para desarrollar talento tecnológico con resultados medibles.',
  siteUrl: readUrl('VITE_SITE_URL') || 'http://localhost:5174',
  platformUrl: readUrl('VITE_PLATFORM_URL') || 'http://localhost:5173/evaluaciones/dashboard',
  contactEmail: readEnv('VITE_CONTACT_EMAIL'),
  privacyEmail: readEnv('VITE_PRIVACY_EMAIL') || readEnv('VITE_CONTACT_EMAIL'),
  apiUrl: readUrl('VITE_API_URL') || 'http://localhost:8081/api',
  legalEntity: readEnv('VITE_LEGAL_ENTITY') || 'NexoSkill',
  legalAddress: readEnv('VITE_LEGAL_ADDRESS'),
  analytics: {
    enabled: readEnv('VITE_ENABLE_ANALYTICS').toLowerCase() === 'true',
    gtmId: readEnv('VITE_GTM_ID'),
    gaMeasurementId: readEnv('VITE_GA_MEASUREMENT_ID'),
  },
};
