import type { NavigationItem } from '../types/content';

export const primaryNavigation: NavigationItem[] = [
  { label: 'Plataforma', href: '/plataforma' },
  { label: 'Tecnologías', href: '/tecnologias' },
  { label: 'Bootcamps', href: '/bootcamps' },
  { label: 'Planes', href: '/planes' },
  { label: 'Nosotros', href: '/nosotros' },
];

export const solutionsNavigation = [
  { label: 'Soluciones para empresas', href: '/empresas', description: 'Evaluación, preparación y seguimiento para equipos.' },
  { label: 'Capacitaciones', href: '/capacitaciones', description: 'Programas por tecnología, nivel u objetivo.' },
  { label: 'Asesorías', href: '/asesorias', description: 'Diseño de academias, rutas y evaluaciones.' },
  { label: 'Solicitar cotización', href: '/solicitar-cotizacion', description: 'Dimensiona capacidad, servicios y acompañamiento.' },
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
