import { analyticsIsConfigured } from '../analytics/analytics';
import { Seo } from '../seo/Seo';
import { siteConfig } from '../seo/siteConfig';

export function PrivacyPage() {
  const privacyContact = siteConfig.privacyEmail || siteConfig.contactEmail;
  return (
    <>
      <Seo
        description="Conoce qué datos recopila NexoSkill mediante sus formularios comerciales, para qué se utilizan y cómo ejercer tus derechos de privacidad."
        path="/aviso-de-privacidad"
        title="Aviso de privacidad"
      />
      <div className="legal-page">
        <section className="subpage-hero subpage-hero--compact">
          <div className="container legal-page__hero">
            <span className="eyebrow eyebrow--hero">Privacidad</span>
            <h1>Aviso de privacidad del sitio público.</h1>
            <p>Este documento describe el tratamiento de la información enviada a través de los formularios comerciales de NexoSkill.</p>
            <small>Última actualización: 27 de julio de 2026.</small>
          </div>
        </section>
        <div className="container legal-page__content">
          <section>
            <h2>Responsable</h2>
            <p><strong>{siteConfig.legalEntity}</strong> es responsable del tratamiento de los datos recabados en este sitio. {privacyContact ? <>Para asuntos de privacidad puedes escribir a <a href={`mailto:${privacyContact}`}>{privacyContact}</a>.</> : <>El correo de privacidad debe configurarse antes de publicar el sitio en producción.</>}</p>
            {siteConfig.legalAddress ? <p>Domicilio de contacto: {siteConfig.legalAddress}.</p> : <p className="legal-page__notice">Antes de publicar en producción debe configurarse la identidad jurídica y el domicilio de contacto mediante las variables de entorno correspondientes.</p>}
          </section>
          <section>
            <h2>Datos que recopilamos</h2>
            <p>Los formularios pueden solicitar nombre, apellidos, correo, teléfono, empresa, cargo, tamaño de empresa o equipo, número estimado de estudiantes, tecnologías y servicios de interés, plan seleccionado y el mensaje proporcionado.</p>
            <p>Para seguridad y prevención de abuso también se conserva una huella irreversible de la dirección IP, el agente de usuario, la fuente de la solicitud, la fecha de consentimiento y la fecha de creación del registro. No se almacena la dirección IP en texto claro.</p>
          </section>
          <section>
            <h2>Finalidades</h2>
            <ul>
              <li>Atender solicitudes de contacto, demostración, cotización, asesoría o bootcamp.</li>
              <li>Dar seguimiento comercial y preparar propuestas relacionadas con la solicitud.</li>
              <li>Prevenir abuso, envíos automatizados y solicitudes duplicadas.</li>
              <li>Medir navegación y conversiones únicamente cuando se autoriza la analítica opcional.</li>
            </ul>
          </section>
          <section>
            <h2>Analítica y almacenamiento local</h2>
            <p>La preferencia de analítica se guarda en el navegador. Las herramientas de medición permanecen desactivadas hasta que la persona las acepte. El rechazo no impide navegar ni enviar formularios.</p>
            {analyticsIsConfigured() ? <button className="button button--secondary" onClick={() => window.dispatchEvent(new Event('nexoskill:open-consent'))} type="button">Administrar preferencias de analítica</button> : null}
          </section>
          <section>
            <h2>Conservación y transferencias</h2>
            <p>Los datos se conservarán durante el tiempo necesario para atender la solicitud, cumplir obligaciones aplicables y mantener evidencia de consentimiento y seguridad. No se comercializan datos personales. Cualquier proveedor utilizado para correo, alojamiento o analítica deberá operar bajo condiciones de confidencialidad y seguridad.</p>
          </section>
          <section>
            <h2>Derechos y contacto</h2>
            <p>Puedes solicitar acceso, rectificación, cancelación, oposición o revocación del consentimiento mediante el correo de privacidad. La solicitud deberá permitir identificar al titular y especificar el derecho que desea ejercer.</p>
          </section>
          <section>
            <h2>Cambios al aviso</h2>
            <p>Las modificaciones relevantes se publicarán en esta misma ruta, indicando la fecha de actualización.</p>
          </section>
        </div>
      </div>
    </>
  );
}
