import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { featuredTechnologies } from '../content/technologies';
import { Seo } from '../seo/Seo';
import { NotFoundPage } from './NotFoundPage';

export function TechnologyPage() {
  const { slug } = useParams();
  const technology = featuredTechnologies.find((item) => item.slug === slug);

  if (!technology) {
    return <NotFoundPage />;
  }

  return (
    <main className="subpage technology-detail">
      <Seo
        description={`${technology.summary} Conoce las modalidades de evaluación y preparación disponibles en NexoSkill.`}
        path={`/tecnologias/${technology.slug}`}
        title={`Preparación en ${technology.name}`}
      />
      <section className="subpage-hero">
        <div className="container subpage-hero__grid">
          <div>
            <span className="eyebrow eyebrow--hero">{technology.category}</span>
            <h1>{technology.name}</h1>
            <p>{technology.summary}</p>
            <div className="technology-detail__meta">
              <span>Nivel: {technology.level}</span>
              <span>Evaluaciones diagnósticas</span>
              <span>Rutas de preparación</span>
            </div>
            <div className="hero__actions">
              <Link className="button button--primary" to={`/solicitar-demo?tecnologia=${technology.slug}`}>Solicitar información <Icon name="arrow" size={18} /></Link>
              <Link className="button button--secondary" to="/tecnologias">Ver tecnologías</Link>
            </div>
          </div>
          <div className="technology-detail__visual">
            <span>{technology.iconLabel}</span>
            <div>
              <strong>Competencias</strong>
              <p>La página detallada incluirá niveles, modalidades, evaluaciones, rutas y preguntas frecuentes durante la Parte 3.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
