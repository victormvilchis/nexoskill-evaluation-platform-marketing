import { Link } from 'react-router-dom';
import { PrivacyNoticeContent } from '../components/privacy/PrivacyNoticeContent';
import { Seo } from '../seo/Seo';

export function PrivacyPage() {
  return (
    <>
      <Seo
        description="Conoce qué datos recopila Valtieris mediante sus formularios comerciales, para qué se utilizan y cómo ejercer tus derechos de privacidad."
        path="/aviso-de-privacidad"
        title="Aviso de privacidad"
      />
      <div className="legal-page">
        <section className="subpage-hero subpage-hero--compact">
          <div className="container legal-page__hero">
            <nav aria-label="Migas de pan" className="breadcrumbs"><Link to="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">Aviso de privacidad</span></nav>
            <span className="eyebrow eyebrow--hero">Privacidad</span>
            <h1>Aviso de privacidad del sitio público.</h1>
            <p>Este documento describe el tratamiento de la información enviada a través de los formularios comerciales de Valtieris.</p>
            <small>Última actualización: 28 de julio de 2026.</small>
          </div>
        </section>
        <div className="container legal-page__content">
          <PrivacyNoticeContent showAnalyticsPreferences />
        </div>
      </div>
    </>
  );
}
