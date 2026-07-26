import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface CTASectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  eyebrow = 'Convierte preparación en resultados',
  title = 'Diseñemos una solución para tu equipo.',
  description = 'Cuéntanos qué tecnología necesitas evaluar, cuántas personas participarán y cuál es el objetivo del programa.',
  primaryLabel = 'Solicitar una demo',
  primaryHref = '/solicitar-demo',
  secondaryLabel = 'Hablar con ventas',
  secondaryHref = '/contacto',
}: CTASectionProps) {
  return (
    <section className="section cta-wrap" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-panel">
          <div>
            <span className="eyebrow eyebrow--light">{eyebrow}</span>
            <h2 id="cta-title">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="cta-panel__actions">
            <Link className="button button--light" to={primaryHref}>
              {primaryLabel} <Icon name="arrow" size={18} />
            </Link>
            <Link className="button button--ghost-light" to={secondaryHref}>{secondaryLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
