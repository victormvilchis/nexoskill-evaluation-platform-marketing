import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function CTASection() {
  return (
    <section className="section cta-wrap" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-panel">
          <div>
            <span className="eyebrow eyebrow--light">Convierte preparación en resultados</span>
            <h2 id="cta-title">Diseñemos una solución para tu equipo.</h2>
            <p>
              Cuéntanos qué tecnología necesitas evaluar, cuántas personas participarán y cuál es el objetivo del programa.
            </p>
          </div>
          <div className="cta-panel__actions">
            <Link className="button button--light" to="/solicitar-demo">
              Solicitar una demo <Icon name="arrow" size={18} />
            </Link>
            <Link className="button button--ghost-light" to="/contacto">Hablar con ventas</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
