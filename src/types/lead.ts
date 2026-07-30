export type LeadKind = 'contact' | 'demo' | 'quote' | 'advisory' | 'bootcamp';

export interface LeadSubmissionPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  companySize?: string;
  teamSize?: string;
  studentCount?: number;
  serviceInterest?: string;
  technologyInterest?: string;
  planId?: string;
  message: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  clickId?: string;
  clickIdType?: string;
  referrer?: string;
  landingPage?: string;
  conversionPage?: string;
  attributionCapturedAt?: string;
  analyticsConsent?: 'GRANTED' | 'DENIED' | 'UNSET';
  consentPrivacy: boolean;
  formStartedAt: string;
  website?: string;
}

export interface LeadSubmissionResponse {
  reference: string;
  message: string;
  submittedAt: string;
}

export interface ProblemDetails {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
  timestamp?: string;
  path?: string;
  requestId?: string;
  // Compatibilidad temporal con respuestas RFC 9457 de versiones anteriores.
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string>;
}
