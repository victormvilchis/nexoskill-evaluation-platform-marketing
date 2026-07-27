import { Link } from 'react-router-dom';
import { planComparison, plans } from '../../content/plans';

export function PlanComparison() {
  return (
    <div className="comparison-table-wrap" role="region" aria-label="Comparación de planes" tabIndex={0}>
      <table className="comparison-table">
        <thead>
          <tr>
            <th scope="col">Capacidad</th>
            {plans.map((plan) => <th scope="col" key={plan.id}>{plan.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {planComparison.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {plans.map((plan) => <td key={plan.id}>{row.values[plan.id]}</td>)}
            </tr>
          ))}
          <tr className="comparison-table__actions">
            <th scope="row">Siguiente paso</th>
            {plans.map((plan) => (
              <td key={plan.id}>
                <Link to={`/solicitar-cotizacion?plan=${encodeURIComponent(plan.id)}`}>Solicitar cotización</Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
