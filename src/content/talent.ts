import type { JourneyStep, PageCapability } from '../types/content';

export const talentCapabilities: PageCapability[] = [
  { title: 'Evaluación de candidatos', description: 'Compara conocimientos mediante criterios homogéneos antes de una decisión de contratación o asignación.', icon: 'talent' },
  { title: 'Diagnóstico de equipos', description: 'Obtén una vista consolidada del nivel actual y de las brechas por tecnología o competencia.', icon: 'users' },
  { title: 'Evaluación por nivel', description: 'Diferencia expectativas para perfiles iniciales, intermedios y avanzados.', icon: 'layers' },
  { title: 'Reportes comparativos', description: 'Consulta resultados individuales y de grupo para identificar patrones y prioridades.', icon: 'chart' },
  { title: 'Recomendaciones de preparación', description: 'Relaciona cada resultado con una ruta, refuerzo o siguiente evaluación.', icon: 'path' },
  { title: 'Criterios personalizables', description: 'Alinea el instrumento con las competencias que realmente requiere tu organización.', icon: 'settings' },
];

export const talentJourney: JourneyStep[] = [
  { number: '01', title: 'Define el perfil', description: 'Establece competencias, nivel esperado y contexto de la evaluación.' },
  { number: '02', title: 'Asigna la evaluación', description: 'Selecciona o configura el instrumento correspondiente.' },
  { number: '03', title: 'Recopila resultados', description: 'Centraliza respuestas, puntuaciones y evidencia de desempeño.' },
  { number: '04', title: 'Compara', description: 'Analiza fortalezas y brechas con criterios comunes.' },
  { number: '05', title: 'Actúa', description: 'Decide el siguiente paso: incorporación, preparación, refuerzo o nueva evaluación.' },
];
