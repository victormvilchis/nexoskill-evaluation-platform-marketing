import { type FormEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { LeadApiError, submitLead } from '../../services/leadApi';
import type { LeadKind, LeadSubmissionPayload } from '../../types/lead';

interface PlanOption {
  value: string;
  label: string;
}

interface LeadFormProps {
  kind: LeadKind;
  title: string;
  description: string;
  submitLabel: string;
  defaultService?: string;
  defaultTechnology?: string;
  planId?: string;
  planOptions?: PlanOption[];
  onPlanChange?: (planId: string) => void;
  source?: string;
  compact?: boolean;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  companySize: string;
  teamSize: string;
  studentCount: string;
  technologyInterest: string;
  message: string;
  consentPrivacy: boolean;
  website: string;
}

type FormErrors = Partial<Record<keyof FormState | 'planId', string>>;

const createInitialState = (technology = ''): FormState => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  companySize: '',
  teamSize: '',
  studentCount: '',
  technologyInterest: technology,
  message: '',
  consentPrivacy: false,
  website: '',
});

const validate = (form: FormState, planId?: string, requiresPlan = false): FormErrors => {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Ingresa tu nombre.';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Ingresa un correo válido.';
  if (form.phone && !/^[0-9+()\-\s.]{7,40}$/.test(form.phone)) errors.phone = 'Revisa el formato del teléfono.';
  if (!form.company.trim()) errors.company = 'Ingresa el nombre de la empresa.';
  if (!form.message.trim()) errors.message = 'Describe brevemente lo que necesitas.';
  if (requiresPlan && !planId) errors.planId = 'Selecciona un plan.';
  if (!form.consentPrivacy) errors.consentPrivacy = 'Debes aceptar el aviso de privacidad.';
  return errors;
};

