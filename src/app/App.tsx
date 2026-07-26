import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { AdvisoryPage } from '../pages/AdvisoryPage';
import { BootcampsPage } from '../pages/BootcampsPage';
import { DemoPage } from '../pages/DemoPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { FaqPage } from '../pages/FaqPage';
import { PricingPage } from '../pages/PricingPage';
import { QuoteRequestPage } from '../pages/QuoteRequestPage';
import { PlatformPage } from '../pages/PlatformPage';
import { StandardPage } from '../pages/StandardPage';
import { TalentEvaluationPage } from '../pages/TalentEvaluationPage';
import { TechnologiesPage } from '../pages/TechnologiesPage';
import { TechnologyPage } from '../pages/TechnologyPage';
import { TrainingPage } from '../pages/TrainingPage';

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
          <Route path="/plataforma" element={<PlatformPage />} />
          <Route path="/tecnologias" element={<TechnologiesPage />} />
          <Route path="/tecnologias/:slug" element={<TechnologyPage />} />
          <Route path="/bootcamps" element={<BootcampsPage />} />
          <Route path="/capacitaciones" element={<TrainingPage />} />
          <Route path="/asesorias" element={<AdvisoryPage />} />
          <Route path="/planes" element={<PricingPage />} />
          <Route path="/empresas" element={<TalentEvaluationPage />} />
          <Route path="/nosotros" element={<StandardPage eyebrow="Acerca de NexoSkill" title="Tecnología y especialización para desarrollar talento." description="NexoSkill busca convertir el conocimiento técnico en procesos de evaluación y preparación claros, medibles y útiles para las organizaciones." path="/nosotros" note="La sección institucional se completará únicamente con información verificable, sin inventar clientes, alianzas, métricas ni testimonios." />} />
          <Route path="/contacto" element={<DemoPage />} />
          <Route path="/solicitar-demo" element={<DemoPage />} />
          <Route path="/solicitar-cotizacion" element={<QuoteRequestPage />} />
          <Route path="/preguntas-frecuentes" element={<FaqPage />} />
          <Route path="/aviso-de-privacidad" element={<StandardPage eyebrow="Información legal" title="Aviso de privacidad en preparación." description="El documento definitivo deberá validarse antes de publicar formularios y mecanismos de captación de datos personales." path="/aviso-de-privacidad" note="No se publica un texto legal genérico como definitivo. Esta ruta queda preparada para incorporar el aviso validado durante la fase de contacto y cumplimiento." />} />
          <Route path="/terminos-y-condiciones" element={<StandardPage eyebrow="Información legal" title="Términos y condiciones en preparación." description="Las condiciones definitivas se incorporarán una vez validadas las reglas comerciales y de uso del sitio." path="/terminos-y-condiciones" note="Esta primera versión evita presentar condiciones no validadas como si fueran definitivas." />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
