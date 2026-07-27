import type { JourneyStep, PageCapability } from '../types/content';

export const platformCapabilities: PageCapability[] = [
  {
    title: 'Evaluaciones y diagnósticos',
    description: 'Crea instrumentos por tecnología, nivel o competencia para establecer un punto de partida confiable.',
    icon: 'assessment',
    bullets: ['Evaluaciones configurables', 'Preguntas originales', 'Resultados trazables'],
  },
  {
    title: 'Banco de contenido',
    description: 'Centraliza preguntas, formularios, colecciones y materiales en una estructura reutilizable.',
    icon: 'database',
    bullets: ['Contenido organizado', 'Clasificación por competencia', 'Reutilización controlada'],
  },
  {
    title: 'Paths de preparación',
    description: 'Construye secuencias de evaluación y aprendizaje alineadas con el objetivo de cada equipo.',
    icon: 'path',
    bullets: ['Rutas por nivel', 'Asignación por grupo', 'Progreso visible'],
  },
  {
    title: 'Gestión de participantes',
    description: 'Administra estudiantes, gestores y supervisores con alcance independiente por organización.',
    icon: 'users',
    bullets: ['Roles definidos', 'Equipos independientes', 'Control de asientos'],
  },
  {
    title: 'Resultados y reportes',
    description: 'Consulta desempeño individual y consolidado para identificar fortalezas, brechas y prioridades.',
    icon: 'report',
    bullets: ['Resultados comparables', 'Seguimiento por corte', 'Visión ejecutiva'],
  },
  {
    title: 'Personalización empresarial',
    description: 'Combina contenido general con evaluaciones, rutas y criterios propios de cada organización.',
    icon: 'settings',
    bullets: ['Contenido privado', 'Configuración por empresa', 'Modelo escalable'],
  },
];

export const platformJourney: JourneyStep[] = [
  { number: '01', title: 'Configura', description: 'Define la organización, los roles, las tecnologías y el alcance del programa.' },
  { number: '02', title: 'Diagnostica', description: 'Aplica una evaluación inicial para conocer el nivel real de cada participante.' },
  { number: '03', title: 'Asigna', description: 'Relaciona evaluaciones, formularios y contenido dentro de una ruta estructurada.' },
  { number: '04', title: 'Acompaña', description: 'Consulta el avance y refuerza las competencias que requieren atención.' },
  { number: '05', title: 'Decide', description: 'Utiliza resultados consistentes para orientar capacitación, asignaciones o siguientes pasos.' },
];

export const platformUseCases = [
  'Diagnóstico de nuevos ingresos y candidatos.',
  'Preparación de equipos antes de incorporarse a un proyecto.',
  'Seguimiento de academias internas y programas de certificación.',
  'Evaluación periódica de conocimientos y actualización técnica.',
];
