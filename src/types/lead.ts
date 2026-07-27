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
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string>;
}
