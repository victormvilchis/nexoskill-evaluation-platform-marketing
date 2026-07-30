import { Link, useParams } from 'react-router-dom';
import { CTASection } from '../components/common/CTASection';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { Icon } from '../components/common/Icon';
import { SectionHeading } from '../components/common/SectionHeading';
import { getTechnologyBySlug } from '../content/technologies';
import { Seo } from '../seo/Seo';
import { faqSchema, serviceSchema } from '../seo/structuredData';
import { NotFoundPage } from './NotFoundPage';

export function TechnologyPage() {
  const { slug } = useParams();
  const technology = getTechnologyBySlug(slug);

  if (!technology) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Seo
        description={`${technology.summary} Conoce competencias, niveles, evaluaciones, rutas y modalidades disponibles en Valtieris.`}
        path={`/tecnologias/${technology.slug}`}
        title={`Evaluación y capacitación en ${technology.name}`}
        keywords={technology.seoKeywords}
        structuredData={[
          serviceSchema(`Evaluación y capacitación en ${technology.name}`, technology.summary, `/tecnologias/${technology.slug}`, technology.audience),
          faqSchema(technology.faqs),
        ]}
      />
      <div className="technology-detail">
        <section className="technology-detail-hero">
          <div className="container technology-detail-hero__grid">
            <div>
              <Link className="technology-detail__back" to="/tecnologias"><Icon name="arrow" size={17} /> Volver a tecnologías</Link>
              <span className="eyebrow eyebrow--hero">{technology.category}</span>
              <h1>{technology.name}</h1>
              <p className="technology-detail-hero__lead">{technology.description}</p>
              <div className="technology-detail__meta">
                <span><strong>Nivel</strong>{technology.level}</span>
                <span><strong>Competencias</strong>{technology.competencies.length} áreas</span>
                <span><strong>Modalidades</strong>{technology.modalities.length} opciones</span>
              </div>
              <div className="hero__actions">
                <Link className="button button--primary" to={`/solicitar-demo?tecnologia=${technology.slug}`}>Solicitar demo <Icon name="arrow" size={18} /></Link>
                <Link className="button button--secondary" to="/bootcamps">Consultar bootcamps</Link>
              </div>
            </div>
            <aside className="technology-detail-summary" aria-label={`Resumen de ${technology.name}`}>
              <span className="technology-detail-summary__icon">{technology.iconLabel}</span>
              <div>
                <small>Ruta por niveles</small>
                <ul>{technology.levels.map((level) => <li key={level}><Icon name="check" size={16} />{level}</li>)}</ul>
              </div>
              <div>
                <small>Modalidades disponibles</small>
                <ul>{technology.modalities.slice(0, 3).map((modality) => <li key={modality}><Icon name="check" size={16} />{modality}</li>)}</ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="section technology-audience-section">
          <div className="container technology-audience-grid">
            <div>
              <span className="eyebrow">Público objetivo</span>
              <h2>¿Para quién está diseñada esta especialidad?</h2>
            </div>
            <ul>{technology.audience.map((item) => <li key={item}><Icon name="users" size={20} />{item}</li>)}</ul>
          </div>
        </section>

        <section className="section technology-competencies-section">
          <div className="container">
            <SectionHeading
              align="center"
              description="El alcance puede configurarse según el nivel, el rol y las responsabilidades que la organización necesita evaluar."
              eyebrow="Competencias evaluadas"
              title={`Capacidades clave en ${technology.name}.`}
            />
            <div className="technology-competencies-grid">
              {technology.competencies.map((competency, index) => (
                <article key={competency.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{competency.title}</h3>
                  <p>{competency.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--dark technology-offerings-section">
          <div className="container">
            <SectionHeading
              align="center"
              description="Selecciona un diagnóstico puntual o combina plataforma, contenido y acompañamiento dentro de un programa integral."
              eyebrow="Formas de preparación"
              title="Convierte la especialidad en una solución medible."
            />
            <div className="technology-offerings-grid">
              {technology.offerings.map((offering) => (
                <article key={offering.title}>
                  <span><Icon name={offering.icon} /></span>
                  <h3>{offering.title}</h3>
                  <p>{offering.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section technology-path-section">
          <div className="container technology-path-grid">
            <div>
              <SectionHeading
                description="Una secuencia de referencia que puede ajustarse después del diagnóstico inicial."
                eyebrow="Ruta de preparación"
                title="Del punto de partida a una evidencia final."
              />
              <ol className="technology-learning-path">
                {technology.learningPath.map((step, index) => (
                  <li key={step}><span>{index + 1}</span><div><strong>{step}</strong><small>{index === 0 ? 'Punto de entrada' : index === technology.learningPath.length - 1 ? 'Cierre del programa' : 'Desarrollo de capacidades'}</small></div></li>
                ))}
              </ol>
            </div>
            <aside className="technology-programs-panel">
              <span className="eyebrow">Programas relacionados</span>
              <h2>Opciones para profundizar.</h2>
              <ul>{technology.relatedPrograms.map((program) => <li key={program}><Icon name="book" size={19} />{program}</li>)}</ul>
              <p>Los nombres representan líneas de preparación configurables, no certificaciones oficiales.</p>
              <Link className="arrow-link" to={`/solicitar-demo?tecnologia=${technology.slug}`}>Diseñar un programa <Icon name="arrow" size={18} /></Link>
            </aside>
          </div>
        </section>

        <section className="section faq-section technology-faq-section">
          <div className="container faq-grid">
            <div>
              <SectionHeading
                description="Respuestas sobre el alcance, las modalidades y el uso responsable del contenido."
                eyebrow="Preguntas frecuentes"
                title={`Antes de comenzar con ${technology.name}.`}
              />
              <Link className="arrow-link" to="/preguntas-frecuentes">Ver preguntas generales <Icon name="arrow" size={18} /></Link>
            </div>
            <FaqAccordion items={technology.faqs} />
          </div>
        </section>

        <CTASection
          description={`Diseñemos una evaluación o ruta de preparación en ${technology.name} alineada con el nivel y los objetivos de tu equipo.`}
          title={`Desarrolla capacidades en ${technology.name}.`}
        />
      </div>
    </>
  );
}
