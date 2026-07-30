import { Link } from 'react-router-dom';
import { analyticsIsConfigured } from '../../analytics/analytics';
import { siteConfig } from '../../seo/siteConfig';

interface PrivacyNoticeContentProps {
  context?: 'page' | 'modal';
  showAnalyticsPreferences?: boolean;
}

export function PrivacyNoticeContent({
  context = 'page',
  showAnalyticsPreferences = false,
}: PrivacyNoticeContentProps) {
  const privacyContact = siteConfig.privacyEmail || siteConfig.contactEmail;
  const isModal = context === 'modal';

  return (
    <div className={`privacy-notice-sections privacy-notice-sections--${context}`}>
      <section>
        <h2>Responsable</h2>
        <p>
          <strong>{siteConfig.legalEntity}</strong> es responsable del tratamiento de los datos recabados en este sitio.{' '}
          {privacyContact ? (
            <>Para asuntos de privacidad puedes escribir a <a href={`mailto:${privacyContact}`}>{privacyContact}</a>.</>
          ) : isModal ? (
            <>Para asuntos de privacidad puedes utilizar el formulario de contacto disponible en el sitio.</>
          ) : (
            <>Para asuntos de privacidad puedes utilizar el <Link to="/contacto">formulario de contacto</Link>.</>
          )}
        </p>
        {siteConfig.legalAddress ? <p>Domicilio de contacto: {siteConfig.legalAddress}.</p> : null}
      </section>

      <section>
        <h2>Datos que recopilamos</h2>
        <p>Los formularios pueden solicitar nombre, apellidos, correo, teléfono, empresa, cargo, tamaño de empresa o equipo, número estimado de estudiantes, tecnologías y servicios de interés, plan seleccionado y el mensaje proporcionado.</p>
        <p>Para seguridad y prevención de abuso también se conserva una huella irreversible de la dirección IP, el agente de usuario, la fuente de la solicitud, la fecha de consentimiento y la fecha de creación del registro. No se almacena la dirección IP en texto claro.</p>
        <p>Cuando una persona llega mediante una campaña, podemos conservar parámetros de atribución como fuente, medio, campaña, contenido, término, identificador publicitario, referente, página de entrada y página donde se completó la solicitud. Estos datos se asocian únicamente al registro comercial enviado y no incluyen el contenido escrito en otros campos.</p>
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
        <p>La atribución de campaña utilizada para contextualizar una solicitud comercial se conserva temporalmente en la sesión del navegador y se envía únicamente cuando la persona decide completar un formulario. No se activa ninguna herramienta externa por este mecanismo.</p>
        {showAnalyticsPreferences && analyticsIsConfigured() ? (
          <button className="button button--secondary" onClick={() => window.dispatchEvent(new Event('valtieris:open-consent'))} type="button">
            Administrar preferencias de analítica
          </button>
        ) : null}
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
        <p>Las modificaciones relevantes se publicarán en la ruta pública del aviso de privacidad, indicando la fecha de actualización.</p>
      </section>
    </div>
  );
}
