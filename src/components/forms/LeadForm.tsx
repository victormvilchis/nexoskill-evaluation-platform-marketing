import { type FormEvent, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { LeadApiError, submitLead } from '../../services/leadApi';
import { trackEvent } from '../../analytics/analytics';
import { getLeadAttribution } from '../../analytics/attribution';
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
  if (form.studentCount && Number(form.studentCount) < 1) errors.studentCount = 'Ingresa una cantidad mayor a cero.';
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
  const formId = useId().replaceAll(':', '');
  const [form, setForm] = useState<FormState>(() => createInitialState(defaultTechnology));
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{ type: 'idle' | 'sending' | 'success' | 'error'; message?: string; reference?: string; requestId?: string }>({ type: 'idle' });
  const formStartedAt = useRef(new Date().toISOString());
  const submittingRef = useRef(false);
  const formStartTrackedRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  const fieldId = (field: keyof FormState | 'planId') => `${formId}-${field}`;
  const errorId = (field: keyof FormState | 'planId') => `${fieldId(field)}-error`;

  const focusFirstError = () => {
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  };

  const trackFormStart = () => {
    if (formStartTrackedRef.current) return;
    formStartTrackedRef.current = true;
    trackEvent('lead_form_start', {
      request_type: kind,
      service: defaultService,
      plan_id: planId,
      page_path: window.location.pathname,
    });
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    trackFormStart();
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status.type === 'error') setStatus({ type: 'idle' });
  };

  const restartForm = () => {
    setForm(createInitialState(defaultTechnology));
    setErrors({});
    setStatus({ type: 'idle' });
    formStartedAt.current = new Date().toISOString();
    formStartTrackedRef.current = false;
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input, select, textarea')?.focus());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    const nextErrors = validate(form, planId, Boolean(planOptions?.length));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      trackEvent('lead_form_validation_error', {
        request_type: kind,
        error_count: Object.keys(nextErrors).length,
        error_fields: Object.keys(nextErrors).sort().join(','),
      });
      setStatus({ type: 'error', message: 'Revisa los campos marcados antes de continuar.' });
      focusFirstError();
      return;
    }

    const attribution = getLeadAttribution();
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
      ...attribution,
      consentPrivacy: form.consentPrivacy,
      formStartedAt: formStartedAt.current,
      website: form.website,
    };

    submittingRef.current = true;
    trackEvent('lead_submit_attempt', { request_type: kind, service: defaultService, plan_id: planId });
    setStatus({ type: 'sending', message: 'Enviando solicitud…' });
    try {
      const response = await submitLead(kind, payload);
      setStatus({ type: 'success', message: response.message, reference: response.reference });
      trackEvent('lead_submit_success', { request_type: kind, service: defaultService, plan_id: planId });
      setForm(createInitialState(defaultTechnology));
      formStartedAt.current = new Date().toISOString();
      formStartTrackedRef.current = false;
      window.requestAnimationFrame(() => statusRef.current?.focus());
    } catch (error) {
      if (error instanceof LeadApiError) {
        const mappedErrors = Object.fromEntries(Object.entries(error.fieldErrors).map(([key, value]) => [key as keyof FormState, value]));
        setErrors((current) => ({ ...current, ...mappedErrors }));
        setStatus({ type: 'error', message: error.message, requestId: error.requestId });
        trackEvent('lead_submit_error', { request_type: kind, error_type: 'api' });
        if (Object.keys(mappedErrors).length > 0) focusFirstError();
        else window.requestAnimationFrame(() => statusRef.current?.focus());
      } else {
        setStatus({ type: 'error', message: 'No fue posible enviar la solicitud.' });
        trackEvent('lead_submit_error', { request_type: kind, error_type: 'network' });
        window.requestAnimationFrame(() => statusRef.current?.focus());
      }
    } finally {
      submittingRef.current = false;
    }
  };

  const formClass = compact ? 'lead-form lead-form--compact' : 'lead-form';

  if (status.type === 'success') {
    return (
      <div className={`${formClass} lead-form--success`} ref={statusRef} role="status" tabIndex={-1}>
        <span className="lead-form__success-icon"><Icon name="check" size={30} /></span>
        <span className="lead-form__success-label">Solicitud registrada</span>
        <h2>Gracias. Ya tenemos tu información.</h2>
        <p>{status.message || 'El equipo de Valtieris dará seguimiento a la solicitud comercial.'}</p>
        {status.reference ? <div className="lead-form__reference"><span>Referencia</span><strong>{status.reference}</strong></div> : null}
        <p className="lead-form__success-note">Conserva la referencia para cualquier aclaración. No necesitas volver a enviar el formulario.</p>
        <div className="lead-form__success-actions">
          <Link className="button button--primary" to="/">Volver al inicio</Link>
          <button className="button button--secondary" onClick={restartForm} type="button">Enviar otra solicitud</button>
        </div>
      </div>
    );
  }

  return (
    <form aria-busy={status.type === 'sending'} className={formClass} noValidate onFocusCapture={trackFormStart} onSubmit={handleSubmit} ref={formRef}>
      <div className="lead-form__heading">
        <span>Solicitud comercial</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <small>Los campos marcados con * son obligatorios.</small>
      </div>

      {status.type === 'error' ? (
        <div className="lead-form__status lead-form__status--error" ref={statusRef} role="alert" tabIndex={-1}>
          <strong>No se pudo enviar</strong>
          <span>{status.message}</span>
          {Object.keys(errors).length > 0 ? <span>{Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'campo requiere' : 'campos requieren'} atención.</span> : null}
          {status.requestId ? <small className="lead-form__error-reference">Referencia técnica: {status.requestId}</small> : null}
        </div>
      ) : null}

      <fieldset className="lead-form__section">
        <legend><span>1</span> Datos de contacto</legend>
        <p>Información para identificar y canalizar la solicitud.</p>

        <div className="lead-form__row">
          <label htmlFor={fieldId('firstName')}>
            Nombre *
            <input aria-describedby={errors.firstName ? errorId('firstName') : undefined} aria-invalid={Boolean(errors.firstName)} autoComplete="given-name" id={fieldId('firstName')} maxLength={80} value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} />
            {errors.firstName ? <small className="field-error" id={errorId('firstName')}>{errors.firstName}</small> : null}
          </label>
          <label htmlFor={fieldId('lastName')}>
            Apellidos
            <input autoComplete="family-name" id={fieldId('lastName')} maxLength={100} value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} />
          </label>
        </div>

        <div className="lead-form__row">
          <label htmlFor={fieldId('email')}>
            Correo empresarial *
            <input aria-describedby={errors.email ? errorId('email') : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" id={fieldId('email')} maxLength={180} type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            {errors.email ? <small className="field-error" id={errorId('email')}>{errors.email}</small> : null}
          </label>
          <label htmlFor={fieldId('phone')}>
            Teléfono
            <input aria-describedby={errors.phone ? errorId('phone') : undefined} aria-invalid={Boolean(errors.phone)} autoComplete="tel" id={fieldId('phone')} maxLength={40} type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            {errors.phone ? <small className="field-error" id={errorId('phone')}>{errors.phone}</small> : null}
          </label>
        </div>

        <div className="lead-form__row">
          <label htmlFor={fieldId('company')}>
            Empresa *
            <input aria-describedby={errors.company ? errorId('company') : undefined} aria-invalid={Boolean(errors.company)} autoComplete="organization" id={fieldId('company')} maxLength={160} value={form.company} onChange={(event) => updateField('company', event.target.value)} />
            {errors.company ? <small className="field-error" id={errorId('company')}>{errors.company}</small> : null}
          </label>
          <label htmlFor={fieldId('jobTitle')}>
            Cargo
            <input autoComplete="organization-title" id={fieldId('jobTitle')} maxLength={140} value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} />
          </label>
        </div>
      </fieldset>

      <fieldset className="lead-form__section">
        <legend><span>2</span> Contexto de la solicitud</legend>
        <p>Datos para entender el alcance antes del primer contacto.</p>

        {planOptions?.length ? (
          <label htmlFor={fieldId('planId')}>
            Plan de interés *
            <select
              aria-describedby={errors.planId ? errorId('planId') : undefined}
              aria-invalid={Boolean(errors.planId)}
              id={fieldId('planId')}
              value={planId ?? ''}
              onChange={(event) => {
                trackFormStart();
                onPlanChange?.(event.target.value);
                trackEvent('plan_select', { plan_id: event.target.value, request_type: kind });
                setErrors((current) => ({ ...current, planId: undefined }));
              }}
            >
              {planOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {errors.planId ? <small className="field-error" id={errorId('planId')}>{errors.planId}</small> : null}
          </label>
        ) : null}

        <div className="lead-form__row">
          <label htmlFor={fieldId('companySize')}>
            Tamaño de empresa
            <select id={fieldId('companySize')} value={form.companySize} onChange={(event) => updateField('companySize', event.target.value)}>
              <option value="">Selecciona una opción</option>
              <option value="1-10">1 a 10 personas</option>
              <option value="11-50">11 a 50 personas</option>
              <option value="51-250">51 a 250 personas</option>
              <option value="251-1000">251 a 1,000 personas</option>
              <option value="1000+">Más de 1,000 personas</option>
            </select>
          </label>
          <label htmlFor={fieldId('teamSize')}>
            Tamaño del equipo
            <select id={fieldId('teamSize')} value={form.teamSize} onChange={(event) => updateField('teamSize', event.target.value)}>
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
          <label htmlFor={fieldId('studentCount')}>
            Participantes estimados
            <input aria-describedby={errors.studentCount ? errorId('studentCount') : undefined} aria-invalid={Boolean(errors.studentCount)} id={fieldId('studentCount')} min={1} max={100000} inputMode="numeric" type="number" value={form.studentCount} onChange={(event) => updateField('studentCount', event.target.value)} />
            {errors.studentCount ? <small className="field-error" id={errorId('studentCount')}>{errors.studentCount}</small> : null}
          </label>
          <label htmlFor={fieldId('technologyInterest')}>
            Tecnologías de interés
            <input id={fieldId('technologyInterest')} maxLength={300} placeholder="Ej. Java, testing, cloud" value={form.technologyInterest} onChange={(event) => updateField('technologyInterest', event.target.value)} />
          </label>
        </div>

        <label htmlFor={fieldId('message')}>
          ¿Qué necesitas? *
          <textarea aria-describedby={`${fieldId('message')}-counter${errors.message ? ` ${errorId('message')}` : ''}`} aria-invalid={Boolean(errors.message)} id={fieldId('message')} maxLength={2000} rows={5} value={form.message} onChange={(event) => updateField('message', event.target.value)} />
          <span className="field-counter" id={`${fieldId('message')}-counter`}>{form.message.length}/2000</span>
          {errors.message ? <small className="field-error" id={errorId('message')}>{errors.message}</small> : null}
        </label>
      </fieldset>

      <label className="form-honeypot" aria-hidden="true">
        Sitio web
        <input autoComplete="off" tabIndex={-1} value={form.website} onChange={(event) => updateField('website', event.target.value)} />
      </label>

      <div className="lead-form__consent-wrap">
        <label className="lead-consent" htmlFor={fieldId('consentPrivacy')}>
          <input aria-describedby={errors.consentPrivacy ? errorId('consentPrivacy') : undefined} aria-invalid={Boolean(errors.consentPrivacy)} checked={form.consentPrivacy} id={fieldId('consentPrivacy')} type="checkbox" onChange={(event) => updateField('consentPrivacy', event.target.checked)} />
          <span>Acepto que Valtieris procese estos datos para atender mi solicitud comercial. Consulta el <Link to="/aviso-de-privacidad">aviso de privacidad</Link>.</span>
        </label>
        {errors.consentPrivacy ? <small className="field-error" id={errorId('consentPrivacy')}>{errors.consentPrivacy}</small> : null}
      </div>

      {status.type === 'sending' ? (
        <div className="lead-form__status lead-form__status--sending" role="status">
          <strong>Procesando</strong>
          <span>{status.message}</span>
        </div>
      ) : null}

      <div className="lead-form__submit-area">
        <button className="button button--primary button--large" disabled={status.type === 'sending'} type="submit">
          {status.type === 'sending' ? <span aria-hidden="true" className="button__spinner" /> : <Icon name="send" size={17} />}
          <span>{status.type === 'sending' ? 'Enviando…' : submitLabel}</span>
        </button>
        <p className="lead-form__security-note"><Icon name="lock" size={16} /> La información se utiliza únicamente para atender la solicitud y prevenir envíos abusivos.</p>
      </div>
    </form>
  );
}
