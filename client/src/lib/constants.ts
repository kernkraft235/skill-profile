import {
  Project,
  Experience,
  Education,
  Certification,
  SkillCategory,
  Technology,
} from "../types";

export const PORTFOLIO_OWNER = {
  name: "Graham Colehour",
  title: "Full Stack Developer & AI Enthusiast",
  email: "graham.colehour@example.com",
  github: "https://github.com/grahamcolehour",
  linkedin: "https://linkedin.com/in/grahamcolehour",
  description:
    "I build innovative web applications with cutting-edge technologies. Explore my work and learn more about my journey in tech.",
  photo: "https://placehold.co/400x400/grey/white?text=GC&font=playfair",
  yearsExperience: 7,
};

export const HIGHLIGHTS = [
  {
    title: "Problem Solver",
    description:
      "I enjoy tackling complex problems and finding elegant solutions through creative thinking and systematic approaches.",
    icon: "ShieldCheck",
  },
  {
    title: "Team Player",
    description:
      "I thrive in collaborative environments, valuing clear communication and the diverse perspectives that team members bring.",
    icon: "Users",
  },
  {
    title: "Continuous Learner",
    description:
      "I'm committed to growth, constantly expanding my knowledge through courses, projects, and staying up-to-date with industry trends.",
    icon: "Beaker",
  },
];

export const TECHNICAL_SKILLS: SkillCategory = {
  title: "Technical Skills",
  skills: [
    { name: "JavaScript / TypeScript", percentage: 95 },
    { name: "React / React Native", percentage: 90 },
    { name: "Node.js / Express", percentage: 85 },
    { name: "Python / Django", percentage: 80 },
    { name: "Cloud (AWS, Azure)", percentage: 75 },
  ],
};

export const SOFT_SKILLS: SkillCategory = {
  title: "Soft Skills",
  skills: [
    { name: "Problem Solving", percentage: 95 },
    { name: "Communication", percentage: 90 },
    { name: "Team Collaboration", percentage: 90 },
    { name: "Project Management", percentage: 85 },
    { name: "Adaptability", percentage: 95 },
  ],
};

export const TECHNOLOGIES: Technology[] = [
  { name: "React", icon: "SiReact" },
  { name: "Node.js", icon: "SiNodedotjs" },
  { name: "TypeScript", icon: "SiTypescript" },
  { name: "JavaScript", icon: "SiJavascript" },
  { name: "Python", icon: "SiPython" },
  { name: "AWS", icon: "SiAmazonaws" },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    shortDescription:
      "A full-featured e-commerce platform with product management, cart functionality, payment processing, and admin dashboard.",
    description:
      "A comprehensive e-commerce solution built with React, Node.js, and MongoDB. Features include product management, shopping cart, secure checkout, user authentication, and an admin dashboard for inventory management.",
    tech: ["React", "Node.js", "Express", "MongoDB", "AWS S3", "Stripe API"],
    features: [
      "Responsive design for all devices",
      "Advanced search and filtering options",
      "Secure payment processing",
      "User reviews and ratings",
      "Order tracking and history",
    ],
    demo: "#",
    code: "#",
    featured: true,
  },
  {
    id: 2,
    title: "AI Content Generator",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    shortDescription:
      "An application that leverages GPT models to generate and optimize content for various formats and platforms.",
    description:
      "An application that uses GPT-3 to generate and optimize content for various formats. It helps users create blog posts, social media content, product descriptions, and more with AI assistance.",
    tech: ["React", "Python", "FastAPI", "OpenAI API", "PostgreSQL", "Docker"],
    features: [
      "Content generation for multiple formats",
      "Tone and style customization",
      "Export to various file formats",
      "Content history and favorites",
      "SEO optimization suggestions",
    ],
    demo: "#",
    code: "#",
  },
  {
    id: 3,
    title: "Task Management App",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    shortDescription:
      "A collaborative task management tool with real-time updates, team features, and productivity analytics.",
    description:
      "A collaborative task management application with real-time updates, team functionality, and productivity analytics. It helps teams organize work, track progress, and meet deadlines efficiently.",
    tech: ["React", "Firebase", "Redux", "Material-UI", "Chart.js", "PWA"],
    features: [
      "Real-time collaboration",
      "Task assignments and deadlines",
      "Progress tracking",
      "Productivity analytics",
      "Offline capability via PWA",
    ],
    demo: "#",
    code: "#",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "Technology Enthusiast",
    company: "Personal Projects",
    period: "2021 - Present",
    description:
      "Developed various personal projects to enhance skills in full-stack development. Focused on learning modern frameworks and technologies through practical application.",
    achievements: [
      "Created a portfolio website showcasing technical abilities and projects",
      "Implemented responsive design and modern UI patterns",
      "Built applications using React, Node.js, and modern JavaScript",
    ],
  },
  {
    id: 2,
    role: "Open Source Contributor",
    company: "Various Projects",
    period: "2019 - Present",
    description:
      "Contributed to open source projects to improve coding skills and collaborate with the developer community. Participated in code reviews and implementation discussions.",
    achievements: [
      "Submitted pull requests to improve documentation and features",
      "Fixed bugs in community projects",
      "Learned best practices through peer code reviews",
    ],
  },
  {
    id: 3,
    role: "Self-taught Developer",
    company: "Online Learning Platforms",
    period: "2018 - Present",
    description:
      "Completed numerous courses on web development, programming fundamentals, and software architecture. Built projects to apply learned concepts.",
    achievements: [
      "Mastered core web technologies including HTML, CSS, and JavaScript",
      "Completed advanced courses in React, Node.js, and databases",
      "Developed problem-solving skills through coding challenges",
    ],
  },
];

export const EDUCATIONS: Education[] = [];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2021",
  },
  {
    id: 2,
    name: "Professional Scrum Master I",
    issuer: "Scrum.org",
    year: "2019",
  },
  {
    id: 3,
    name: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    year: "2020",
  },
  {
    id: 4,
    name: "MongoDB Developer Certification",
    issuer: "MongoDB University",
    year: "2018",
  },
];
