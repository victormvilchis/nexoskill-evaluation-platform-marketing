import { Link } from 'react-router-dom';
import type { Plan } from '../../types/content';
import { Icon } from '../common/Icon';

interface PricingCardProps {
  plan: Plan;
  compact?: boolean;
}

export function PricingCard({ plan, compact = false }: PricingCardProps) {
  const quoteHref = `/solicitar-cotizacion?plan=${encodeURIComponent(plan.id)}`;

  return (
    <article className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''} ${compact ? 'pricing-card--compact' : ''}`}>
      {plan.featured ? <span className="pricing-card__badge">Recomendado</span> : null}
      <span className="pricing-card__audience">{plan.audience}</span>
      <h3>{plan.name}</h3>
      <p>{plan.description}</p>
      <strong className="pricing-card__price">{plan.priceLabel}</strong>
      {!compact ? (
        <div className="pricing-card__summary" aria-label={`Resumen de ${plan.name}`}>
          <span><small>Capacidad</small>{plan.seats}</span>
          <span><small>Tecnologías</small>{plan.technologyScope}</span>
        </div>
      ) : null}
      <ul>
        {plan.features.slice(0, compact ? 4 : plan.features.length).map((feature) => (
          <li key={feature}><Icon name="check" size={17} /> {feature}</li>
        ))}
      </ul>
      <Link className={`button ${plan.featured ? 'button--primary' : 'button--secondary'} button--full`} to={quoteHref}>
        {compact ? 'Consultar plan' : plan.ctaLabel}
      </Link>
    </article>
  );
}
