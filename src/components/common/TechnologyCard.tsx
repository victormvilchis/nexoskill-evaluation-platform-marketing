import { Link } from 'react-router-dom';
import type { Technology } from '../../types/content';
import { Icon } from './Icon';

interface TechnologyCardProps {
  technology: Technology;
}

export function TechnologyCard({ technology }: TechnologyCardProps) {
  return (
    <Link className="technology-catalog-card" to={`/tecnologias/${technology.slug}`}>
      <div className="technology-catalog-card__header">
        <span className="technology-card__icon">{technology.iconLabel}</span>
        <small>{technology.category}</small>
      </div>
      <h2>{technology.name}</h2>
      <p>{technology.summary}</p>
      <ul className="technology-catalog-card__levels" aria-label={`Niveles de ${technology.name}`}>
        {technology.levels.slice(0, 3).map((level) => <li key={level}>{level}</li>)}
      </ul>
      <div className="technology-catalog-card__footer">
        <span>{technology.level}</span>
        <span className="technology-catalog-card__link">Ver especialidad <Icon name="arrow" size={18} /></span>
      </div>
    </Link>
  );
}
