import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { LeadForm } from '../components/forms/LeadForm';
import { Seo } from '../seo/Seo';

export function DemoPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const technology = searchParams.get('tecnologia') ?? '';
  const service = searchParams.get('servicio') ?? '';
  const isContact = location.pathname === '/contacto';

  return (
    <div className="contact-page">
      <Seo
        description={isContact ? 'Contacta al equipo comercial de NexoSkill.' : 'Solicita una demostración de NexoSkill y conoce cómo evaluar, preparar y medir el avance de tu talento tecnológico.'}
        path={isContact ? '/contacto' : '/solicitar-demo'}
        title={isContact ? 'Contacto comercial' : 'Solicitar demo'}
      />
      <section className="contact-hero">
        <div className="container contact-grid contact-grid--form">
          <div>
            <nav aria-label="Migas de pan" className="breadcrumbs"><Link to="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">{isContact ? 'Contacto' : 'Solicitar demo'}</span></nav>
            <span className="eyebrow eyebrow--hero">{isContact ? 'Hablemos de tu necesidad' : 'Conoce la plataforma'}</span>
            <h1>{isContact ? 'Conversemos sobre tu programa de talento.' : 'Solicita una demostración de NexoSkill.'}</h1>
            <p>{isContact ? 'Comparte el contexto de tu organización y el equipo comercial dará seguimiento a tu solicitud.' : 'Cuéntanos qué necesitas evaluar, preparar o desarrollar. Coordinaremos una sesión enfocada en el contexto real de tu organización.'}</p>
            <ul className="contact-benefits">
              <li><Icon name="check" size={18} /> Atención según el objetivo del equipo</li>
              <li><Icon name="check" size={18} /> Revisión de tecnologías y alcance</li>
              <li><Icon name="check" size={18} /> Siguiente paso claramente definido</li>
            </ul>
          </div>
          <LeadForm
            defaultService={service || (isContact ? 'Contacto comercial' : 'Demostración de plataforma')}
            defaultTechnology={technology}
            description={isContact ? 'Completa los datos para que podamos canalizar tu solicitud.' : 'Completa el contexto básico y coordinaremos una sesión para mostrarte la solución.'}
            kind={isContact ? 'contact' : 'demo'}
            source={location.pathname}
            submitLabel={isContact ? 'Enviar mensaje' : 'Solicitar demo'}
            title={isContact ? 'Contactar a NexoSkill' : 'Coordinar una demostración'}
          />
        </div>
      </section>
    </div>
  );
}
