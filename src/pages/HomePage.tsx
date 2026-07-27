import { Link } from 'react-router-dom';
import { ArrowLink } from '../components/common/ArrowLink';
import { CTASection } from '../components/common/CTASection';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { Icon } from '../components/common/Icon';
import { SectionHeading } from '../components/common/SectionHeading';
import { PricingCard } from '../components/pricing/PricingCard';
import { businessProblems, platformFeatures } from '../content/features';
import { faqs } from '../content/faqs';
import { plans } from '../content/plans';
import { processSteps } from '../content/process';
import { services } from '../content/services';
import { featuredTechnologies } from '../content/technologies';
import { Seo } from '../seo/Seo';

export function HomePage() {
  return (
    <>
      <Seo
        description="Evalúa habilidades, diseña rutas de preparación y mide el avance del talento tecnológico desde una sola solución."
        title="Evaluación y desarrollo de talento tecnológico"
      />

      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--hero">Plataforma y servicios para talento tecnológico</span>
            <h1>Evalúa y desarrolla talento tecnológico con una ruta clara.</h1>
            <p className="hero__lead">
              Diagnostica habilidades reales, prepara talento para nuevos retos y convierte el avance de cada persona en resultados claros para tu organización.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary button--large" to="/solicitar-demo">
                Solicitar una demo <Icon name="arrow" size={18} />
              </Link>
              <Link className="button button--secondary button--large" to="/plataforma">Conocer la plataforma</Link>
            </div>
            <ul className="hero__proof" aria-label="Capacidades principales">
              <li><Icon name="check" size={18} /> Diagnóstico por tecnología</li>
              <li><Icon name="check" size={18} /> Preparación para certificaciones</li>
              <li><Icon name="check" size={18} /> Analítica de avance</li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="Vista conceptual de resultados y progreso de NexoSkill">
            <div className="hero-visual__topbar">
              <span className="hero-visual__logo">N</span>
              <div>
                <strong>Academia tecnológica</strong>
                <span>Vista general del equipo</span>
              </div>
              <span className="hero-visual__status">Vista ilustrativa</span>
            </div>
            <div className="hero-visual__metrics">
              <div><span>Participantes</span><strong>25</strong><small>Equipo activo</small></div>
              <div><span>Avance promedio</span><strong>78%</strong><small>Ruta asignada</small></div>
              <div><span>Evaluaciones</span><strong>12</strong><small>Completadas</small></div>
            </div>
            <div className="hero-visual__body">
              <div className="skill-panel">
                <div className="panel-heading"><strong>Competencias</strong><span>Último corte</span></div>
                {[
                  ['Fundamentos', '88%'],
                  ['Desarrollo', '76%'],
                  ['Calidad', '71%'],
                  ['Seguridad', '64%'],
                ].map(([label, value]) => (
                  <div className="skill-row" key={label}>
                    <div><span>{label}</span><strong>{value}</strong></div>
                    <div className="progress"><span style={{ width: value }} /></div>
                  </div>
                ))}
              </div>
              <div className="path-panel">
                <div className="panel-heading"><strong>Ruta activa</strong><span>Java Backend</span></div>
                <div className="path-node path-node--done"><span>1</span><div><strong>Diagnóstico</strong><small>Completado</small></div></div>
                <div className="path-line path-line--done" />
                <div className="path-node path-node--active"><span>2</span><div><strong>Preparación</strong><small>En progreso</small></div></div>
                <div className="path-line" />
                <div className="path-node"><span>3</span><div><strong>Evaluación final</strong><small>Pendiente</small></div></div>
              </div>
            </div>
            <div className="floating-card floating-card--left"><Icon name="chart" size={20} /><div><strong>Avance visible</strong><span>Resultados por corte</span></div></div>
            <div className="floating-card floating-card--right"><Icon name="shield" size={20} /><div><strong>Contenido aislado</strong><span>Por organización</span></div></div>
          </div>
        </div>
      </section>

      <section className="section section--compact tech-strip" aria-labelledby="technologies-title">
        <div className="container">
          <div className="tech-strip__heading">
            <div>
              <span className="eyebrow">Especialidades disponibles</span>
              <h2 id="technologies-title">Preparación para tecnologías que demandan conocimiento especializado.</h2>
            </div>
            <ArrowLink to="/tecnologias">Ver catálogo completo</ArrowLink>
          </div>
          <div className="technology-grid">
            {featuredTechnologies.map((technology) => (
              <Link className="technology-card" key={technology.slug} to={`/tecnologias/${technology.slug}`}>
                <span className="technology-card__icon">{technology.iconLabel}</span>
                <div>
                  <span>{technology.category}</span>
                  <h3>{technology.name}</h3>
                  <p>{technology.summary}</p>
                  <small>{technology.level}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section problem-section">
        <div className="container problem-grid">
          <div>
            <SectionHeading
              description="La preparación técnica pierde valor cuando no existe una forma consistente de diagnosticar, acompañar y demostrar resultados."
              eyebrow="El reto"
              title="Capacitar sin visibilidad genera decisiones a ciegas."
            />
            <ArrowLink to="/empresas">Conocer soluciones para empresas</ArrowLink>
          </div>
          <div className="problem-list">
            {businessProblems.map((problem, index) => (
              <article key={problem}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{problem}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark process-section">
        <div className="container">
          <SectionHeading
            align="center"
            description="Un flujo diseñado para convertir conocimiento disperso en una ruta visible, medible y accionable."
            eyebrow="Cómo funciona"
            title="Del diagnóstico inicial al resultado final."
          />
          <div className="process-grid">
            {processSteps.map((step) => (
              <article className="process-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="split-heading">
            <SectionHeading
              description="Una arquitectura orientada a organizaciones que necesitan gobernar contenido, participantes y resultados desde un solo lugar."
              eyebrow="Capacidades de plataforma"
              title="Todo lo necesario para operar una academia técnica."
            />
            <ArrowLink to="/plataforma">Explorar la plataforma</ArrowLink>
          </div>
          <div className="feature-grid">
            {platformFeatures.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-card__icon"><Icon name={feature.icon} /></span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <SectionHeading
            align="center"
            description="Combina tecnología, contenido y acompañamiento para construir una solución alineada con cada objetivo."
            eyebrow="Líneas de negocio"
            title="Más que una plataforma de cuestionarios."
          />
          <div className="service-grid">
            {services.map((service, index) => (
              <article className={`service-card ${index === 0 ? 'service-card--featured' : ''}`} key={service.title}>
                <div className="service-card__icon"><Icon name={service.icon} /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>{service.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={16} /> {bullet}</li>)}</ul>
                <ArrowLink to={service.href}>Conocer más</ArrowLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-section">
        <div className="container">
          <div className="split-heading split-heading--bottom">
            <SectionHeading
              description="Planes preparados para crecer desde un equipo pequeño hasta una operación empresarial con necesidades específicas."
              eyebrow="Planes comerciales"
              title="Empieza con la capacidad que necesitas hoy."
            />
            <ArrowLink to="/planes">Comparar todos los planes</ArrowLink>
          </div>
          <div className="pricing-grid">
            {plans.slice(0, 3).map((plan) => <PricingCard compact key={plan.id} plan={plan} />)}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <SectionHeading
              description="Información inicial sobre la plataforma, el contenido y los programas de preparación."
              eyebrow="Preguntas frecuentes"
              title="Lo que necesitas saber antes de comenzar."
            />
            <ArrowLink to="/preguntas-frecuentes">Ver todas las preguntas</ArrowLink>
          </div>
          <FaqAccordion items={faqs.slice(0, 5)} />
        </div>
      </section>

      <CTASection />
    </>
  );
}
