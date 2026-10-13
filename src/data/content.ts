export const identity = {
  name: "Alaa Ziad Tawalbeh",
  title:
    "Software Developer | Full Stack & Flutter | Computer Science Graduate at JUST",
  email: "3latawalbeh@gmail.com",
  github: "https://github.com/3latw",
  linkedin: "https://www.linkedin.com/in/alaa-tawalbeh/",
  cv: "files/Alaa-Ziad-Tawalbeh-CV.pdf",
  portrait: "media/IMG_6816.MP4",
};
export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  previewVideo?: string;
  screenshot?: string;
  githubUrl?: string;
  demoUrl?: string;
}
// Relative media paths are resolved against Vite's deployment base.
// All projects remain COMING SOON until the owner is ready to publish them.
export const projects: Project[] = [
  {
    id: "01",
    name: "Smart Bus",
    category: "MOBILITY",
    description: "A project exploring a more connected journey.",
  },
  {
    id: "02",
    name: "SkillSwap",
    category: "COMMUNITY",
    description: "A space for exchanging skills and knowledge.",
  },
  {
    id: "03",
    name: "CV Analyzer",
    category: "CAREER TOOLS",
    description: "Exploring better ways to understand a résumé.",
  },
  {
    id: "04",
    name: "Job Finder Platform",
    category: "OPPORTUNITIES",
    description: "Connecting the next step with the right opportunity.",
  },
  {
    id: "05",
    name: "University Management System",
    category: "EDUCATION",
    description: "An exploration of connected academic workflows.",
  },
  {
    id: "06",
    name: "AI Chatbot Application",
    category: "CONVERSATIONAL AI",
    description: "An exploration of useful, conversational interfaces.",
  },
];
export const skillGroups = [
  {
    title: "Interfaces",
    skills: ["Flutter", "Dart", "HTML5", "CSS3", "JavaScript"],
  },
  { title: "Systems", skills: ["ASP.NET Core 6", "C#", "REST APIs", "Python"] },
  {
    title: "Data & workflow",
    skills: [
      "SQL Server",
      "MySQL",
      "Database management",
      "Git",
      "GitHub",
      "AI-assisted development",
    ],
  },
];
export const experience = [
  {
    year: "2026",
    kind: "EXPERIENCE",
    title: "Software Development Trainee",
    place: "King Abdullah University Hospital",
    detail:
      "Collaborated on software development, system support, technical operations, and troubleshooting.",
  },
  {
    year: "2026",
    kind: "EDUCATION",
    title: "BSc Computer Science",
    place: "Jordan University of Science and Technology (JUST)",
    detail:
      "Computer Science graduate, building a foundation for thoughtful software development.",
  },
  {
    year: "2024",
    kind: "TRAINING",
    title: "ASP.NET Core / C#",
    place: "Tuned Applications Academy",
    detail:
      "80 hours of hands-on ASP.NET Core 6 and C# training: MVC, Entity Framework Core, RESTful APIs, authentication, and database integration.",
  },
];
export function assetUrl(path: string) {
  return /^(https?:|data:|blob:)/.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
