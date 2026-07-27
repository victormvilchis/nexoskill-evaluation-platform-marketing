const readEnv = (key: 'VITE_SITE_URL' | 'VITE_PLATFORM_URL' | 'VITE_CONTACT_EMAIL' | 'VITE_API_URL') => {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim().replace(/\/$/, '') : '';
};

export const siteConfig = {
  name: 'NexoSkill',
  description: 'Evaluación, preparación y analítica para desarrollar talento tecnológico con resultados medibles.',
  siteUrl: readEnv('VITE_SITE_URL') || 'http://localhost:5174',
  platformUrl: readEnv('VITE_PLATFORM_URL') || 'http://localhost:5173/evaluaciones/admin/students',
  contactEmail: readEnv('VITE_CONTACT_EMAIL'),
  apiUrl: readEnv('VITE_API_URL') || 'http://localhost:8081/api',
};
