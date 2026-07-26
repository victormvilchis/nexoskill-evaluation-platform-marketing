import type { Service } from '../types/content';

export const services: Service[] = [
  {
    title: 'Plataforma de evaluaciones',
    description: 'Centraliza diagnósticos, simuladores, rutas de preparación, avances y resultados por organización.',
    href: '/plataforma',
    icon: 'assessment',
    bullets: ['Evaluaciones y formularios', 'Paths y seguimiento', 'Reportes por equipo'],
  },
  {
    title: 'Bootcamps tecnológicos',
    description: 'Programas intensivos con diagnóstico inicial, sesiones prácticas, evaluaciones intermedias y cierre medible.',
    href: '/bootcamps',
    icon: 'academy',
    bullets: ['Programas por tecnología', 'Seguimiento individual', 'Modalidad personalizada'],
  },
  {
    title: 'Capacitación empresarial',
    description: 'Academias internas para acelerar la incorporación, preparar equipos y cerrar brechas de conocimiento.',
    href: '/capacitaciones',
    icon: 'users',
    bullets: ['Upskilling y reskilling', 'Preparación para proyectos', 'Formación por nivel'],
  },
  {
    title: 'Asesoría especializada',
    description: 'Diseñamos evaluaciones, bancos de reactivos originales, rutas formativas y estrategias de preparación.',
    href: '/asesorias',
    icon: 'consulting',
    bullets: ['Diseño de academias', 'Diagnóstico de capacidades', 'Acompañamiento técnico'],
  },
  {
    title: 'Evaluación de talento',
    description: 'Identifica el nivel real de candidatos y colaboradores con criterios homogéneos y resultados comparables.',
    href: '/empresas',
    icon: 'talent',
    bullets: ['Evaluación por nivel', 'Análisis de brechas', 'Recomendaciones de preparación'],
  },
];
