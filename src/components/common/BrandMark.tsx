import { Link } from 'react-router-dom';

interface BrandMarkProps {
  inverse?: boolean;
}

export function BrandMark({ inverse = false }: BrandMarkProps) {
  const source = inverse
    ? '/brand/valtieris-logo-inverse-720.png'
    : '/brand/valtieris-logo-720.png';

  return (
    <Link className={`brand ${inverse ? 'brand--inverse' : ''}`} to="/" aria-label="Valtieris, inicio">
      <img
        alt=""
        aria-hidden="true"
        className="brand__logo"
        decoding="async"
        height="188"
        src={source}
        width="720"
      />
      <span className="sr-only">Valtieris</span>
    </Link>
  );
}
