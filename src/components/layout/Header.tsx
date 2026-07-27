import { type FocusEvent as ReactFocusEvent, type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { primaryNavigation, solutionsNavigation } from '../../content/navigation';
import { BrandMark } from '../common/BrandMark';
import { Icon } from '../common/Icon';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const solutionsMenuRef = useRef<HTMLDivElement | null>(null);
  const solutionsActive = solutionsNavigation.some((item) => location.pathname === item.href);

  useEffect(() => {
    setMobileOpen(false);
    setSolutionsOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    if (!mobileOpen || !window.matchMedia('(max-width: 960px)').matches) return;

    window.requestAnimationFrame(() => {
      mobileNavRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus();
    });
  }, [mobileOpen]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileOpen);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (solutionsOpen) {
        setSolutionsOpen(false);
        solutionsButtonRef.current?.focus();
        return;
      }

      if (mobileOpen) {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!solutionsOpen) return;
      const target = event.target as Node;
      if (!solutionsButtonRef.current?.contains(target) && !solutionsMenuRef.current?.contains(target)) {
        setSolutionsOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);

    return () => {
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [mobileOpen, solutionsOpen]);

  const focusSolution = (position: 'first' | 'last' | 'next' | 'previous', current?: HTMLElement) => {
    const links = Array.from(solutionsMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
    if (!links.length) return;

    if (position === 'first') links[0]?.focus();
    if (position === 'last') links.at(-1)?.focus();

    if ((position === 'next' || position === 'previous') && current) {
      const currentIndex = links.indexOf(current as HTMLAnchorElement);
      const offset = position === 'next' ? 1 : -1;
      links[(currentIndex + offset + links.length) % links.length]?.focus();
    }
  };

  const handleSolutionsKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const current = event.target as HTMLElement;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusSolution('next', current);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusSolution('previous', current);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusSolution('first');
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusSolution('last');
    }
  };

  const handleSolutionsBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (solutionsOpen && nextTarget && !event.currentTarget.contains(nextTarget)) {
      setSolutionsOpen(false);
    }
  };

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
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
          className="nav-toggle"
          onClick={() => setMobileOpen((current) => !current)}
          ref={mobileToggleRef}
          type="button"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} />
        </button>

        <nav
          aria-label="Navegación principal"
          className={`site-nav ${mobileOpen ? 'site-nav--open' : ''}`}
          id="primary-navigation"
          ref={mobileNavRef}
        >
          <div className="site-nav__links">
            {renderLink(primaryNavigation[0])}

            <div className={`nav-dropdown ${solutionsOpen ? 'nav-dropdown--open' : ''}`} onBlur={handleSolutionsBlur}>
              <button
                aria-controls="solutions-navigation"
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
                className={solutionsActive ? 'is-active' : undefined}
                onClick={() => setSolutionsOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    setSolutionsOpen(true);
                    window.requestAnimationFrame(() => focusSolution(event.key === 'ArrowUp' ? 'last' : 'first'));
                  }
                }}
                ref={solutionsButtonRef}
                type="button"
              >
                Soluciones
                <span aria-hidden="true" className="nav-dropdown__chevron">
                  <Icon name="chevron" size={16} />
                </span>
              </button>

              <div
                aria-label="Soluciones NexoSkill"
                className="nav-dropdown__menu"
                hidden={!solutionsOpen}
                id="solutions-navigation"
                onKeyDown={handleSolutionsKeyDown}
                ref={solutionsMenuRef}
              >
                <span className="nav-dropdown__eyebrow">Soluciones NexoSkill</span>
                {solutionsNavigation.map((item) => (
                  <NavLink className={({ isActive }) => (isActive ? 'is-active' : undefined)} key={item.href} to={item.href}>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </NavLink>
                ))}
              </div>
            </div>

            {primaryNavigation.slice(1).map(renderLink)}
          </div>

          <div className="site-nav__actions">
            <Link
              className="button button--primary button--small"
              data-analytics-event="demo_cta_click"
              data-analytics-label="Header"
              to="/solicitar-demo"
            >
              Solicitar demo
            </Link>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div
          aria-hidden="true"
          className="nav-backdrop nav-backdrop--visible"
          onClick={() => {
            setMobileOpen(false);
            setSolutionsOpen(false);
            mobileToggleRef.current?.focus();
          }}
        />
      )}
    </header>
  );
}
