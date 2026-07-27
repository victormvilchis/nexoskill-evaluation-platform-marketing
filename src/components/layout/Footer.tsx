import { Link } from 'react-router-dom';
import { footerNavigation } from '../../content/navigation';
import { featuredTechnologies } from '../../content/technologies';
import { analyticsIsConfigured } from '../../analytics/analytics';
import { siteConfig } from '../../seo/siteConfig';
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
            <Link data-analytics-event="demo_cta_click" data-analytics-label="Footer" className="footer-demo-link" to="/solicitar-demo">Solicitar una demostración</Link>
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
            <a data-analytics-event="platform_login_click" data-analytics-label="Footer" href={siteConfig.platformUrl}>Acceso a la plataforma</a>
            {analyticsIsConfigured() ? <button className="footer-privacy-button" onClick={() => window.dispatchEvent(new Event('nexoskill:open-consent'))} type="button">Preferencias de cookies</button> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
