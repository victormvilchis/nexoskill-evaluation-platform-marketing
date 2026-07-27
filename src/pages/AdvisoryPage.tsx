import { CapabilityGrid } from '../components/common/CapabilityGrid';
import { CTASection } from '../components/common/CTASection';
import { JourneySteps } from '../components/common/JourneySteps';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { ValueBand } from '../components/common/ValueBand';
import { LeadForm } from '../components/forms/LeadForm';
import { advisoryJourney, advisoryServices } from '../content/advisory';
import { Seo } from '../seo/Seo';

export function AdvisoryPage() {
  return (
    <>
      <Seo
        description="Asesoría para diseñar academias, rutas de aprendizaje, evaluaciones, bancos de reactivos y estrategias de desarrollo técnico."
        path="/asesorias"
        title="Asesoría en evaluación y capacitación tecnológica"
      />
      <main>
        <PageHero
          description="Acompañamos a tu organización para convertir una necesidad de capacitación o evaluación en un modelo claro, mantenible y medible."
          eyebrow="Asesoría especializada"
          secondaryHref="/plataforma"
          secondaryLabel="Conocer la plataforma"
          title="Diseñamos la estrategia formativa contigo."
          visualItems={['Entendimiento de la necesidad', 'Diagnóstico del punto de partida', 'Diseño de la solución', 'Acompañamiento y transferencia']}
          visualLabel="Acompañamiento consultivo"
          visualTitle="De una necesidad abierta a una solución operable."
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              align="center"
              description="El alcance puede concentrarse en un entregable específico o cubrir el diseño completo de una academia."
              eyebrow="Servicios de asesoría"
              title="Estructura, contenido y criterios para desarrollar talento."
            />
            <CapabilityGrid items={advisoryServices} />
          </div>
        </section>

        <section className="section section--dark">
          <div className="container journey-layout">
            <SectionHeading
              description="Trabajamos por etapas para que las decisiones de diseño tengan fundamento y puedan trasladarse a la operación."
              eyebrow="Metodología"
              title="Acompañamiento desde el entendimiento hasta la transferencia."
            />
            <JourneySteps items={advisoryJourney} />
          </div>
        </section>

        <section className="section section--soft">
          <div className="container advisory-deliverables">
            <div>
              <span className="eyebrow">Entregables posibles</span>
              <h2>Documentos y componentes que tu equipo puede utilizar.</h2>
              <p>El entregable se define según el servicio contratado y puede combinar estrategia, diseño instruccional, contenido y criterios de medición.</p>
            </div>
            <div className="deliverable-list">
              <article><span>01</span><div><strong>Mapa de competencias</strong><p>Niveles, conocimientos y evidencias esperadas.</p></div></article>
              <article><span>02</span><div><strong>Ruta formativa</strong><p>Secuencia, duración y criterios de avance.</p></div></article>
              <article><span>03</span><div><strong>Modelo de evaluación</strong><p>Cobertura, dificultad, aplicación y lectura de resultados.</p></div></article>
              <article><span>04</span><div><strong>Plan de implementación</strong><p>Fases, responsables, riesgos y recomendaciones.</p></div></article>
            </div>
          </div>
        </section>

        <ValueBand
          description="La asesoría puede complementarse con la plataforma, con un bootcamp o con un programa de capacitación para ejecutar el modelo diseñado."
          eyebrow="Solución integral"
          items={['Diagnóstico', 'Diseño', 'Contenido', 'Implementación']}
          linkLabel="Solicitar una asesoría"
          linkTo="#solicitar-asesoria"
          title="Del diseño estratégico a la operación."
        />

        <section className="section lead-capture-section" id="solicitar-asesoria">
          <div className="container lead-capture-grid">
            <div>
              <span className="eyebrow">Solicitud de asesoría</span>
              <h2>Cuéntanos qué necesitas diseñar o mejorar.</h2>
              <p>La solicitud quedará registrada para revisar el contexto, dimensionar el alcance y proponerte el siguiente paso.</p>
            </div>
            <LeadForm compact defaultService="Asesoría" description="Comparte la necesidad, el equipo involucrado y el resultado esperado." kind="advisory" source="/asesorias" submitLabel="Solicitar asesoría" title="Iniciar conversación" />
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
