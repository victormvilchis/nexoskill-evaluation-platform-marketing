import { Link } from 'react-router-dom';
import { analyticsIsConfigured } from '../../analytics/analytics';
import { footerNavigation } from '../../content/navigation';
import { featuredTechnologies } from '../../content/technologies';
import { BrandMark } from '../common/BrandMark';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <BrandMark inverse />
            <p>Evaluación, preparación y analítica para desarrollar talento tecnológico con resultados medibles.</p>
            <Link
              className="footer-demo-link"
              data-analytics-event="demo_cta_click"
              data-analytics-label="Footer"
              to="/solicitar-demo"
            >
              Solicitar demo
            </Link>
          </div>

          <div>
            <h2>Soluciones</h2>
            <ul>{footerNavigation.soluciones.map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}</ul>
          </div>

          <div>
            <h2>Tecnologías</h2>
            <ul>{featuredTechnologies.slice(0, 5).map((technology) => <li key={technology.slug}><Link to={`/tecnologias/${technology.slug}`}>{technology.name}</Link></li>)}</ul>
          </div>

          <div>
            <h2>Empresa</h2>
            <ul>{footerNavigation.empresa.map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}</ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} NexoSkill. Todos los derechos reservados.</p>
          <div>
            {footerNavigation.legal.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
            {analyticsIsConfigured() ? (
              <button
                className="footer-privacy-button"
                onClick={() => window.dispatchEvent(new Event('nexoskill:open-consent'))}
                type="button"
              >
                Preferencias de cookies
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
