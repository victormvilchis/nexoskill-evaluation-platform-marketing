import type { ProgramItem } from '../../types/content';
import { Icon } from './Icon';

interface ProgramGridProps {
  items: ProgramItem[];
}

export function ProgramGrid({ items }: ProgramGridProps) {
  return (
    <div className="program-grid">
      {items.map((item) => (
        <article className="program-card" key={item.title}>
          <div className="program-card__top">
            <span className="program-card__icon"><Icon name={item.icon} /></span>
            {item.tag ? <small>{item.tag}</small> : null}
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <ul>{item.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={16} /> {bullet}</li>)}</ul>
        </article>
      ))}
    </div>
  );
}
