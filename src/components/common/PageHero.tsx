import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  visualLabel: string;
  visualTitle: string;
  visualItems: string[];
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  visualLabel,
  visualTitle,
  visualItems,
  secondaryLabel = 'Conocer las soluciones',
  secondaryHref = '/empresas',
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__glow" aria-hidden="true" />
      <div className="container page-hero__grid">
        <div className="page-hero__content">
          <span className="eyebrow eyebrow--hero">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="hero__actions">
            <Link className="button button--primary button--large" to="/solicitar-demo">
              Solicitar información <Icon name="arrow" size={18} />
            </Link>
            <Link className="button button--secondary button--large" to={secondaryHref}>{secondaryLabel}</Link>
          </div>
        </div>
        <div className="page-hero__visual" aria-label={visualTitle}>
          <span className="page-hero__visual-label">{visualLabel}</span>
          <h2>{visualTitle}</h2>
          <div className="page-hero__visual-list">
            {visualItems.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
                <Icon name="check" size={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
