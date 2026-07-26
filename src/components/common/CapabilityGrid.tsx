import type { PageCapability } from '../../types/content';
import { Icon } from './Icon';

interface CapabilityGridProps {
  items: PageCapability[];
  columns?: 2 | 3;
}

export function CapabilityGrid({ items, columns = 3 }: CapabilityGridProps) {
  return (
    <div className={`capability-grid capability-grid--${columns}`}>
      {items.map((item) => (
        <article className="capability-card" key={item.title}>
          <span className="capability-card__icon"><Icon name={item.icon} /></span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.bullets?.length ? (
            <ul>
              {item.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={16} /> {bullet}</li>)}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
