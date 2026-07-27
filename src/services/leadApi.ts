import { siteConfig } from '../seo/siteConfig';
import type { LeadKind, LeadSubmissionPayload, LeadSubmissionResponse, ProblemDetails } from '../types/lead';

export class LeadApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status?: number,
    fieldErrors: Record<string, string> = {},
    code?: string,
    requestId?: string,
  ) {
    super(message);
    this.name = 'LeadApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
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
        problem.message || problem.detail || 'No fue posible enviar la solicitud. Intenta nuevamente.',
        response.status,
        problem.fieldErrors ?? problem.errors ?? {},
        problem.code,
        problem.requestId || response.headers.get('X-Request-Id') || undefined,
      );
    }

    return await response.json() as LeadSubmissionResponse;
  } catch (error) {
    if (error instanceof LeadApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new LeadApiError('La solicitud tardó demasiado. Verifica tu conexión e inténtalo nuevamente.');
    }
    throw new LeadApiError('No pudimos conectar con el servicio en este momento. Verifica tu conexión e inténtalo nuevamente.');
  } finally {
    window.clearTimeout(timeout);
  }
}
