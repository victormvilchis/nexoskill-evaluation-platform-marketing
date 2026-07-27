import { CapabilityGrid } from '../components/common/CapabilityGrid';
import { CTASection } from '../components/common/CTASection';
import { PageHero } from '../components/common/PageHero';
import { ProgramGrid } from '../components/common/ProgramGrid';
import { SectionHeading } from '../components/common/SectionHeading';
import { ValueBand } from '../components/common/ValueBand';
import { trainingComponents, trainingPrograms } from '../content/training';
import { Seo } from '../seo/Seo';

export function TrainingPage() {
  return (
    <>
      <Seo
        description="Capacitación tecnológica empresarial, academias internas, preparación para proyectos y programas de upskilling y reskilling."
        path="/capacitaciones"
        title="Capacitaciones tecnológicas empresariales"
      />
      <div>
        <PageHero
          description="Diseñamos programas para desarrollar capacidades concretas, preparar equipos para proyectos y homologar conocimientos dentro de la organización."
          eyebrow="Capacitación empresarial"
          secondaryHref="/bootcamps"
          secondaryLabel="Explorar bootcamps"
          title="Formación técnica alineada con las necesidades reales del negocio."
          visualItems={['Objetivo y perfil definidos', 'Programa por tecnología y nivel', 'Seguimiento durante la formación', 'Resultado y siguiente paso']}
          visualLabel="Diseño a la medida"
          visualTitle="Cada programa responde a una necesidad concreta."
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              align="center"
              description="La capacitación puede orientarse a una tecnología, un nivel, una nueva responsabilidad o la preparación previa a un proyecto."
              eyebrow="Tipos de programa"
              title="Capacitación para desarrollar, actualizar o transformar capacidades."
            />
            <ProgramGrid items={trainingPrograms} />
          </div>
        </section>

        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              align="center"
              description="La combinación exacta depende del alcance, pero cada elemento se integra dentro de una experiencia coherente."
              eyebrow="Qué puede incluir"
              title="Más que sesiones aisladas."
            />
            <CapabilityGrid items={trainingComponents} />
          </div>
        </section>

        <section className="section">
          <div className="container learning-model">
            <div>
              <span className="eyebrow">Modelo de aprendizaje</span>
              <h2>Diagnosticar, desarrollar, practicar y comprobar.</h2>
              <p>El contenido se organiza para que cada etapa tenga una función: conocer el punto de partida, desarrollar conceptos, llevarlos a la práctica y validar el resultado.</p>
            </div>
            <div className="learning-model__steps">
              <article><span>01</span><strong>Diagnóstico</strong><p>Establece la línea base.</p></article>
              <article><span>02</span><strong>Formación</strong><p>Desarrolla conocimientos clave.</p></article>
              <article><span>03</span><strong>Aplicación</strong><p>Conecta conceptos con casos.</p></article>
              <article><span>04</span><strong>Validación</strong><p>Comprueba el nivel alcanzado.</p></article>
            </div>
          </div>
        </section>

        <ValueBand
          description="Los programas pueden operar para grupos pequeños, cohortes de incorporación o academias internas con varios niveles y cortes de seguimiento."
          eyebrow="Escalabilidad"
          items={['Grupos por nivel', 'Contenido reutilizable', 'Seguimiento por cohortes', 'Resultados comparables']}
          linkLabel="Diseñar una capacitación"
          linkTo="/solicitar-demo"
          title="Un modelo que puede crecer con la organización."
        />
      </div>
      <CTASection />
    </>
  );
}
