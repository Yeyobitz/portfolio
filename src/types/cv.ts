export interface CV {
  basics: Basics;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  projects: Project[];
}

export interface Basics {
  name: string;
  handle: string;
  headline: string;
  label: string;
  email: string;
  location: string;
  timezone: string;
  availability: string;
  availabilityShort: string;
  english: string;
  rate: string;
  summary: string;
  lookingFor: string;
  profiles: Profile[];
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Experience {
  company: string;
  role: string;
  promotion?: string;
  period: string;
  mode: string;
  summary: string;
  highlights: string[];
  tools: string[];
}

export interface Education {
  title: string;
  institution: string;
  period: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Project {
  name: string;
  status: 'live' | 'building';
  year: string;
  description: string;
  highlights: string[];
  technologies: string[];
  repo?: string;
  demo?: string;
  impact?: string;
  role?: string;
}
