import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { LeadForm } from '../components/forms/LeadForm';
import { plans } from '../content/plans';
import { Seo } from '../seo/Seo';

export function QuoteRequestPage() {
  const [searchParams] = useSearchParams();
  const requestedPlan = searchParams.get('plan') ?? plans[1].id;
  const normalizedPlan = requestedPlan === 'business-certification' ? 'business-talent' : requestedPlan;
  const initialPlan = plans.some((plan) => plan.id === normalizedPlan) ? normalizedPlan : plans[1].id;
  const [planId, setPlanId] = useState(initialPlan);
  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === planId) ?? plans[1], [planId]);

  return (
    <div className="quote-page">
      <Seo
        description="Solicita una cotización de Valtieris según el plan, la capacidad, el contenido tecnológico y el objetivo de tu organización."
        path="/solicitar-cotizacion"
        title="Solicitar cotización"
      />
      <section className="quote-hero">
        <div className="container quote-layout">
          <div className="quote-copy">
            <nav aria-label="Migas de pan" className="breadcrumbs"><Link to="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">Solicitar cotización</span></nav>
            <span className="eyebrow eyebrow--hero">Solicitud comercial</span>
            <h1>Dimensiona una propuesta para tu equipo.</h1>
            <p>Comparte el contexto de tu organización para que el equipo comercial pueda revisar el alcance y preparar el siguiente paso contigo.</p>
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

          <LeadForm
            defaultService="Cotización"
            description="Comparte el contexto de tu organización y el objetivo para preparar una propuesta comercial."
            kind="quote"
            onPlanChange={setPlanId}
            planId={planId}
            planOptions={plans.map((plan) => ({ value: plan.id, label: plan.name }))}
            source="/solicitar-cotizacion"
            submitLabel="Solicitar cotización"
            title="Datos para preparar la cotización"
          />
        </div>
      </section>
    </div>
  );
}
