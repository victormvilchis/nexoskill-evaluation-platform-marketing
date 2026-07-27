import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { primaryNavigation } from '../../content/navigation';
import { siteConfig } from '../../seo/siteConfig';
import { BrandMark } from '../common/BrandMark';
import { Icon } from '../common/Icon';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', isOpen);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', closeOnEscape);
    };
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
          ref={toggleRef}
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
            <a data-analytics-event="platform_login_click" data-analytics-label="Header" className="login-link" href={siteConfig.platformUrl}>Iniciar sesión</a>
            <Link data-analytics-event="demo_cta_click" data-analytics-label="Header" className="button button--primary button--small" to="/solicitar-demo">Solicitar demo</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
