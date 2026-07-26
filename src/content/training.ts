import type { PageCapability, ProgramItem } from '../types/content';

export const trainingPrograms: ProgramItem[] = [
  {
    title: 'Academias empresariales',
    description: 'Programas estructurados para desarrollar una capacidad técnica de forma consistente dentro de la organización.',
    icon: 'academy',
    bullets: ['Diseño por niveles', 'Seguimiento por grupo', 'Evaluación antes y después'],
  },
  {
    title: 'Preparación para proyectos',
    description: 'Formación alineada con las competencias que un equipo necesita antes de incorporarse a una iniciativa.',
    icon: 'rocket',
    bullets: ['Perfil objetivo', 'Ruta acelerada', 'Criterios de salida'],
  },
  {
    title: 'Upskilling y reskilling',
    description: 'Planes para profundizar conocimientos existentes o desarrollar capacidades para un nuevo rol tecnológico.',
    icon: 'refresh',
    bullets: ['Diagnóstico de brechas', 'Ruta personalizada', 'Resultados comparables'],
  },
  {
    title: 'Actualización tecnológica',
    description: 'Programas específicos para renovar conocimientos, adoptar prácticas modernas y homologar criterios técnicos.',
    icon: 'book',
    bullets: ['Contenido focalizado', 'Casos relevantes', 'Validación de conocimiento'],
  },
];

export const trainingComponents: PageCapability[] = [
  { title: 'Diagnóstico inicial', description: 'Determina el nivel de entrada y permite ajustar la profundidad del programa.', icon: 'search' },
  { title: 'Sesiones especializadas', description: 'Contenido guiado por objetivos concretos, con espacio para práctica y resolución de dudas.', icon: 'users' },
  { title: 'Material estructurado', description: 'Recursos organizados para acompañar el programa y reforzar conceptos clave.', icon: 'book' },
  { title: 'Evaluaciones de seguimiento', description: 'Cortes intermedios para comprobar comprensión y detectar brechas a tiempo.', icon: 'assessment' },
  { title: 'Reporte final', description: 'Resumen de avance, nivel alcanzado y recomendaciones para los siguientes pasos.', icon: 'report' },
  { title: 'Ajuste por organización', description: 'Duración, ritmo, modalidad y profundidad definidos con base en la necesidad real.', icon: 'settings' },
];
