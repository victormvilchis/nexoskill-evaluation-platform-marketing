import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnalyticsManager } from '../analytics/AnalyticsManager';
import { AttributionManager } from '../analytics/AttributionManager';
import { AppErrorBoundary } from '../components/common/AppErrorBoundary';
import { ConsentBanner } from '../components/privacy/ConsentBanner';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { HomePage } from '../pages/HomePage';

const AboutPage = lazy(() => import('../pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const AdvisoryPage = lazy(() => import('../pages/AdvisoryPage').then((module) => ({ default: module.AdvisoryPage })));
const BootcampsPage = lazy(() => import('../pages/BootcampsPage').then((module) => ({ default: module.BootcampsPage })));
const DemoPage = lazy(() => import('../pages/DemoPage').then((module) => ({ default: module.DemoPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const FaqPage = lazy(() => import('../pages/FaqPage').then((module) => ({ default: module.FaqPage })));
const PricingPage = lazy(() => import('../pages/PricingPage').then((module) => ({ default: module.PricingPage })));
const QuoteRequestPage = lazy(() => import('../pages/QuoteRequestPage').then((module) => ({ default: module.QuoteRequestPage })));
const PlatformPage = lazy(() => import('../pages/PlatformPage').then((module) => ({ default: module.PlatformPage })));
const TalentEvaluationPage = lazy(() => import('../pages/TalentEvaluationPage').then((module) => ({ default: module.TalentEvaluationPage })));
const TechnologiesPage = lazy(() => import('../pages/TechnologiesPage').then((module) => ({ default: module.TechnologiesPage })));
const TechnologyPage = lazy(() => import('../pages/TechnologyPage').then((module) => ({ default: module.TechnologyPage })));
const TrainingPage = lazy(() => import('../pages/TrainingPage').then((module) => ({ default: module.TrainingPage })));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('../pages/TermsPage').then((module) => ({ default: module.TermsPage })));

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      window.requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (!target) return;

        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });

        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    const main = document.getElementById('main-content');
    window.requestAnimationFrame(() => main?.focus({ preventScroll: true }));
  }, [hash, pathname]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAnnouncement(document.title.replace(/\s*\|\s*Valtieris$/, ''));
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return <p aria-live="polite" className="sr-only" role="status">{announcement}</p>;
}

function PageLoader() {
  return <div aria-live="polite" className="page-loader" role="status"><span aria-hidden="true" /> Cargando contenido…</div>;
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <RouteEffects />
      <AttributionManager />
      <AnalyticsManager />
      <Header />
      <div id="main-content" role="main" tabIndex={-1}>
        <AppErrorBoundary>
          <Suspense fallback={<PageLoader />}>
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
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/contacto" element={<DemoPage />} />
            <Route path="/solicitar-demo" element={<DemoPage />} />
            <Route path="/solicitar-cotizacion" element={<QuoteRequestPage />} />
            <Route path="/preguntas-frecuentes" element={<FaqPage />} />
            <Route path="/aviso-de-privacidad" element={<PrivacyPage />} />
            <Route path="/terminos-y-condiciones" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </AppErrorBoundary>
      </div>
      <Footer />
      <ConsentBanner />
    </>
  );
}
