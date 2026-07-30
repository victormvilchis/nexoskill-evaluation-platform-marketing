import { CTASection } from '../components/common/CTASection';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { faqs } from '../content/faqs';
import { pricingFaqs } from '../content/pricingFaqs';
import { Seo } from '../seo/Seo';
import { faqSchema } from '../seo/structuredData';

export function FaqPage() {
  return (
    <div>
      <Seo
        description="Respuestas sobre la plataforma Valtieris, asientos, contenido, planes, personalización, bootcamps, seguridad y contratación."
        path="/preguntas-frecuentes"
        title="Preguntas frecuentes"
        structuredData={faqSchema([...faqs, ...pricingFaqs])}
      />
      <PageHero
        description="Consulta cómo funciona la solución, qué puede personalizarse y cómo se dimensionan los planes y servicios para cada organización."
        eyebrow="Centro de respuestas"
        secondaryHref="/contacto"
        secondaryLabel="Hablar con ventas"
        title="Información clara antes de tomar una decisión."
        visualItems={['Plataforma y contenido', 'Asientos y administración', 'Planes y servicios', 'Implementación y soporte']}
        visualLabel="Preguntas frecuentes"
        visualTitle="Respuestas comerciales sin promesas no validadas."
      />

      <section className="section faq-page-section">
        <div className="container faq-page-grid">
          <div>
            <SectionHeading
              description="Información general sobre el uso de la plataforma, el contenido y los programas de desarrollo de talento."
              eyebrow="Solución"
              title="Plataforma y servicios."
            />
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container faq-page-grid">
          <div>
            <SectionHeading
              description="Detalles iniciales sobre capacidad, personalización y proceso de cotización."
              eyebrow="Contratación"
              title="Planes y alcance comercial."
            />
          </div>
          <FaqAccordion items={pricingFaqs} />
        </div>
      </section>

      <CTASection
        description="Comparte el tamaño del equipo, las tecnologías de interés y el objetivo del programa para orientar la conversación comercial."
        primaryHref="/solicitar-cotizacion"
        primaryLabel="Solicitar cotización"
        title="¿Tu escenario necesita una respuesta específica?"
      />
    </div>
  );
}
