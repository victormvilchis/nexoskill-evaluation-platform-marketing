import { Link, useLocation } from 'react-router-dom';
import { Seo } from '../seo/Seo';

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="not-found">
      <Seo description="La página solicitada no existe." noIndex path={pathname} title="Página no encontrada" />
      <div className="container">
        <span>404</span>
        <h1>Esta ruta no forma parte del sitio.</h1>
        <p>Regresa al inicio para continuar explorando Valtieris.</p>
        <Link className="button button--primary" to="/">Volver al inicio</Link>
      </div>
    </div>
  );
}
