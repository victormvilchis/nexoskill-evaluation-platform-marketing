import { Link } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { featuredTechnologies } from '../content/technologies';
import { Seo } from '../seo/Seo';

export function TechnologiesPage() {
  return (
    <>
      <Seo
        description="Catálogo de tecnologías y competencias disponibles para evaluación, capacitación y preparación técnica en NexoSkill."
        path="/tecnologias"
        title="Tecnologías y competencias"
      />
      <main>
        <PageHero
          description="Evalúa y desarrolla capacidades en tecnologías ampliamente utilizadas, con contenido organizado por competencia y nivel."
          eyebrow="Catálogo tecnológico"
          secondaryHref="/bootcamps"
          secondaryLabel="Ver bootcamps"
          title="Preparación especializada para perfiles y retos tecnológicos reales."
          visualItems={['Tecnologías públicas y reconocidas', 'Contenido original por competencia', 'Niveles de entrada a avanzado', 'Modalidades de evaluación y formación']}
          visualLabel="Catálogo extensible"
          visualTitle="Una base preparada para incorporar nuevas especialidades."
        />
        <section className="section">
          <div className="container">
            <SectionHeading
              align="center"
              description="El detalle de niveles, competencias y modalidades se ampliará en la Parte 3 del roadmap."
              eyebrow="Especialidades"
              title="Tecnologías disponibles en NexoSkill."
            />
            <div className="technology-catalog-grid">
              {featuredTechnologies.map((technology) => (
                <Link className="technology-catalog-card" key={technology.slug} to={`/tecnologias/${technology.slug}`}>
                  <span className="technology-card__icon">{technology.iconLabel}</span>
                  <small>{technology.category}</small>
                  <h2>{technology.name}</h2>
                  <p>{technology.summary}</p>
                  <div><span>{technology.level}</span><Icon name="arrow" size={18} /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
