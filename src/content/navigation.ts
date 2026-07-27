import type { IconName, NavigationItem } from '../types/content';

export const primaryNavigation: NavigationItem[] = [
  { label: 'Plataforma', href: '/plataforma' },
  { label: 'Tecnologías', href: '/tecnologias' },
  { label: 'Bootcamps', href: '/bootcamps' },
  { label: 'Planes', href: '/planes' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export interface SolutionNavigationItem extends NavigationItem {
  description: string;
  icon: IconName;
}

export const solutionsNavigation: SolutionNavigationItem[] = [
  {
    label: 'Plataforma de evaluaciones',
    href: '/plataforma',
    description: 'Diagnóstico, rutas, evaluaciones y seguimiento centralizado.',
    icon: 'assessment',
  },
  {
    label: 'Capacitaciones',
    href: '/capacitaciones',
    description: 'Programas empresariales por tecnología, nivel y objetivo.',
    icon: 'academy',
  },
  {
    label: 'Bootcamps',
    href: '/bootcamps',
    description: 'Preparación intensiva con práctica, evaluación y acompañamiento.',
    icon: 'rocket',
  },
  {
    label: 'Asesorías',
    href: '/asesorias',
    description: 'Diseño de academias, rutas formativas y bancos de contenido.',
    icon: 'consulting',
  },
  {
    label: 'Evaluación de talento',
    href: '/empresas',
    description: 'Identifica fortalezas, brechas y preparación para proyectos.',
    icon: 'talent',
  },
];

export const solutionActions: NavigationItem[] = [
  { label: 'Solicitar demo', href: '/solicitar-demo' },
  { label: 'Solicitar cotización', href: '/solicitar-cotizacion' },
  { label: 'Conocer planes', href: '/planes' },
];

export const footerNavigation = {
  soluciones: [
    { label: 'Plataforma', href: '/plataforma' },
    { label: 'Bootcamps', href: '/bootcamps' },
    { label: 'Capacitaciones', href: '/capacitaciones' },
    { label: 'Asesorías', href: '/asesorias' },
    { label: 'Evaluación de talento', href: '/empresas' },
  ],
  recursos: [
    { label: 'Tecnologías', href: '/tecnologias' },
    { label: 'Planes', href: '/planes' },
    { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
  ],
  empresa: [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Solicitar demo', href: '/solicitar-demo' },
    { label: 'Solicitar cotización', href: '/solicitar-cotizacion' },
  ],
  legal: [
    { label: 'Aviso de privacidad', href: '/aviso-de-privacidad' },
    { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
  ],
};
