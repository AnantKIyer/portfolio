export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  status: "Completed" | "In Progress" | "On Hold";
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile";
  year: number;
  duration: string;
  teamSize: number;
  role: string;
  challenges: string[];
  solutions: string[];
  keyFeatures: string[];
  results: string[];
  lessonsLearned: string[];
  githubUrl?: string;
  liveUrl?: string;
  order: number;
  published: boolean;
};

export type PortfolioProfile = {
  name: string;
  title: string;
  tagline: string;
  footerBio: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string;
  links: {
    github: string;
    linkedin: string;
  };
  stats: {
    experience: string;
    companies: string;
    technologies: string;
  };
  education: {
    school: string;
    degree: string;
    location: string;
    period: string;
  };
};

export type SiteStatus = {
  availableForWork: boolean;
  buildingNote: string;
  featuredProjectSlug: string | null;
  featuredNote: string | null;
  updatedAt: number;
};
