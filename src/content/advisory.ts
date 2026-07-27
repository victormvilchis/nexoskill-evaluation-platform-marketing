import type { JourneyStep, PageCapability } from '../types/content';

export const advisoryServices: PageCapability[] = [
  { title: 'Diseño de academias', description: 'Definición de niveles, secuencia, duración, evaluaciones y criterios de avance.', icon: 'academy' },
  { title: 'Diseño de evaluaciones', description: 'Construcción de instrumentos alineados con competencias, niveles y objetivos concretos.', icon: 'assessment' },
  { title: 'Bancos de reactivos', description: 'Creación y organización de preguntas originales con cobertura, dificultad y trazabilidad.', icon: 'database' },
  { title: 'Rutas de aprendizaje', description: 'Estructuración de contenidos y evaluaciones para llevar a una persona desde su nivel actual al esperado.', icon: 'path' },
  { title: 'Diagnóstico de capacidades', description: 'Análisis de equipos para identificar fortalezas, brechas y prioridades de desarrollo.', icon: 'target' },
  { title: 'Estrategia de certificación', description: 'Planeación de preparación, seguimiento y validación de conocimiento sin utilizar material protegido.', icon: 'shield' },
];

export const advisoryJourney: JourneyStep[] = [
  { number: '01', title: 'Entendimiento', description: 'Revisamos el objetivo, la población, el contexto y las restricciones del programa.' },
  { number: '02', title: 'Diagnóstico', description: 'Identificamos el punto de partida y las brechas que deben atenderse.' },
  { number: '03', title: 'Diseño', description: 'Construimos la propuesta de ruta, evaluación, contenido o academia requerida.' },
  { number: '04', title: 'Implementación', description: 'Acompañamos la puesta en marcha y ajustamos el modelo con evidencia real.' },
  { number: '05', title: 'Transferencia', description: 'Entregamos criterios, documentación y recomendaciones para continuar la operación.' },
];
