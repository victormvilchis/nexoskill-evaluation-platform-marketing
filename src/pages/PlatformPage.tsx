import { CapabilityGrid } from '../components/common/CapabilityGrid';
import { CTASection } from '../components/common/CTASection';
import { Icon } from '../components/common/Icon';
import { JourneySteps } from '../components/common/JourneySteps';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { ValueBand } from '../components/common/ValueBand';
import { platformCapabilities, platformJourney, platformUseCases } from '../content/platform';
import { Seo } from '../seo/Seo';

export function PlatformPage() {
  return (
    <>
      <Seo
        description="Centraliza evaluaciones, contenido, rutas de preparación, participantes y resultados técnicos por organización."
        path="/plataforma"
        title="Plataforma de evaluación y desarrollo de talento"
      />
      <div>
        <PageHero
          description="Valtieris reúne evaluación, preparación y seguimiento en una operación organizada para empresas que necesitan desarrollar talento con evidencia clara."
          eyebrow="Plataforma Valtieris"
          secondaryHref="/planes"
          secondaryLabel="Conocer los planes"
          title="Una sola plataforma para convertir conocimiento en resultados medibles."
          visualItems={['Diagnóstico por competencias', 'Ruta asignada por nivel', 'Seguimiento individual y grupal', 'Resultados para tomar decisiones']}
          visualLabel="Operación integral"
          visualTitle="Del punto de partida al siguiente nivel."
        />

        <section className="section">
          <div className="container editorial-split">
            <SectionHeading
              description="Valtieris no se limita a aplicar cuestionarios. La plataforma organiza el proceso completo: contenido, personas, evaluaciones, avance y resultados."
              eyebrow="Qué resuelve"
              title="Visibilidad para operar una academia técnica con consistencia."
            />
            <div className="use-case-panel">
              <span>Casos de uso</span>
              <ul>{platformUseCases.map((item) => <li key={item}><Icon name="check" size={18} /> {item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              align="center"
              description="Cada módulo forma parte de una misma operación y puede adaptarse al alcance de la organización."
              eyebrow="Capacidades"
              title="Contenido, participantes y resultados conectados."
            />
            <CapabilityGrid items={platformCapabilities} />
          </div>
        </section>

        <section className="section section--dark">
          <div className="container journey-layout">
            <SectionHeading
              description="Una secuencia simple para pasar de la configuración inicial a decisiones basadas en resultados."
              eyebrow="Flujo de trabajo"
              title="Una operación repetible para cada programa."
            />
            <JourneySteps items={platformJourney} />
          </div>
        </section>

        <section className="section">
          <div className="container organization-showcase">
            <div className="organization-showcase__visual">
              <div className="organization-card organization-card--main">
                <span className="organization-card__icon"><Icon name="briefcase" /></span>
                <div><small>Organización</small><strong>Academia tecnológica</strong><p>Contenido, usuarios y resultados con alcance independiente.</p></div>
              </div>
              <div className="organization-card"><span><Icon name="users" /></span><div><strong>Participantes</strong><small>Asignación y seguimiento</small></div></div>
              <div className="organization-card"><span><Icon name="database" /></span><div><strong>Contenido</strong><small>Global y personalizado</small></div></div>
              <div className="organization-card"><span><Icon name="report" /></span><div><strong>Resultados</strong><small>Individuales y consolidados</small></div></div>
            </div>
            <div>
              <span className="eyebrow">Diseñada para empresas</span>
              <h2>Separa cada operación sin perder control central.</h2>
              <p>La arquitectura permite administrar organizaciones, roles y contenido con una estructura clara, evitando mezclar participantes o información entre equipos.</p>
              <ul className="check-list">
                <li><Icon name="check" size={18} /> Gestión independiente por organización.</li>
                <li><Icon name="check" size={18} /> Roles administrativos con responsabilidades definidas.</li>
                <li><Icon name="check" size={18} /> Contenido general y contenido privado.</li>
                <li><Icon name="check" size={18} /> Licenciamiento basado en capacidad y asientos.</li>
              </ul>
            </div>
          </div>
        </section>

        <ValueBand
          description="La información se presenta a nivel comercial sin publicar detalles técnicos sensibles. El control de acceso, los roles y la separación por organización forman parte del diseño de la solución."
          eyebrow="Control empresarial"
          items={['Acceso por roles', 'Separación por organización', 'Sesiones controladas', 'Configuración por ambiente']}
          linkLabel="Solicitar demo"
          linkTo="/solicitar-demo"
          title="Gobierno, seguridad y escalabilidad desde la base."
        />
      </div>
      <CTASection />
    </>
  );
}
