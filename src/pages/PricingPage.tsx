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
    <div>
      <Seo
        description="Compara los planes comerciales de Valtieris para evaluar, preparar y dar seguimiento al talento tecnológico con un alcance claro."
        path="/planes"
        title="Planes comerciales"
      />
      <PageHero
        description="Elige el nivel de plataforma, capacidad y contenido tecnológico que corresponde a tu operación. La propuesta final se ajusta al alcance real de cada organización."
        eyebrow="Planes comerciales"
        secondaryHref="#comparacion"
        secondaryLabel="Comparar capacidades"
        title="Una solución comercial para cada etapa de crecimiento."
        visualItems={['Plataforma desde Starter', 'Contenido según el plan', 'Capacidad flexible', 'Acompañamiento escalable']}
        visualLabel="Modelo comercial"
        visualTitle="Sin precios genéricos ni alcances ambiguos."
      />

      <section className="section pricing-page-section">
        <div className="container">
          <SectionHeading
            align="center"
            description="Los planes combinan plataforma, capacidad y contenido tecnológico. Los servicios especializados se agregan según el objetivo del programa."
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
            description="Revisa la capacidad y el contenido incluido en cada opción. La propuesta definitiva puede ajustar alcance y servicios sin duplicar configuraciones en el sitio."
            eyebrow="Comparación"
            title="Capacidades por plan."
          />
          <PlanComparison />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            description="La plataforma, los asientos y el contenido tecnológico se definen por plan y se mantienen separados de los servicios de capacitación o consultoría."
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
              description="Aclara cómo se administran la capacidad, el contenido tecnológico, los servicios y el crecimiento del plan."
              eyebrow="Preguntas de contratación"
              title="Lo esencial antes de solicitar una propuesta."
            />
            <Link className="arrow-link" to="/preguntas-frecuentes">Ver todas las preguntas <Icon name="arrow" size={17} /></Link>
          </div>
          <FaqAccordion items={pricingFaqs.slice(0, 6)} />
        </div>
      </section>

      <CTASection
        description="Selecciona un plan y comparte el contexto de tu organización. Prepararemos la información necesaria para construir una propuesta comercial."
        eyebrow="Siguiente paso"
        primaryHref="/solicitar-cotizacion"
        primaryLabel="Solicitar cotización"
        secondaryHref="/solicitar-demo"
        secondaryLabel="Solicitar demo"
        title="Dimensionemos tu programa."
      />
    </div>
  );
}
