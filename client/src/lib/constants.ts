import { Project, Experience, Education, Certification, SkillCategory, Technology } from "../types";

export const PORTFOLIO_OWNER = {
  name: "John Doe",
  title: "Full Stack Developer & AI Enthusiast",
  email: "john.doe@example.com",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  description: "I build innovative web applications with cutting-edge technologies. Explore my work and learn more about my journey in tech.",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  yearsExperience: 7,
  education: "MS Computer Science",
};

export const HIGHLIGHTS = [
  {
    title: "Problem Solver",
    description: "I enjoy tackling complex problems and finding elegant solutions through creative thinking and systematic approaches.",
    icon: "ShieldCheck"
  },
  {
    title: "Team Player",
    description: "I thrive in collaborative environments, valuing clear communication and the diverse perspectives that team members bring.",
    icon: "Users"
  },
  {
    title: "Continuous Learner",
    description: "I'm committed to growth, constantly expanding my knowledge through courses, projects, and staying up-to-date with industry trends.",
    icon: "Beaker"
  }
];

export const TECHNICAL_SKILLS: SkillCategory = {
  title: "Technical Skills",
  skills: [
    { name: "JavaScript / TypeScript", percentage: 95 },
    { name: "React / React Native", percentage: 90 },
    { name: "Node.js / Express", percentage: 85 },
    { name: "Python / Django", percentage: 80 },
    { name: "Cloud (AWS, Azure)", percentage: 75 }
  ]
};

export const SOFT_SKILLS: SkillCategory = {
  title: "Soft Skills",
  skills: [
    { name: "Problem Solving", percentage: 95 },
    { name: "Communication", percentage: 90 },
    { name: "Team Collaboration", percentage: 90 },
    { name: "Project Management", percentage: 85 },
    { name: "Adaptability", percentage: 95 }
  ]
};

export const TECHNOLOGIES: Technology[] = [
  { name: "React", icon: "SiReact" },
  { name: "Node.js", icon: "SiNodedotjs" },
  { name: "TypeScript", icon: "SiTypescript" },
  { name: "JavaScript", icon: "SiJavascript" },
  { name: "Python", icon: "SiPython" },
  { name: "AWS", icon: "SiAmazonaws" }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    shortDescription: "A full-featured e-commerce platform with product management, cart functionality, payment processing, and admin dashboard.",
    description: "A comprehensive e-commerce solution built with React, Node.js, and MongoDB. Features include product management, shopping cart, secure checkout, user authentication, and an admin dashboard for inventory management.",
    tech: ["React", "Node.js", "Express", "MongoDB", "AWS S3", "Stripe API"],
    features: [
      "Responsive design for all devices",
      "Advanced search and filtering options",
      "Secure payment processing",
      "User reviews and ratings",
      "Order tracking and history"
    ],
    demo: "#",
    code: "#",
    featured: true
  },
  {
    id: 2,
    title: "AI Content Generator",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    shortDescription: "An application that leverages GPT models to generate and optimize content for various formats and platforms.",
    description: "An application that uses GPT-3 to generate and optimize content for various formats. It helps users create blog posts, social media content, product descriptions, and more with AI assistance.",
    tech: ["React", "Python", "FastAPI", "OpenAI API", "PostgreSQL", "Docker"],
    features: [
      "Content generation for multiple formats",
      "Tone and style customization",
      "Export to various file formats",
      "Content history and favorites",
      "SEO optimization suggestions"
    ],
    demo: "#",
    code: "#"
  },
  {
    id: 3,
    title: "Task Management App",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    shortDescription: "A collaborative task management tool with real-time updates, team features, and productivity analytics.",
    description: "A collaborative task management application with real-time updates, team functionality, and productivity analytics. It helps teams organize work, track progress, and meet deadlines efficiently.",
    tech: ["React", "Firebase", "Redux", "Material-UI", "Chart.js", "PWA"],
    features: [
      "Real-time collaboration",
      "Task assignments and deadlines",
      "Progress tracking",
      "Productivity analytics",
      "Offline capability via PWA"
    ],
    demo: "#",
    code: "#"
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "Senior Full Stack Developer",
    company: "TechInnovate Solutions",
    period: "Jan 2020 - Present",
    description: "Led the development of a cloud-based SaaS platform, resulting in a 40% increase in user engagement and 25% revenue growth. Mentored junior developers and implemented modern CI/CD practices.",
    achievements: [
      "Architected and deployed microservices infrastructure reducing server costs by 35%",
      "Implemented automated testing reducing bug reports by 60%",
      "Led migration from monolith to microservices architecture"
    ]
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "WebFront Technologies",
    period: "Mar 2017 - Dec 2019",
    description: "Developed responsive web applications for clients in finance and healthcare sectors. Collaborated with design and product teams to deliver high-quality software solutions.",
    achievements: [
      "Delivered 15+ client projects with 100% on-time completion rate",
      "Optimized front-end performance increasing page load speeds by 45%",
      "Implemented secure authentication systems for healthcare applications"
    ]
  },
  {
    id: 3,
    role: "Junior Web Developer",
    company: "Digital Creations Agency",
    period: "Jun 2015 - Feb 2017",
    description: "Worked on front-end development for various client websites. Collaborated with designers to implement responsive layouts and interactive features.",
    achievements: [
      "Built custom WordPress themes for 10+ client websites",
      "Implemented responsive design principles across all projects",
      "Developed custom JavaScript animations and interactive elements"
    ]
  }
];

export const EDUCATIONS: Education[] = [
  {
    id: 1,
    degree: "Master of Science in Computer Science",
    institution: "Stanford University",
    period: "2013 - 2015",
    description: "Specialized in Machine Learning and Artificial Intelligence. Graduated with honors.",
    courses: [
      "Advanced Algorithms",
      "Machine Learning",
      "Neural Networks",
      "Distributed Systems",
      "Cloud Computing"
    ]
  },
  {
    id: 2,
    degree: "Bachelor of Science in Computer Engineering",
    institution: "Massachusetts Institute of Technology",
    period: "2009 - 2013",
    description: "Graduated cum laude with a focus on software engineering and computer systems.",
    courses: [
      "Data Structures",
      "Operating Systems",
      "Computer Architecture",
      "Database Systems",
      "Web Development"
    ]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2021"
  },
  {
    id: 2,
    name: "Professional Scrum Master I",
    issuer: "Scrum.org",
    year: "2019"
  },
  {
    id: 3,
    name: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    year: "2020"
  },
  {
    id: 4,
    name: "MongoDB Developer Certification",
    issuer: "MongoDB University",
    year: "2018"
  }
];
