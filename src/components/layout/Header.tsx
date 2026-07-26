import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { primaryNavigation } from '../../content/navigation';
import { siteConfig } from '../../seo/siteConfig';
import { BrandMark } from '../common/BrandMark';
import { Icon } from '../common/Icon';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', isOpen);
    return () => document.body.classList.remove('nav-open');
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <BrandMark />
        <button
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="nav-toggle"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <Icon name={isOpen ? 'close' : 'menu'} />
        </button>
        <nav
          aria-label="Navegación principal"
          className={`site-nav ${isOpen ? 'site-nav--open' : ''}`}
          id="primary-navigation"
        >
          <div className="site-nav__links">
            {primaryNavigation.map((item) => (
              <NavLink className={({ isActive }) => (isActive ? 'is-active' : undefined)} key={item.href} to={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="site-nav__actions">
            <a className="login-link" href={siteConfig.platformUrl}>Iniciar sesión</a>
            <Link className="button button--primary button--small" to="/solicitar-demo">Solicitar demo</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
