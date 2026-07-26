import type { ProcessStep } from '../types/content';

export const processSteps: ProcessStep[] = [
  { number: '01', title: 'Diagnostica', description: 'Identifica el punto de partida con evaluaciones alineadas a competencias.' },
  { number: '02', title: 'Asigna una ruta', description: 'Define un path de preparación según tecnología, nivel y objetivo.' },
  { number: '03', title: 'Evalúa', description: 'Aplica simuladores y cortes de seguimiento durante el proceso.' },
  { number: '04', title: 'Mide avances', description: 'Consulta resultados individuales y consolidados por equipo.' },
  { number: '05', title: 'Refuerza', description: 'Atiende brechas con contenido, sesiones o acompañamiento especializado.' },
  { number: '06', title: 'Obtén resultados', description: 'Convierte el proceso de formación en evidencia clara para el negocio.' },
];
