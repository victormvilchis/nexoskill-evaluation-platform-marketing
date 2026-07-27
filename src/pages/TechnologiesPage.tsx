import { useMemo, useState } from 'react';
import { CTASection } from '../components/common/CTASection';
import { Icon } from '../components/common/Icon';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { TechnologyCard } from '../components/common/TechnologyCard';
import { technologies, technologyCategories } from '../content/technologies';
import { Seo } from '../seo/Seo';

export function TechnologiesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');

  const filteredTechnologies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es-MX');

    return technologies.filter((technology) => {
      const matchesCategory = category === 'Todas' || technology.category === category;
      const searchableText = [
        technology.name,
        technology.summary,
        technology.category,
        technology.level,
        ...technology.competencies.map((competency) => competency.title),
      ].join(' ').toLocaleLowerCase('es-MX');
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, query]);

  const resetFilters = () => {
    setQuery('');
    setCategory('Todas');
  };

  return (
    <>
      <Seo
        description="Catálogo de tecnologías para evaluación, capacitación, bootcamps y desarrollo de talento técnico con rutas organizadas por competencias y nivel."
        path="/tecnologias"
        title="Tecnologías y competencias"
      />
      <div>
        <PageHero
          description="Configura evaluaciones, rutas y programas sobre especialidades tecnológicas públicas, con contenido original y un alcance adaptable a cada equipo."
          eyebrow="Catálogo tecnológico"
          secondaryHref="/bootcamps"
          secondaryLabel="Ver bootcamps"
          title="Preparación especializada para perfiles y retos tecnológicos reales."
          visualItems={['10 especialidades públicas', 'Contenido original por competencia', 'Niveles de fundamentos a avanzado', 'Evaluación, rutas y capacitación']}
          visualLabel="Catálogo extensible"
          visualTitle="Una base preparada para incorporar nuevas capacidades."
        />

        <section className="section technology-catalog-section">
          <div className="container">
            <SectionHeading
              align="center"
              description="Explora el catálogo completo o filtra por área. Cada especialidad detalla competencias, niveles, modalidades y programas relacionados."
              eyebrow="Especialidades"
              title="Tecnologías disponibles en NexoSkill."
            />

            <div className="technology-filters" role="search" aria-label="Filtrar tecnologías">
              <label className="technology-search">
                <span>Buscar especialidad o competencia</span>
                <div>
                  <Icon name="search" size={20} />
                  <input
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ej. Java, datos, seguridad..."
                    type="search"
                    value={query}
                  />
                </div>
              </label>
              <label className="technology-category-filter">
                <span>Área</span>
                <select onChange={(event) => setCategory(event.target.value)} value={category}>
                  {technologyCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <div className="technology-results-bar" aria-live="polite">
              <p><strong>{filteredTechnologies.length}</strong> {filteredTechnologies.length === 1 ? 'especialidad encontrada' : 'especialidades encontradas'}</p>
              {(query || category !== 'Todas') ? <button onClick={resetFilters} type="button">Limpiar filtros</button> : null}
            </div>

            {filteredTechnologies.length > 0 ? (
              <div className="technology-catalog-grid">
                {filteredTechnologies.map((technology) => <TechnologyCard key={technology.slug} technology={technology} />)}
              </div>
            ) : (
              <div className="technology-empty-state">
                <span><Icon name="search" size={26} /></span>
                <h2>No encontramos una coincidencia.</h2>
                <p>Prueba con otra palabra o restablece los filtros para consultar el catálogo completo.</p>
                <button className="button button--secondary" onClick={resetFilters} type="button">Ver todas las tecnologías</button>
              </div>
            )}
          </div>
        </section>

        <section className="section section--dark technology-principles-section">
          <div className="container">
            <SectionHeading
              align="center"
              description="La comunicación comercial se mantiene independiente de fabricantes, instituciones y materiales protegidos."
              eyebrow="Contenido responsable"
              title="Preparación basada en competencias, no en afirmaciones oficiales."
            />
            <div className="technology-principles-grid">
              <article><Icon name="clipboard" /><h3>Reactivos originales</h3><p>Evaluaciones y escenarios creados para medir capacidades sin presentar preguntas oficiales o protegidas.</p></article>
              <article><Icon name="target" /><h3>Alcance configurable</h3><p>Competencias, niveles y modalidades ajustables al objetivo del equipo y al perfil que se necesita desarrollar.</p></article>
              <article><Icon name="shield" /><h3>Uso responsable de marca</h3><p>Las especialidades se describen sin atribuir afiliaciones, autorizaciones o certificaciones que no hayan sido concedidas.</p></article>
            </div>
          </div>
        </section>

        <CTASection
          description="Cuéntanos qué perfiles necesitas evaluar o desarrollar y diseñaremos una ruta alineada con tus objetivos."
          title="Construyamos tu catálogo tecnológico."
        />
      </div>
    </>
  );
}
