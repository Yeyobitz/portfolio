export interface CV {
  basics: Basics;
  skills: Skill[];
  projects: Project[];
}

export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  url: string;
  summary: string;
  profiles: Profile[];
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Project {
  name: string;
  isActive: boolean;
  description: string;
  highlights: string[];
  url?: string;
  github?: string;
  images?: string[]; // Added images array for carousel
}