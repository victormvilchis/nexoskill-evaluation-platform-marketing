import { type FormEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { plans } from '../content/plans';
import { Seo } from '../seo/Seo';
import { siteConfig } from '../seo/siteConfig';

interface QuoteFormState {
  planId: string;
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  technologies: string;
  objective: string;
  consent: boolean;
}

type QuoteErrors = Partial<Record<keyof QuoteFormState, string>>;

const initialForm = (planId: string): QuoteFormState => ({
  planId,
  name: '',
  email: '',
  company: '',
  role: '',
  teamSize: '',
  technologies: '',
  objective: '',
  consent: false,
});

const validate = (form: QuoteFormState): QuoteErrors => {
  const errors: QuoteErrors = {};
  if (!form.name.trim()) errors.name = 'Ingresa tu nombre.';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Ingresa un correo válido.';
  if (!form.company.trim()) errors.company = 'Ingresa el nombre de la empresa.';
  if (!form.teamSize) errors.teamSize = 'Selecciona el tamaño aproximado del equipo.';
  if (!form.objective.trim()) errors.objective = 'Describe brevemente el objetivo del programa.';
  if (!form.consent) errors.consent = 'Confirma que deseas compartir esta información con el equipo comercial.';
  return errors;
};

export function QuoteRequestPage() {
  const [searchParams] = useSearchParams();
  const requestedPlan = searchParams.get('plan') ?? plans[1].id;
  const validPlanId = plans.some((plan) => plan.id === requestedPlan) ? requestedPlan : plans[1].id;
  const [form, setForm] = useState<QuoteFormState>(() => initialForm(validPlanId));
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState('');

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === form.planId) ?? plans[1],
    [form.planId],
  );

  const updateField = <K extends keyof QuoteFormState,>(field: K, value: QuoteFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('Revisa los campos marcados antes de continuar.');
      return;
    }

    const subject = `Solicitud de cotización NexoSkill - ${selectedPlan.name}`;
    const body = [
      'Hola, quiero solicitar una cotización de NexoSkill.',
      '',
      `Plan de interés: ${selectedPlan.name}`,
      `Nombre: ${form.name.trim()}`,
      `Correo: ${form.email.trim()}`,
      `Empresa: ${form.company.trim()}`,
      `Cargo: ${form.role.trim() || 'No especificado'}`,
      `Tamaño del equipo: ${form.teamSize}`,
      `Tecnologías de interés: ${form.technologies.trim() || 'Por definir'}`,
      `Objetivo: ${form.objective.trim()}`,
    ].join('\n');

    const recipient = siteConfig.contactEmail;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Se abrió tu cliente de correo con el resumen de la solicitud. Revisa el mensaje antes de enviarlo.');
  };

  return (
    <main className="quote-page">
      <Seo
        description="Solicita una cotización de NexoSkill según el tamaño de tu equipo, tecnologías de interés y objetivo del programa."
        path="/solicitar-cotizacion"
        title="Solicitar cotización"
      />
      <section className="quote-hero">
        <div className="container quote-layout">
          <div className="quote-copy">
            <span className="eyebrow eyebrow--hero">Solicitud comercial</span>
            <h1>Dimensiona una propuesta para tu equipo.</h1>
            <p>Completa el contexto básico del programa. En esta fase, la solicitud abre un correo real con el resumen; el backend y la persistencia se incorporarán en la Parte 5.</p>
            <div className="quote-plan-summary">
              <span>Plan seleccionado</span>
              <h2>{selectedPlan.name}</h2>
              <p>{selectedPlan.description}</p>
              <ul>
                <li><Icon name="users" size={18} /> {selectedPlan.seats}</li>
                <li><Icon name="layers" size={18} /> {selectedPlan.technologyScope}</li>
                <li><Icon name="report" size={18} /> {selectedPlan.reporting}</li>
              </ul>
            </div>
          </div>

          <form className="quote-form" noValidate onSubmit={handleSubmit}>
            <div className="quote-form__heading">
              <span>Paso inicial</span>
              <h2>Datos para preparar la cotización</h2>
              <p>Los campos marcados con * son obligatorios.</p>
            </div>

            <label>
              Plan de interés *
              <select value={form.planId} onChange={(event) => updateField('planId', event.target.value)}>
                {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
              </select>
            </label>

            <div className="quote-form__row">
              <label>
                Nombre completo *
                <input autoComplete="name" maxLength={100} value={form.name} onChange={(event) => updateField('name', event.target.value)} />
                {errors.name ? <small className="field-error">{errors.name}</small> : null}
              </label>
              <label>
                Correo empresarial *
                <input autoComplete="email" maxLength={160} type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                {errors.email ? <small className="field-error">{errors.email}</small> : null}
              </label>
            </div>

            <div className="quote-form__row">
              <label>
                Empresa *
                <input autoComplete="organization" maxLength={120} value={form.company} onChange={(event) => updateField('company', event.target.value)} />
                {errors.company ? <small className="field-error">{errors.company}</small> : null}
              </label>
              <label>
                Cargo
                <input autoComplete="organization-title" maxLength={100} value={form.role} onChange={(event) => updateField('role', event.target.value)} />
              </label>
            </div>

            <div className="quote-form__row">
              <label>
                Tamaño del equipo *
                <select value={form.teamSize} onChange={(event) => updateField('teamSize', event.target.value)}>
                  <option value="">Selecciona una opción</option>
                  <option>1 a 10 personas</option>
                  <option>11 a 25 personas</option>
                  <option>26 a 50 personas</option>
                  <option>51 a 100 personas</option>
                  <option>Más de 100 personas</option>
                </select>
                {errors.teamSize ? <small className="field-error">{errors.teamSize}</small> : null}
              </label>
              <label>
                Tecnologías de interés
                <input maxLength={180} placeholder="Ej. Java, testing, cloud" value={form.technologies} onChange={(event) => updateField('technologies', event.target.value)} />
              </label>
            </div>

            <label>
              Objetivo del programa *
              <textarea maxLength={700} rows={5} placeholder="Describe qué necesitas evaluar, preparar o desarrollar." value={form.objective} onChange={(event) => updateField('objective', event.target.value)} />
              <span className="field-counter">{form.objective.length}/700</span>
              {errors.objective ? <small className="field-error">{errors.objective}</small> : null}
            </label>

            <label className="quote-consent">
              <input checked={form.consent} type="checkbox" onChange={(event) => updateField('consent', event.target.checked)} />
              <span>Acepto preparar y compartir esta información con el equipo comercial de NexoSkill. Consulta el <Link to="/aviso-de-privacidad">aviso de privacidad</Link>.</span>
            </label>
            {errors.consent ? <small className="field-error">{errors.consent}</small> : null}

            {status ? <p className="quote-form__status" role="status">{status}</p> : null}

            <button className="button button--primary button--full button--large" type="submit">
              Preparar solicitud <Icon name="arrow" size={18} />
            </button>
            <small className="quote-form__note">
              {siteConfig.contactEmail
                ? `El mensaje se preparará para ${siteConfig.contactEmail}.`
                : 'No hay destinatario comercial configurado; el correo se abrirá para que agregues el destinatario manualmente.'}
            </small>
          </form>
        </div>
      </section>
    </main>
  );
}
