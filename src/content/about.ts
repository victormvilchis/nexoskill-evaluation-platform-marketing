import type { IconName } from '../types/content';

export interface AboutPrinciple {
  title: string;
  description: string;
  icon: IconName;
}

export const aboutPrinciples: AboutPrinciple[] = [
  {
    title: 'Resultados antes que actividad',
    description: 'Cada evaluación, ruta o programa debe ayudar a entender el nivel actual, el avance y la siguiente decisión.',
    icon: 'target',
  },
  {
    title: 'Contenido con propósito',
    description: 'Los reactivos, prácticas y materiales se organizan alrededor de competencias y objetivos verificables.',
    icon: 'clipboard',
  },
  {
    title: 'Experiencias claras',
    description: 'La tecnología debe reducir fricción para administradores, responsables de formación y participantes.',
    icon: 'path',
  },
  {
    title: 'Operación responsable',
    description: 'La comunicación, el uso de datos y las capacidades publicadas deben mantenerse precisas, seguras y comprobables.',
    icon: 'shield',
  },
];

export const aboutAudiences = [
  'Áreas de capacitación y desarrollo',
  'Consultoras y empresas de tecnología',
  'Líderes técnicos y responsables de academias',
  'Equipos de talento y evaluación de candidatos',
  'Organizaciones que preparan personas para proyectos',
  'Profesionales que necesitan una ruta estructurada',
];

export const aboutModel = [
  {
    number: '01',
    title: 'Entender el objetivo',
    description: 'Definimos qué capacidad se necesita desarrollar, para quién y con qué evidencia de cierre.',
  },
  {
    number: '02',
    title: 'Diseñar la experiencia',
    description: 'Combinamos evaluación, contenido, práctica, seguimiento y acompañamiento según el contexto.',
  },
  {
    number: '03',
    title: 'Operar con visibilidad',
    description: 'La plataforma centraliza participantes, avances y resultados para sostener el programa.',
  },
  {
    number: '04',
    title: 'Convertir datos en decisiones',
    description: 'Los resultados permiten reforzar, reasignar, continuar o cerrar una ruta con mayor claridad.',
  },
];
