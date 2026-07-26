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
  | 'close';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Technology {
  name: string;
  slug: string;
  summary: string;
  category: string;
  level: string;
  iconLabel: string;
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
  name: string;
  audience: string;
  priceLabel: string;
  description: string;
  features: string[];
  featured?: boolean;
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
