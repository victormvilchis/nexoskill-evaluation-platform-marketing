export type IconName =
  | 'assessment'
  | 'path'
  | 'analytics'
  | 'academy'
  | 'consulting'
  | 'talent'
  | 'shield'
  | 'layers'
  | 'users'
  | 'chart'
  | 'code'
  | 'cloud'
  | 'check'
  | 'arrow'
  | 'menu'
  | 'close'
  | 'target'
  | 'book'
  | 'settings'
  | 'briefcase'
  | 'report'
  | 'database'
  | 'rocket'
  | 'refresh'
  | 'clipboard'
  | 'search'
  | 'chevron'
  | 'send'
  | 'lock';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface TechnologyCompetency {
  title: string;
  description: string;
}

export interface TechnologyOffering {
  title: string;
  description: string;
  icon: IconName;
}

export interface TechnologyFaq {
  question: string;
  answer: string;
}

export interface Technology {
  name: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  level: string;
  levels: string[];
  iconLabel: string;
  featured?: boolean;
  audience: string[];
  competencies: TechnologyCompetency[];
  offerings: TechnologyOffering[];
  learningPath: string[];
  modalities: string[];
  relatedPrograms: string[];
  faqs: TechnologyFaq[];
  seoKeywords: string[];
}

export interface Service {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  bullets: string[];
}

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface Plan {
  id: string;
  name: string;
  audience: string;
  priceLabel: string;
  description: string;
  seats: string;
  technologyScope: string;
  roles: string;
  reporting: string;
  substitutions: string;
  support: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
}

export interface PlanComparisonRow {
  label: string;
  values: Record<string, string>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PageCapability {
  title: string;
  description: string;
  icon: IconName;
  bullets?: string[];
}

export interface JourneyStep {
  number: string;
  title: string;
  description: string;
}

export interface ProgramItem {
  title: string;
  description: string;
  icon: IconName;
  tag?: string;
  bullets: string[];
}
