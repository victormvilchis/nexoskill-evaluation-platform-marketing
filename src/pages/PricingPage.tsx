import { Link } from 'react-router-dom';
import { CTASection } from '../components/common/CTASection';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { Icon } from '../components/common/Icon';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { PlanComparison } from '../components/pricing/PlanComparison';
import { PricingCard } from '../components/pricing/PricingCard';
import { planPrinciples, plans } from '../content/plans';
import { pricingFaqs } from '../content/pricingFaqs';
import { Seo } from '../seo/Seo';

export function PricingPage() {
  return (
    <main>
      <Seo
        description="Compara los planes comerciales de NexoSkill para evaluar, preparar y dar seguimiento al talento tecnológico de tu organización."
        path="/planes"
        title="Planes comerciales"
      />
      <PageHero
        description="Elige una base de capacidad y personalización para tu equipo. La cotización final se construye con asientos, tecnologías, operación y acompañamiento reales."
        eyebrow="Planes NexoSkill"
        secondaryHref="#comparacion"
        secondaryLabel="Comparar capacidades"
        title="Una solución comercial para cada etapa de crecimiento."
        visualItems={['Capacidad por asientos', 'Contenido global o personalizado', 'Reportes según la operación', 'Acompañamiento escalable']}
        visualLabel="Modelo comercial"
        visualTitle="Sin precios genéricos ni alcances ambiguos."
      />

      <section className="section pricing-page-section">
        <div className="container">
          <SectionHeading
            align="center"
            description="Los planes centralizan capacidad, administración y seguimiento. Los servicios especializados se agregan según el objetivo del programa."
            eyebrow="Opciones comerciales"
            title="Comienza con el alcance adecuado."
          />
          <div className="pricing-grid pricing-grid--four">
            {plans.map((plan) => <PricingCard key={plan.id} plan={plan} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="comparacion">
        <div className="container">
          <SectionHeading
            description="Revisa las diferencias operativas principales. La propuesta definitiva puede ajustar capacidad y servicios sin duplicar configuraciones en el sitio."
            eyebrow="Comparación"
            title="Capacidades por plan."
          />
          <PlanComparison />
          <p className="comparison-note"><Icon name="shield" size={18} /> Las integraciones, SSO y API se validan técnica y comercialmente antes de incluirse en una propuesta.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            description="El licenciamiento se dimensiona con base en el uso previsto y se mantiene separado de los servicios de capacitación o consultoría."
            eyebrow="Cómo cotizamos"
            title="Transparencia desde el alcance inicial."
          />
          <div className="pricing-principles">
            {planPrinciples.map((principle, index) => (
              <article key={principle.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
          <div className="pricing-services-note">
            <div>
              <span className="eyebrow">Servicios adicionales</span>
              <h2>Agrega acompañamiento cuando el programa lo requiera.</h2>
              <p>Bootcamps, capacitaciones, diseño de academias, construcción de contenido y asesorías se cotizan por alcance, modalidad y duración.</p>
            </div>
            <div>
              {['Bootcamps personalizados', 'Capacitaciones empresariales', 'Diseño de evaluaciones', 'Asesoría de academias'].map((item) => (
                <span key={item}><Icon name="check" size={17} /> {item}</span>
              ))}
              <Link className="arrow-link" to="/asesorias">Conocer servicios <Icon name="arrow" size={17} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <SectionHeading
              description="Aclara cómo se administran los asientos, la personalización, los servicios y el crecimiento del plan."
              eyebrow="Preguntas de contratación"
              title="Lo esencial antes de solicitar una propuesta."
            />
            <Link className="arrow-link" to="/preguntas-frecuentes">Ver todas las preguntas <Icon name="arrow" size={17} /></Link>
          </div>
          <FaqAccordion items={pricingFaqs.slice(0, 6)} />
        </div>
      </section>

      <CTASection
        description="Selecciona un plan y comparte el tamaño de tu equipo. Prepararemos el contexto necesario para construir una propuesta comercial."
        eyebrow="Siguiente paso"
        primaryHref="/solicitar-cotizacion"
        primaryLabel="Solicitar cotización"
        secondaryHref="/solicitar-demo"
        secondaryLabel="Solicitar demo"
        title="Dimensionemos tu programa."
      />
    </main>
  );
}
