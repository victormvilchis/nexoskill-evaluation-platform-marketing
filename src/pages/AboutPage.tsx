import { Link } from 'react-router-dom';
import { CTASection } from '../components/common/CTASection';
import { Icon } from '../components/common/Icon';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { aboutAudiences, aboutModel, aboutPrinciples } from '../content/about';
import { Seo } from '../seo/Seo';

export function AboutPage() {
  return (
    <div className="about-page">
      <Seo
        description="Conoce el enfoque de Valtieris para evaluar, preparar y desarrollar talento tecnológico mediante plataforma, contenido y acompañamiento especializado."
        path="/nosotros"
        title="Acerca de Valtieris"
      />

      <PageHero
        description="Valtieris integra tecnología, contenido y acompañamiento para que las organizaciones desarrollen capacidades técnicas con una ruta clara y resultados observables."
        eyebrow="Acerca de Valtieris"
        secondaryHref="/plataforma"
        secondaryLabel="Conocer la plataforma"
        title="Convertimos conocimiento técnico en experiencias de desarrollo medibles."
        visualItems={['Evaluación con propósito', 'Rutas alineadas con competencias', 'Seguimiento durante el proceso', 'Resultados para decidir el siguiente paso']}
        visualLabel="Nuestro enfoque"
        visualTitle="Tecnología al servicio del desarrollo de talento."
      />

      <section className="section about-intro-section">
        <div className="container about-intro-grid">
          <div>
            <SectionHeading
              description="Las organizaciones necesitan algo más que contenidos aislados: requieren saber dónde está cada persona, qué necesita desarrollar y cómo demostrar el avance."
              eyebrow="El problema que atendemos"
              title="La capacitación pierde impacto cuando no existe una operación conectada."
            />
          </div>
          <div className="about-statement">
            <span>Nuestra propuesta</span>
            <h2>Una experiencia que conecta diagnóstico, preparación, práctica y evidencia.</h2>
            <p>Valtieris está diseñado para apoyar programas empresariales, academias internas, evaluación de talento y rutas de preparación sin presentar la formación como una colección de cuestionarios.</p>
            <Link className="arrow-link" to="/empresas">Ver soluciones para organizaciones <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            align="center"
            description="Estos principios guían el producto, el contenido y la forma en que presentamos cada servicio."
            eyebrow="Principios de trabajo"
            title="Una solución profesional, clara y responsable."
          />
          <div className="about-principles-grid">
            {aboutPrinciples.map((principle) => (
              <article key={principle.title}>
                <span><Icon name={principle.icon} /></span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-audience-section">
        <div className="container about-audience-grid">
          <div>
            <span className="eyebrow">A quién ayudamos</span>
            <h2>Diseñado para quienes necesitan desarrollar capacidades con orden y trazabilidad.</h2>
            <p>El alcance puede adaptarse a equipos pequeños, cohortes de incorporación, programas de preparación o academias con varias tecnologías.</p>
          </div>
          <ul>
            {aboutAudiences.map((audience) => <li key={audience}><Icon name="check" size={18} /> {audience}</li>)}
          </ul>
        </div>
      </section>

      <section className="section section--dark about-model-section">
        <div className="container">
          <SectionHeading
            align="center"
            description="Partimos del contexto real y construimos una operación que pueda sostenerse, medirse y evolucionar."
            eyebrow="Cómo trabajamos"
            title="Del objetivo inicial a una decisión informada."
          />
          <div className="about-model-grid">
            {aboutModel.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-integrity-section">
        <div className="container about-integrity-card">
          <div>
            <span className="eyebrow">Comunicación verificable</span>
            <h2>Construimos la marca sin inventar clientes, métricas, alianzas ni resultados.</h2>
          </div>
          <p>Las capacidades publicadas describen el producto y los servicios disponibles. Los testimonios, casos de éxito, cifras o logotipos se incorporarán únicamente cuando exista evidencia y autorización para mostrarlos.</p>
        </div>
      </section>

      <CTASection
        description="Comparte el objetivo, la tecnología y el tamaño del equipo para explorar una solución alineada con tu contexto."
        eyebrow="Conversemos"
        primaryLabel="Solicitar demo"
        secondaryHref="/contacto"
        secondaryLabel="Contactar al equipo"
        title="Construyamos una experiencia de desarrollo para tu organización."
      />
    </div>
  );
}