export function LeadForm({
  kind,
  title,
  description,
  submitLabel,
  defaultService,
  defaultTechnology,
  planId,
  planOptions,
  onPlanChange,
  source,
  compact = false,
}: LeadFormProps) {
  const [form, setForm] = useState<FormState>(() => createInitialState(defaultTechnology));
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{ type: 'idle' | 'sending' | 'success' | 'error'; message?: string; reference?: string }>({ type: 'idle' });
  const formStartedAt = useRef(new Date().toISOString());

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status.type !== 'idle') setStatus({ type: 'idle' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form, planId, Boolean(planOptions?.length));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: 'error', message: 'Revisa los campos marcados antes de continuar.' });
      return;
    }

    const payload: LeadSubmissionPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || undefined,
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim(),
      jobTitle: form.jobTitle.trim() || undefined,
      companySize: form.companySize || undefined,
      teamSize: form.teamSize || undefined,
      studentCount: form.studentCount ? Number(form.studentCount) : undefined,
      serviceInterest: defaultService,
      technologyInterest: form.technologyInterest.trim() || undefined,
      planId,
      message: form.message.trim(),
      source: source || window.location.pathname,
      consentPrivacy: form.consentPrivacy,
      formStartedAt: formStartedAt.current,
      website: form.website,
    };

    setStatus({ type: 'sending', message: 'Enviando solicitud…' });
    try {
      const response = await submitLead(kind, payload);
      setStatus({ type: 'success', message: response.message, reference: response.reference });
      setForm(createInitialState(defaultTechnology));
      formStartedAt.current = new Date().toISOString();
    } catch (error) {
      if (error instanceof LeadApiError) {
        const mappedErrors = Object.fromEntries(Object.entries(error.fieldErrors).map(([key, value]) => [key as keyof FormState, value]));
        setErrors((current) => ({ ...current, ...mappedErrors }));
        setStatus({ type: 'error', message: error.message });
      } else {
        setStatus({ type: 'error', message: 'No fue posible enviar la solicitud.' });
      }
    }
  };

  const formClass = compact ? 'lead-form lead-form--compact' : 'lead-form';

  return (
    <form className={formClass} noValidate onSubmit={handleSubmit}>
      <div className="lead-form__heading">
        <span>Solicitud comercial</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {planOptions?.length ? (
        <label>
          Plan de interés *
          <select
            aria-invalid={Boolean(errors.planId)}
            value={planId ?? ''}
            onChange={(event) => {
              onPlanChange?.(event.target.value);
              setErrors((current) => ({ ...current, planId: undefined }));
            }}
          >
            {planOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {errors.planId ? <small className="field-error">{errors.planId}</small> : null}
        </label>
      ) : null}

      <div className="lead-form__row">
        <label>
          Nombre *
          <input aria-invalid={Boolean(errors.firstName)} autoComplete="given-name" maxLength={80} value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} />
          {errors.firstName ? <small className="field-error">{errors.firstName}</small> : null}
        </label>
        <label>
          Apellidos
          <input autoComplete="family-name" maxLength={100} value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} />
        </label>
      </div>

      <div className="lead-form__row">
        <label>
          Correo empresarial *
          <input aria-invalid={Boolean(errors.email)} autoComplete="email" maxLength={180} type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>
        <label>
          Teléfono
          <input aria-invalid={Boolean(errors.phone)} autoComplete="tel" maxLength={40} type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          {errors.phone ? <small className="field-error">{errors.phone}</small> : null}
        </label>
      </div>

      <div className="lead-form__row">
        <label>
          Empresa *
          <input aria-invalid={Boolean(errors.company)} autoComplete="organization" maxLength={160} value={form.company} onChange={(event) => updateField('company', event.target.value)} />
          {errors.company ? <small className="field-error">{errors.company}</small> : null}
        </label>
        <label>
          Cargo
          <input autoComplete="organization-title" maxLength={140} value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} />
        </label>
      </div>

      <div className="lead-form__row">
        <label>
          Tamaño de empresa
          <select value={form.companySize} onChange={(event) => updateField('companySize', event.target.value)}>
            <option value="">Selecciona una opción</option>
            <option value="1-10">1 a 10 personas</option>
            <option value="11-50">11 a 50 personas</option>
            <option value="51-250">51 a 250 personas</option>
            <option value="251-1000">251 a 1,000 personas</option>
            <option value="1000+">Más de 1,000 personas</option>
          </select>
        </label>
        <label>
          Tamaño del equipo
          <select value={form.teamSize} onChange={(event) => updateField('teamSize', event.target.value)}>
            <option value="">Selecciona una opción</option>
            <option value="1-10">1 a 10 personas</option>
            <option value="11-25">11 a 25 personas</option>
            <option value="26-50">26 a 50 personas</option>
            <option value="51-100">51 a 100 personas</option>
            <option value="100+">Más de 100 personas</option>
          </select>
        </label>
      </div>

      <div className="lead-form__row">
        <label>
          Estudiantes estimados
          <input min={1} max={100000} inputMode="numeric" type="number" value={form.studentCount} onChange={(event) => updateField('studentCount', event.target.value)} />
        </label>
        <label>
          Tecnologías de interés
          <input maxLength={300} placeholder="Ej. Java, testing, cloud" value={form.technologyInterest} onChange={(event) => updateField('technologyInterest', event.target.value)} />
        </label>
      </div>

      <label>
        ¿Qué necesitas? *
        <textarea aria-invalid={Boolean(errors.message)} maxLength={2000} rows={5} value={form.message} onChange={(event) => updateField('message', event.target.value)} />
        <span className="field-counter">{form.message.length}/2000</span>
        {errors.message ? <small className="field-error">{errors.message}</small> : null}
      </label>

      <label className="form-honeypot" aria-hidden="true">
        Sitio web
        <input autoComplete="off" tabIndex={-1} value={form.website} onChange={(event) => updateField('website', event.target.value)} />
      </label>

      <label className="lead-consent">
        <input checked={form.consentPrivacy} type="checkbox" onChange={(event) => updateField('consentPrivacy', event.target.checked)} />
        <span>Acepto que NexoSkill procese estos datos para atender mi solicitud comercial. Consulta el <Link to="/aviso-de-privacidad">aviso de privacidad</Link>.</span>
      </label>
      {errors.consentPrivacy ? <small className="field-error">{errors.consentPrivacy}</small> : null}

      {status.type !== 'idle' ? (
        <div className={`lead-form__status lead-form__status--${status.type}`} role="status">
          <strong>{status.type === 'success' ? 'Solicitud recibida' : status.type === 'sending' ? 'Procesando' : 'No se pudo enviar'}</strong>
          <span>{status.message}</span>
          {status.reference ? <span>Referencia: {status.reference}</span> : null}
        </div>
      ) : null}

      <button className="button button--primary button--full button--large" disabled={status.type === 'sending'} type="submit">
        {status.type === 'sending' ? 'Enviando…' : submitLabel} <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}
