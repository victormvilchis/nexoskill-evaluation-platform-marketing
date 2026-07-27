import type { JourneyStep, ProgramItem } from '../types/content';

export const bootcampPrograms: ProgramItem[] = [
  {
    title: 'Backend con Java',
    description: 'Programa intensivo para fortalecer fundamentos, desarrollo de servicios, persistencia, pruebas y buenas prácticas.',
    icon: 'code',
    tag: 'Backend',
    bullets: ['Diagnóstico por nivel', 'Ejercicios prácticos', 'Evaluación final'],
  },
  {
    title: 'APIs y Microservicios',
    description: 'Preparación enfocada en contratos, integración, diseño de servicios, resiliencia y observabilidad.',
    icon: 'layers',
    tag: 'Arquitectura',
    bullets: ['Casos de integración', 'Diseño de soluciones', 'Retroalimentación técnica'],
  },
  {
    title: 'Salesforce',
    description: 'Ruta por competencias para administración, automatización, desarrollo y operación de soluciones CRM.',
    icon: 'cloud',
    tag: 'Plataforma',
    bullets: ['Contenido por perfil', 'Simuladores', 'Seguimiento individual'],
  },
  {
    title: 'Testing y Calidad',
    description: 'Programa para fortalecer estrategia de pruebas, automatización, criterios de aceptación y prevención de defectos.',
    icon: 'clipboard',
    tag: 'Calidad',
    bullets: ['Diseño de pruebas', 'Automatización', 'Métricas de calidad'],
  },
  {
    title: 'Desarrollo Seguro',
    description: 'Formación para reconocer riesgos, aplicar controles y fortalecer prácticas seguras durante el desarrollo.',
    icon: 'shield',
    tag: 'Seguridad',
    bullets: ['Riesgos frecuentes', 'Controles preventivos', 'Evaluación práctica'],
  },
  {
    title: 'Python y Datos',
    description: 'Programa para desarrollar fundamentos de Python, SQL, procesamiento y automatización de tareas con datos.',
    icon: 'database',
    tag: 'Datos',
    bullets: ['Fundamentos aplicados', 'Prácticas con datos', 'Proyecto de cierre'],
  },
];

export const bootcampJourney: JourneyStep[] = [
  { number: '01', title: 'Diagnóstico', description: 'Identificamos nivel, brechas y condiciones iniciales del grupo.' },
  { number: '02', title: 'Diseño del programa', description: 'Ajustamos temario, profundidad, duración y criterios de evaluación.' },
  { number: '03', title: 'Sesiones y práctica', description: 'Desarrollamos conocimientos con acompañamiento, ejercicios y casos aplicados.' },
  { number: '04', title: 'Evaluación continua', description: 'Medimos comprensión y avance mediante cortes definidos durante el programa.' },
  { number: '05', title: 'Cierre y resultados', description: 'Entregamos un resultado final con fortalezas, brechas y recomendaciones.' },
];
