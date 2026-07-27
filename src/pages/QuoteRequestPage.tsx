import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { LeadForm } from '../components/forms/LeadForm';
import { plans } from '../content/plans';
import { Seo } from '../seo/Seo';

export function QuoteRequestPage() {
  const [searchParams] = useSearchParams();
  const requestedPlan = searchParams.get('plan') ?? plans[1].id;
  const initialPlan = plans.some((plan) => plan.id === requestedPlan) ? requestedPlan : plans[1].id;
  const [planId, setPlanId] = useState(initialPlan);
  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === planId) ?? plans[1], [planId]);

  return (
    <div className="quote-page">
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
            <p>La solicitud se registra en el backend de marketing para que el equipo comercial pueda darle seguimiento y, cuando el correo esté configurado, recibir notificaciones automáticas.</p>
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
            description="Comparte el tamaño del equipo y el objetivo para preparar una propuesta comercial."
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
