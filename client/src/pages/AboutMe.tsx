import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  User, 
  Code, 
  Heart, 
  Clock, 
  GraduationCap,
  Bot,
  ExternalLink,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';
import { PORTFOLIO_OWNER, TECHNOLOGIES, HIGHLIGHTS } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AboutMe = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'background' | 'values'>('overview');

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile section */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <Card className="overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={PORTFOLIO_OWNER.photo} alt={PORTFOLIO_OWNER.name} />
                    <AvatarFallback>{PORTFOLIO_OWNER.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mt-4">{PORTFOLIO_OWNER.name}</h2>
                  <p className="text-muted-foreground">Technology Enthusiast & Self-taught Developer</p>
                  
                  <div className="flex gap-3 mt-4">
                    <a href={PORTFOLIO_OWNER.github} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={PORTFOLIO_OWNER.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={`mailto:${PORTFOLIO_OWNER.email}`}>
                      <Button size="icon" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Name</span>
                      </div>
                      <span>{PORTFOLIO_OWNER.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Email</span>
                      </div>
                      <span className="text-sm">{PORTFOLIO_OWNER.email}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Experience</span>
                      </div>
                      <span>{PORTFOLIO_OWNER.yearsExperience}+ Years</span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <Link href="/contact">
                    <Button className="w-full">
                      Contact Me
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content section */}
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">About Me</h1>
              <p className="text-xl text-muted-foreground">
                Get to know me better, my background, and what drives me.
              </p>
            </div>
            
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium ${activeTab === 'overview' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('background')}
                className={`px-4 py-2 font-medium ${activeTab === 'background' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground'}`}
              >
                Background
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`px-4 py-2 font-medium ${activeTab === 'values' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground'}`}
              >
                Values & Approach
              </button>
            </div>
            
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Hello, I'm {PORTFOLIO_OWNER.name}!</h2>
                  <p className="text-muted-foreground mb-4">
                    I'm a passionate technology enthusiast with a strong interest in software development
                    and digital innovation. I enjoy creating interactive web applications and exploring new
                    technologies. My journey in technology has been self-directed, driven by curiosity
                    and a desire to build useful applications.
                  </p>
                  <p className="text-muted-foreground">
                    This interactive portfolio is designed to showcase my skills, projects,
                    and approach to problem-solving. Feel free to explore the different sections to get a
                    comprehensive view of what I can bring to your team or project.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {HIGHLIGHTS.map((highlight, index) => (
                      <Card key={index} className="border-border/50">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-medium mb-2">{highlight.title}</h4>
                          <p className="text-sm text-muted-foreground">{highlight.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Technologies I Work With</h3>
                  <div className="flex flex-wrap gap-2">
                    {TECHNOLOGIES.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'background' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">My Background</h2>
                  <p className="text-muted-foreground mb-4">
                    I began my journey in technology through self-directed learning and personal projects.
                    Driven by curiosity and a passion for creating digital solutions, I've developed a
                    strong foundation in programming and web development.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    My approach to learning has been hands-on, building projects that solve real problems
                    while mastering new technologies and frameworks. I've supplemented this practical experience
                    with online courses, tutorials, and active participation in developer communities.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Learning Journey</h3>
                  <div className="space-y-6">
                    <div className="relative pl-8 border-l border-muted pb-6">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">Web Development Foundations</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mastered HTML, CSS, and JavaScript through building responsive websites
                        and interactive web applications. Focused on modern best practices and
                        semantic markup.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 border-l border-muted pb-6">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">Front-end Frameworks</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developed proficiency in React and modern JavaScript frameworks.
                        Built single-page applications with state management, routing, and
                        API integration. Explored component-based architecture and UI libraries.
                      </p>
                    </div>
                    
                    <div className="relative pl-8 border-l border-muted pb-6">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">Back-end & Full Stack Development</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learned Node.js, Express, and database technologies to build full-stack
                        applications. Implemented RESTful APIs, authentication systems, and
                        data persistence solutions.
                      </p>
                    </div>
                    
                    <div className="relative pl-8">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">Continuous Learning</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Actively expanding knowledge through online courses, documentation,
                        coding challenges, and contributing to open-source projects. Always
                        exploring new technologies and industry best practices.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'values' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">My Values & Approach</h2>
                  <p className="text-muted-foreground mb-4">
                    I believe that technology should empower people and solve real problems.
                    My approach to development is guided by a set of core values that ensure
                    I deliver high-quality, user-centric solutions.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Code className="h-4 w-4 text-blue-500" />
                        </div>
                        Clean, Maintainable Code
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        I value writing clean, well-documented, and maintainable code. I follow best practices,
                        consistent coding standards, and thoughtful architecture to ensure long-term sustainability.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-500" />
                        </div>
                        User-Centered Design
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        I prioritize the end user's needs and experiences in my development process.
                        I believe in creating intuitive, accessible, and delightful interfaces that
                        solve real problems.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-500" />
                        </div>
                        Continuous Learning
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        I am committed to ongoing education and skill development. The tech field
                        evolves rapidly, and I stay current with new technologies, methodologies,
                        and best practices.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-purple-500" />
                        </div>
                        Passion & Dedication
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        I approach every project with enthusiasm and commitment. I'm passionate about
                        technology and dedicated to creating meaningful, impactful solutions that make
                        a difference.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">My Development Process</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Understanding the Problem</h4>
                        <p className="text-sm text-muted-foreground">
                          I start by thoroughly understanding the problem, user needs, and project requirements.
                          This foundation ensures that the solution addresses the core challenges effectively.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Planning & Architecture</h4>
                        <p className="text-sm text-muted-foreground">
                          I design a thoughtful architecture and create a development plan before coding.
                          This includes selecting the right technologies, planning the structure, and breaking
                          down tasks into manageable components.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Implementation</h4>
                        <p className="text-sm text-muted-foreground">
                          I implement the solution with clean, maintainable code, following best practices
                          and industry standards. I focus on creating components that are modular, reusable,
                          and well-documented.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">4</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Testing & Refinement</h4>
                        <p className="text-sm text-muted-foreground">
                          I thoroughly test the application to ensure it works as expected, is free of bugs,
                          and provides a smooth user experience. I refine the solution based on feedback and
                          testing results.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">5</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Delivery & Continuous Improvement</h4>
                        <p className="text-sm text-muted-foreground">
                          After delivering the solution, I remain committed to its success. I gather feedback,
                          monitor performance, and make ongoing improvements to ensure the product continues
                          to meet users' evolving needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Want to learn more?</h2>
                <p className="text-muted-foreground max-w-xl">
                  Explore my skills, projects, and experience through the interactive sections of this portfolio.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/skills">
                  <Button className="bg-gradient-to-r from-primary to-purple-600">
                    Explore My Skills
                  </Button>
                </Link>
                <Link href="/experience">
                  <Button variant="outline">
                    View My Experience
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutMe;