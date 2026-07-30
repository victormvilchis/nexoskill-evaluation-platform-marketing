import { useEffect, useRef, useState } from 'react';
import { analyticsIsConfigured, readAnalyticsConsent, storeAnalyticsConsent, type AnalyticsConsent } from '../../analytics/analytics';
import { Link } from 'react-router-dom';

export function ConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent>(() => readAnalyticsConsent());
  const [isOpen, setIsOpen] = useState(() => analyticsIsConfigured() && readAnalyticsConsent() === 'unset');
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const open = () => setIsOpen(true);
    const update = (event: Event) => setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    window.addEventListener('valtieris:open-consent', open);
    window.addEventListener('valtieris:analytics-consent', update);
    return () => {
      window.removeEventListener('valtieris:open-consent', open);
      window.removeEventListener('valtieris:analytics-consent', update);
    };
  }, []);

  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!analyticsIsConfigured() || !isOpen) return null;

  const choose = (value: Exclude<AnalyticsConsent, 'unset'>) => {
    storeAnalyticsConsent(value);
    setConsent(value);
    setIsOpen(false);
  };

  return (
    <div className="consent-layer" role="presentation">
      <div aria-describedby="consent-description" aria-labelledby="consent-title" aria-modal="true" className="consent-banner" ref={dialogRef} role="dialog" tabIndex={-1}>
        <div>
          <span className="eyebrow">Privacidad y analítica</span>
          <h2 id="consent-title">Tú decides sobre las cookies opcionales.</h2>
          <p id="consent-description">Usamos almacenamiento estrictamente necesario para operar el sitio. La analítica se activa únicamente con tu autorización y se utiliza para medir navegación y conversiones sin enviar datos de los formularios.</p>
          <p className="consent-banner__current">Preferencia actual: <strong>{consent === 'granted' ? 'Analítica aceptada' : consent === 'denied' ? 'Analítica rechazada' : 'Sin definir'}</strong>. Consulta el <Link to="/aviso-de-privacidad">aviso de privacidad</Link>.</p>
        </div>
        <div className="consent-banner__actions">
          <button className="button button--secondary" onClick={() => choose('denied')} type="button">Rechazar opcionales</button>
          <button className="button button--primary" onClick={() => choose('granted')} type="button">Aceptar analítica</button>
        </div>
      </div>
    </div>
  );
}
