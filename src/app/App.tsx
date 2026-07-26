import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { DemoPage } from '../pages/DemoPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { StandardPage } from '../pages/StandardPage';
import { TechnologyPage } from '../pages/TechnologyPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <ScrollToTop />
      <Header />
      <div id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plataforma" element={<StandardPage eyebrow="Plataforma NexoSkill" title="Centraliza evaluación, preparación y resultados." description="Una plataforma diseñada para organizaciones que necesitan administrar contenido, participantes y avance técnico con trazabilidad." path="/plataforma" highlights={['Evaluaciones y formularios', 'Colecciones y paths', 'Organizaciones y roles', 'Avances y reportes']} />} />
          <Route path="/tecnologias" element={<StandardPage eyebrow="Catálogo tecnológico" title="Preparación especializada por tecnología y nivel." description="Explora las especialidades disponibles para diagnosticar, preparar y evaluar talento tecnológico." path="/tecnologias" highlights={['APX y ASO', 'Java y Salesforce', 'Normativa y Testing', 'Desarrollo Seguro']} />} />
          <Route path="/tecnologias/:slug" element={<TechnologyPage />} />
          <Route path="/bootcamps" element={<StandardPage eyebrow="Programas intensivos" title="Bootcamps con seguimiento y resultados medibles." description="Programas estructurados con diagnóstico, sesiones, evaluaciones intermedias y cierre por tecnología." path="/bootcamps" highlights={['Diagnóstico inicial', 'Sesiones prácticas', 'Evaluaciones de seguimiento', 'Reporte final']} />} />
          <Route path="/capacitaciones" element={<StandardPage eyebrow="Capacitación empresarial" title="Academias técnicas alineadas con tus proyectos." description="Programas personalizados para desarrollar capacidades, acelerar incorporaciones y preparar equipos para nuevos retos." path="/capacitaciones" highlights={['Upskilling y reskilling', 'Formación por nivel', 'Preparación para proyectos', 'Seguimiento individual']} />} />
          <Route path="/asesorias" element={<StandardPage eyebrow="Asesoría especializada" title="Diseñamos la estrategia formativa contigo." description="Acompañamiento para construir academias, evaluaciones, bancos de reactivos originales y rutas de aprendizaje." path="/asesorias" highlights={['Diseño de academias', 'Diagnóstico de capacidades', 'Diseño de evaluaciones', 'Estrategias de certificación']} />} />
          <Route path="/planes" element={<StandardPage eyebrow="Planes comerciales" title="Capacidad y acompañamiento para cada etapa." description="La arquitectura de planes está centralizada y preparada para crecer sin duplicar precios ni características en componentes." path="/planes" highlights={['Starter tecnológico', 'Professional Academy', 'Business Certification', 'Enterprise']} />} />
          <Route path="/empresas" element={<StandardPage eyebrow="Soluciones B2B" title="Desarrolla talento con una operación visible y repetible." description="Evalúa candidatos, identifica brechas, prepara equipos y consulta resultados comparables por tecnología y nivel." path="/empresas" highlights={['Evaluación de candidatos', 'Diagnóstico de equipos', 'Academias internas', 'Preparación para proyectos']} />} />
          <Route path="/nosotros" element={<StandardPage eyebrow="Acerca de NexoSkill" title="Tecnología y especialización para desarrollar talento." description="NexoSkill busca convertir el conocimiento técnico en procesos de evaluación y preparación claros, medibles y útiles para las organizaciones." path="/nosotros" note="La sección institucional se completará únicamente con información verificable, sin inventar clientes, alianzas, métricas ni testimonios." />} />
          <Route path="/contacto" element={<DemoPage />} />
          <Route path="/solicitar-demo" element={<DemoPage />} />
          <Route path="/preguntas-frecuentes" element={<StandardPage eyebrow="Preguntas frecuentes" title="Respuestas para evaluar la solución." description="Información sobre organizaciones, asientos, contenido, personalización, avances, bootcamps y contratación." path="/preguntas-frecuentes" />} />
          <Route path="/aviso-de-privacidad" element={<StandardPage eyebrow="Información legal" title="Aviso de privacidad en preparación." description="El documento definitivo deberá validarse antes de publicar formularios y mecanismos de captación de datos personales." path="/aviso-de-privacidad" note="No se publica un texto legal genérico como definitivo. Esta ruta queda preparada para incorporar el aviso validado durante la fase de contacto y cumplimiento." />} />
          <Route path="/terminos-y-condiciones" element={<StandardPage eyebrow="Información legal" title="Términos y condiciones en preparación." description="Las condiciones definitivas se incorporarán una vez validadas las reglas comerciales y de uso del sitio." path="/terminos-y-condiciones" note="Esta primera entrega evita presentar condiciones no validadas como si fueran definitivas." />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
