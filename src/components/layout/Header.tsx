import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { primaryNavigation, solutionsNavigation } from '../../content/navigation';
import { siteConfig } from '../../seo/siteConfig';
import { BrandMark } from '../common/BrandMark';
import { Icon } from '../common/Icon';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const solutionsMenuRef = useRef<HTMLDivElement | null>(null);
  const solutionsActive = solutionsNavigation.some((item) => location.pathname === item.href);

  useEffect(() => {
    setIsOpen(false);
    setSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', isOpen);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (solutionsOpen) {
        setSolutionsOpen(false);
        solutionsButtonRef.current?.focus();
        return;
      }
      if (isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (solutionsOpen && !solutionsButtonRef.current?.contains(target) && !solutionsMenuRef.current?.contains(target)) {
        setSolutionsOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, [isOpen, solutionsOpen]);

  const renderLink = (item: { label: string; href: string }) => (
    <NavLink className={({ isActive }) => (isActive ? 'is-active' : undefined)} key={item.href} to={item.href}>
      {item.label}
    </NavLink>
  );

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
            {renderLink(primaryNavigation[0])}
            <div className={`nav-dropdown ${solutionsOpen ? 'nav-dropdown--open' : ''}`}>
              <button
                aria-controls="solutions-navigation"
                aria-expanded={solutionsOpen}
                className={solutionsActive ? 'is-active' : undefined}
                onClick={() => setSolutionsOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setSolutionsOpen(true);
                    window.requestAnimationFrame(() => solutionsMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus());
                  }
                }}
                ref={solutionsButtonRef}
                type="button"
              >
                Soluciones <span aria-hidden="true">⌄</span>
              </button>
              <div className="nav-dropdown__menu" id="solutions-navigation" ref={solutionsMenuRef}>
                <span className="nav-dropdown__eyebrow">Soluciones NexoSkill</span>
                {solutionsNavigation.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </Link>
                ))}
              </div>
            </div>
            {primaryNavigation.slice(1).map(renderLink)}
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
