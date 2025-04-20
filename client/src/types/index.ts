// Portfolio Data Types
export interface PortfolioData {
  about: RagContext[];
  skills: RagContext[];
  projects: RagContext[];
  experience: RagContext[];
  education: RagContext[];
}

export interface RagContext {
  id: number;
  title: string;
  content: string;
  section: string;
  embeddings: any | null;
}

// Project Data Types
export interface Project {
  id: number;
  title: string;
  image: string;
  description: string;
  shortDescription: string;
  tech: string[];
  features: string[];
  demo: string;
  code: string;
  featured?: boolean;
}

// Experience Data Types
export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

// Education Data Types
export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  courses: string[];
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
}

// Skill Data Types
export interface Skill {
  name: string;
  percentage: number;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Technology {
  name: string;
  icon: string;
}

// Chat Types
export interface ChatMessage {
  id?: number;
  question: string;
  answer: string;
  createdAt?: Date;
  isLoading?: boolean;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
