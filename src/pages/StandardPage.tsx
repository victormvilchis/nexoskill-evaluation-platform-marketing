import { Link } from 'react-router-dom';
import { CTASection } from '../components/common/CTASection';
import { Icon } from '../components/common/Icon';
import { Seo } from '../seo/Seo';

interface StandardPageProps {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  highlights?: string[];
  note?: string;
}

export function StandardPage({ eyebrow, title, description, path, highlights = [], note }: StandardPageProps) {
  return (
    <>
      <Seo description={description} path={path} title={title} />
      <main className="subpage">
        <section className="subpage-hero">
          <div className="container subpage-hero__grid">
            <div>
              <span className="eyebrow eyebrow--hero">{eyebrow}</span>
              <h1>{title}</h1>
              <p>{description}</p>
              <div className="hero__actions">
                <Link className="button button--primary" to="/solicitar-demo">Solicitar información <Icon name="arrow" size={18} /></Link>
                <Link className="button button--secondary" to="/">Volver al inicio</Link>
              </div>
            </div>
            <div className="subpage-card">
              <span>Próxima fase de contenido</span>
              <h2>La estructura ya está preparada.</h2>
              <p>{note ?? 'Esta sección se desarrollará en profundidad durante la fase correspondiente del roadmap 0.1.0.'}</p>
              {highlights.length > 0 ? <ul>{highlights.map((highlight) => <li key={highlight}><Icon name="check" size={17} /> {highlight}</li>)}</ul> : null}
            </div>
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
