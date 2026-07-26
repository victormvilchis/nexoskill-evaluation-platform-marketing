import type { Plan } from '../types/content';

export const plans: Plan[] = [
  {
    name: 'Starter tecnológico',
    audience: 'Equipos pequeños',
    priceLabel: 'Solicitar cotización',
    description: 'Una base sólida para comenzar a evaluar y dar seguimiento a un equipo especializado.',
    features: ['10 asientos', 'Una tecnología', 'Evaluaciones y avances', 'Reportes básicos'],
  },
  {
    name: 'Professional Academy',
    audience: 'Organizaciones medianas',
    priceLabel: 'Solicitar cotización',
    description: 'Más capacidad, personalización y herramientas para operar una academia interna.',
    features: ['25 asientos', 'Varias tecnologías', 'Banco y formularios propios', 'Paths y reportes avanzados'],
    featured: true,
  },
  {
    name: 'Business Certification',
    audience: 'Equipos empresariales',
    priceLabel: 'Solicitar cotización',
    description: 'Cobertura amplia y acompañamiento para programas de preparación a escala.',
    features: ['50 asientos', 'Catálogo tecnológico amplio', 'Reportes ejecutivos', 'Configuración avanzada'],
  },
  {
    name: 'Enterprise',
    audience: 'Organizaciones grandes',
    priceLabel: 'Plan personalizado',
    description: 'Alcance, identidad e integraciones definidas con base en la operación de cada empresa.',
    features: ['Asientos personalizados', 'Varias áreas', 'Marca personalizada', 'Soporte prioritario'],
  },
];
