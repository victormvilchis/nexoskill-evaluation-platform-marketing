import { CTASection } from '../components/common/CTASection';
import { JourneySteps } from '../components/common/JourneySteps';
import { PageHero } from '../components/common/PageHero';
import { ProgramGrid } from '../components/common/ProgramGrid';
import { SectionHeading } from '../components/common/SectionHeading';
import { ValueBand } from '../components/common/ValueBand';
import { LeadForm } from '../components/forms/LeadForm';
import { bootcampJourney, bootcampPrograms } from '../content/bootcamps';
import { Seo } from '../seo/Seo';

export function BootcampsPage() {
  return (
    <>
      <Seo
        description="Bootcamps tecnológicos empresariales con diagnóstico, sesiones prácticas, seguimiento, evaluaciones y reporte final."
        path="/bootcamps"
        title="Bootcamps tecnológicos para empresas"
      />
      <main>
        <PageHero
          description="Programas intensivos para acelerar el desarrollo de capacidades con una ruta clara, práctica guiada y seguimiento durante todo el proceso."
          eyebrow="Bootcamps NexoSkill"
          secondaryHref="/capacitaciones"
          secondaryLabel="Ver capacitaciones"
          title="Preparación intensiva con objetivos, seguimiento y cierre medible."
          visualItems={['Evaluación diagnóstica', 'Sesiones y práctica aplicada', 'Cortes de seguimiento', 'Evaluación y reporte final']}
          visualLabel="Programa estructurado"
          visualTitle="Cada etapa tiene un propósito verificable."
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              align="center"
              description="Los programas se configuran según la tecnología, el nivel de entrada, el objetivo del equipo y el tiempo disponible."
              eyebrow="Programas disponibles"
              title="Bootcamps orientados a capacidades tecnológicas relevantes."
            />
            <ProgramGrid items={bootcampPrograms} />
          </div>
        </section>

        <section className="section section--dark">
          <div className="container journey-layout">
            <SectionHeading
              description="El programa no comienza con un temario genérico: parte del nivel real y se ajusta a la meta definida."
              eyebrow="Estructura"
              title="Un proceso completo antes, durante y después de las sesiones."
            />
            <JourneySteps items={bootcampJourney} />
          </div>
        </section>

        <section className="section section--soft">
          <div className="container delivery-grid">
            <div>
              <span className="eyebrow">Modalidad empresarial</span>
              <h2>La duración y profundidad se ajustan al contexto del equipo.</h2>
              <p>Un bootcamp puede operar como una preparación acelerada, una academia de incorporación o un programa de cierre de brechas. El alcance se define antes de iniciar.</p>
            </div>
            <div className="delivery-options">
              <article><strong>Remoto</strong><p>Sesiones en línea, seguimiento y evaluación dentro de una misma operación.</p></article>
              <article><strong>Por cohortes</strong><p>Grupos organizados por nivel, perfil o fecha de incorporación.</p></article>
              <article><strong>Personalizado</strong><p>Temario, duración y criterios de cierre alineados con la necesidad.</p></article>
              <article><strong>Con plataforma</strong><p>Evaluaciones, rutas y resultados disponibles para seguimiento.</p></article>
            </div>
          </div>
        </section>

        <ValueBand
          description="Al finalizar, la organización recibe una lectura clara del avance, las competencias fortalecidas y las brechas que todavía requieren atención."
          eyebrow="Resultado del programa"
          items={['Resultados por participante', 'Visión consolidada del grupo', 'Brechas identificadas', 'Recomendaciones de continuidad']}
          linkLabel="Consultar un bootcamp"
          linkTo="#consultar-bootcamp"
          title="No solo impartimos sesiones: medimos el proceso."
        />

        <section className="section lead-capture-section" id="consultar-bootcamp">
          <div className="container lead-capture-grid">
            <div>
              <span className="eyebrow">Consulta de bootcamp</span>
              <h2>Diseñemos el programa según tu equipo.</h2>
              <p>Comparte la tecnología, el número de participantes y el objetivo para dimensionar una propuesta.</p>
            </div>
            <LeadForm compact defaultService="Bootcamp" description="Indica la tecnología, el nivel esperado y el tiempo disponible." kind="bootcamp" source="/bootcamps" submitLabel="Consultar bootcamp" title="Solicitar información" />
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
