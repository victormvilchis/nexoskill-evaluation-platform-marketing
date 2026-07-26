import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface ArrowLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function ArrowLink({ to, children, className = '' }: ArrowLinkProps) {
  return (
    <Link className={`arrow-link ${className}`.trim()} to={to}>
      <span>{children}</span>
      <Icon name="arrow" size={18} />
    </Link>
  );
}
