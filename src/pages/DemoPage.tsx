import { useSearchParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { Seo } from '../seo/Seo';
import { siteConfig } from '../seo/siteConfig';

export function DemoPage() {
  const [searchParams] = useSearchParams();
  const technology = searchParams.get('tecnologia');
  const subject = encodeURIComponent(`Solicitud de demo NexoSkill${technology ? ` - ${technology.toUpperCase()}` : ''}`);
  const emailHref = siteConfig.contactEmail ? `mailto:${siteConfig.contactEmail}?subject=${subject}` : 'mailto:?subject=' + subject;

  return (
    <main className="contact-page">
      <Seo
        description="Solicita una demostración de NexoSkill y conoce cómo evaluar, preparar y medir el avance de tu talento tecnológico."
        path="/solicitar-demo"
        title="Solicitar una demo"
      />
      <section className="contact-hero">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow eyebrow--hero">Hablemos de tu objetivo</span>
            <h1>Solicita una demostración de NexoSkill.</h1>
            <p>Comparte el tamaño de tu equipo, la tecnología de interés y el objetivo del programa. En la Parte 5 este flujo contará con formulario, backend, correo y persistencia.</p>
            <ul className="contact-benefits">
              <li><Icon name="check" size={18} /> Recorrido por la plataforma</li>
              <li><Icon name="check" size={18} /> Revisión de necesidades</li>
              <li><Icon name="check" size={18} /> Propuesta de siguiente paso</li>
            </ul>
          </div>
          <div className="contact-card">
            <span className="contact-card__step">Canal inicial</span>
            <h2>Contacto comercial por correo</h2>
            <p>Esta primera entrega no incluye formularios simulados. El botón abrirá tu cliente de correo para iniciar una solicitud real.</p>
            {technology ? <p className="contact-card__interest"><strong>Tecnología:</strong> {technology.toUpperCase()}</p> : null}
            <a className="button button--primary button--full" href={emailHref}>Preparar solicitud <Icon name="arrow" size={18} /></a>
            {!siteConfig.contactEmail ? <small>Configura VITE_CONTACT_EMAIL para establecer el destinatario comercial.</small> : <small>Destino configurado: {siteConfig.contactEmail}</small>}
          </div>
        </div>
      </section>
    </main>
  );
}
