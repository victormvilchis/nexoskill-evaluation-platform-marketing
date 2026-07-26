import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <Seo description="La página solicitada no existe." noIndex title="Página no encontrada" />
      <div className="container">
        <span>404</span>
        <h1>Esta ruta no forma parte del sitio.</h1>
        <p>Regresa al inicio para continuar explorando NexoSkill.</p>
        <Link className="button button--primary" to="/">Volver al inicio</Link>
      </div>
    </main>
  );
}
