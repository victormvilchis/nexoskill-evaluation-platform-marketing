import { Seo } from '../seo/Seo';
import { siteConfig } from '../seo/siteConfig';

export function TermsPage() {
  const contactEmail = siteConfig.contactEmail;
  return (
    <>
      <Seo
        description="Consulta las condiciones de uso del sitio público de NexoSkill y sus formularios comerciales."
        path="/terminos-y-condiciones"
        title="Términos y condiciones"
      />
      <div className="legal-page">
        <section className="subpage-hero subpage-hero--compact">
          <div className="container legal-page__hero">
            <span className="eyebrow eyebrow--hero">Condiciones del sitio</span>
            <h1>Términos y condiciones de uso.</h1>
            <p>Estas condiciones aplican al sitio público de NexoSkill. El uso de la plataforma SaaS podrá estar sujeto a contratos y condiciones independientes.</p>
            <small>Última actualización: 27 de julio de 2026.</small>
          </div>
        </section>
        <div className="container legal-page__content">
          <section><h2>Objeto del sitio</h2><p>El sitio presenta información institucional y comercial sobre plataforma, evaluaciones, capacitación, bootcamps, asesorías y servicios para desarrollo de talento tecnológico.</p></section>
          <section><h2>Uso permitido</h2><p>La persona usuaria se compromete a utilizar el sitio de forma lícita, no intentar afectar su disponibilidad, no automatizar envíos abusivos y no proporcionar información falsa o de terceros sin autorización.</p></section>
          <section><h2>Solicitudes comerciales</h2><p>El envío de un formulario confirma la recepción de una solicitud, pero no constituye una oferta definitiva, aceptación contractual, reserva de capacidad ni garantía de prestación. Alcance, tiempos y precios se formalizarán por escrito.</p></section>
          <section><h2>Contenido y propiedad intelectual</h2><p>Los textos, estructura visual, marca, componentes y materiales publicados pertenecen a {siteConfig.legalEntity} o se utilizan con autorización. No se autoriza su reproducción comercial sin consentimiento.</p></section>
          <section><h2>Tecnologías y marcas de terceros</h2><p>Las tecnologías mencionadas se presentan como áreas generales de conocimiento. Las marcas pertenecen a sus respectivos titulares y su mención no implica afiliación, patrocinio ni contenido oficial.</p></section>
          <section><h2>Disponibilidad</h2><p>Se aplican medidas razonables para mantener el sitio disponible y seguro, pero pueden existir interrupciones por mantenimiento, infraestructura, proveedores o causas fuera de control.</p></section>
          <section><h2>Enlaces externos</h2><p>El acceso a la plataforma u otros sitios puede dirigir a aplicaciones independientes con sus propios términos, políticas y controles de seguridad.</p></section>
          <section><h2>Contacto</h2><p>{contactEmail ? <>Las dudas sobre estas condiciones pueden enviarse a <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : <>El correo de contacto debe configurarse antes de publicar el sitio en producción.</>}</p></section>
        </div>
      </div>
    </>
  );
}
