import { siteConfig } from '../seo/siteConfig';
import type { LeadKind, LeadSubmissionPayload, LeadSubmissionResponse, ProblemDetails } from '../types/lead';

export class LeadApiError extends Error {
  readonly status?: number;
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, status?: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'LeadApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function submitLead(kind: LeadKind, payload: LeadSubmissionPayload): Promise<LeadSubmissionResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${siteConfig.apiUrl}/v1/leads/${kind}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      let problem: ProblemDetails = {};
      try {
        problem = await response.json() as ProblemDetails;
      } catch {
        problem = {};
      }
      throw new LeadApiError(
        problem.detail || 'No fue posible enviar la solicitud. Intenta nuevamente.',
        response.status,
        problem.errors ?? {},
      );
    }

    return await response.json() as LeadSubmissionResponse;
  } catch (error) {
    if (error instanceof LeadApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new LeadApiError('La solicitud tardó demasiado. Verifica que el backend esté disponible e intenta nuevamente.');
    }
    throw new LeadApiError('No fue posible conectar con el servicio de solicitudes. Verifica que el backend esté ejecutándose.');
  } finally {
    window.clearTimeout(timeout);
  }
}
