import type { NavigationItem } from '../types/content';

export const primaryNavigation: NavigationItem[] = [
  { label: 'Plataforma', href: '/plataforma' },
  { label: 'Soluciones', href: '/empresas' },
  { label: 'Tecnologías', href: '/tecnologias' },
  { label: 'Bootcamps', href: '/bootcamps' },
  { label: 'Planes', href: '/planes' },
  { label: 'Nosotros', href: '/nosotros' },
];

export const footerNavigation = {
  soluciones: [
    { label: 'Plataforma', href: '/plataforma' },
    { label: 'Bootcamps', href: '/bootcamps' },
    { label: 'Capacitaciones', href: '/capacitaciones' },
    { label: 'Asesorías', href: '/asesorias' },
    { label: 'Evaluación de talento', href: '/empresas' },
  ],
  empresa: [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Planes', href: '/planes' },
    { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Solicitar cotización', href: '/solicitar-cotizacion' },
  ],
  legal: [
    { label: 'Aviso de privacidad', href: '/aviso-de-privacidad' },
    { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
  ],
};
