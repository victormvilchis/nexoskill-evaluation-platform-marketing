import { CapabilityGrid } from '../components/common/CapabilityGrid';
import { CTASection } from '../components/common/CTASection';
import { JourneySteps } from '../components/common/JourneySteps';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { ValueBand } from '../components/common/ValueBand';
import { talentCapabilities, talentJourney } from '../content/talent';
import { Seo } from '../seo/Seo';

export function TalentEvaluationPage() {
  return (
    <>
      <Seo
        description="Evalúa candidatos y equipos tecnológicos, identifica brechas y genera resultados comparables por competencia y nivel."
        path="/empresas"
        title="Evaluación de talento tecnológico para empresas"
      />
      <main>
        <PageHero
          description="Obtén una lectura consistente del conocimiento técnico antes de contratar, asignar, capacitar o preparar a un equipo."
          eyebrow="Soluciones para empresas"
          secondaryHref="/plataforma"
          secondaryLabel="Explorar la plataforma"
          title="Conoce el nivel real de tu talento y decide el siguiente paso."
          visualItems={['Perfil y competencias esperadas', 'Evaluación alineada al nivel', 'Resultados comparables', 'Recomendación de preparación']}
          visualLabel="Evaluación de talento"
          visualTitle="Criterios homogéneos para decisiones más claras."
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              align="center"
              description="La evaluación se adapta al contexto de uso sin perder consistencia en la forma de medir y comparar resultados."
              eyebrow="Capacidades"
              title="Evalúa candidatos, colaboradores y equipos completos."
            />
            <CapabilityGrid items={talentCapabilities} />
          </div>
        </section>

        <section className="section section--dark">
          <div className="container journey-layout">
            <SectionHeading
              description="El valor no está únicamente en una puntuación, sino en relacionarla con el perfil esperado y con una acción concreta."
              eyebrow="Proceso"
              title="De la definición del perfil a una decisión accionable."
            />
            <JourneySteps items={talentJourney} />
          </div>
        </section>

        <section className="section section--soft">
          <div className="container report-showcase">
            <div className="report-showcase__preview">
              <div className="report-showcase__header"><span>Resumen de evaluación</span><small>Vista ilustrativa</small></div>
              <div className="report-showcase__score"><strong>78</strong><span>/ 100</span><p>Nivel observado: intermedio</p></div>
              <div className="report-showcase__bars">
                <div><span>Fundamentos</span><i><b style={{ width: '88%' }} /></i><strong>88%</strong></div>
                <div><span>Implementación</span><i><b style={{ width: '76%' }} /></i><strong>76%</strong></div>
                <div><span>Calidad</span><i><b style={{ width: '72%' }} /></i><strong>72%</strong></div>
                <div><span>Seguridad</span><i><b style={{ width: '64%' }} /></i><strong>64%</strong></div>
              </div>
            </div>
            <div>
              <span className="eyebrow">Resultados útiles</span>
              <h2>Una puntuación acompañada de contexto.</h2>
              <p>Los resultados permiten identificar fortalezas, áreas de mejora y diferencias respecto del nivel esperado, facilitando decisiones de preparación o asignación.</p>
              <ul className="check-list">
                <li>Lectura por competencia y nivel.</li>
                <li>Resultados individuales y consolidados.</li>
                <li>Comparación bajo criterios comunes.</li>
                <li>Recomendaciones para el siguiente paso.</li>
              </ul>
            </div>
          </div>
        </section>

        <ValueBand
          description="La evaluación puede ser el inicio de una ruta de capacitación, un bootcamp o un programa de acompañamiento para cerrar las brechas detectadas."
          eyebrow="De medir a desarrollar"
          items={['Evaluación inicial', 'Ruta recomendada', 'Seguimiento', 'Evaluación final']}
          linkLabel="Evaluar a mi equipo"
          linkTo="/solicitar-demo"
          title="Conecta el diagnóstico con una acción formativa."
        />
      </main>
      <CTASection />
    </>
  );
}
