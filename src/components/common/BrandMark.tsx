import { Link } from 'react-router-dom';

interface BrandMarkProps {
  inverse?: boolean;
}

export function BrandMark({ inverse = false }: BrandMarkProps) {
  return (
    <Link className={`brand ${inverse ? 'brand--inverse' : ''}`} to="/" aria-label="NexoSkill, inicio">
      <span className="brand__symbol" aria-hidden="true">N</span>
      <span className="brand__word">NexoSkill</span>
    </Link>
  );
}
