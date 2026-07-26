import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface ValueBandProps {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  linkLabel: string;
  linkTo: string;
}

export function ValueBand({ eyebrow, title, description, items, linkLabel, linkTo }: ValueBandProps) {
  return (
    <section className="section value-band-section">
      <div className="container value-band">
        <div>
          <span className="eyebrow eyebrow--light">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <Link className="button button--light" to={linkTo}>{linkLabel} <Icon name="arrow" size={18} /></Link>
        </div>
        <ul>
          {items.map((item) => <li key={item}><Icon name="check" size={18} /> {item}</li>)}
        </ul>
      </div>
    </section>
  );
}
