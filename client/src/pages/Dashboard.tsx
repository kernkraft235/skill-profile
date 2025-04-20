import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Briefcase, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Search,
  Bot,
  User,
  Globe,
  Code,
  BookOpen,
  Terminal,
  BarChart2
} from 'lucide-react';
import { PORTFOLIO_OWNER } from '@/lib/constants';

const Dashboard = () => {
  const sections = [
    {
      title: "About Me",
      description: "Learn more about me, my background, and my approach to work.",
      longDescription: "Get to know me better through my professional journey, personal interests, and work philosophy. Find out what drives me and how I approach challenges.",
      icon: <User className="h-10 w-10 text-emerald-500" />,
      color: "from-emerald-500 to-teal-600",
      link: "/about",
      features: ["Professional background", "Personal interests", "Values & approach"]
    },
    {
      title: "Skill Explorer",
      description: "Dive into my skills and see detailed examples of my work.",
      longDescription: "Browse through categorized skills with a hierarchical explorer. Filter by multiple skills and generate synthetic examples of how I would apply combinations of skills to new projects.",
      icon: <BrainCircuit className="h-10 w-10 text-violet-500" />,
      color: "from-violet-500 to-purple-600",
      link: "/skills",
      features: ["Hierarchical skill browser", "Detailed work examples", "AI-generated example projects"]
    },
    {
      title: "Work Experience",
      description: "Explore my professional journey in depth.",
      longDescription: "View my work history with detailed information about each role, responsibilities, and key achievements. Learn how my experience has shaped my professional capabilities.",
      icon: <Briefcase className="h-10 w-10 text-blue-500" />,
      color: "from-blue-500 to-cyan-600",
      link: "/experience",
      features: ["Timeline visualization", "Role details", "Achievement highlights"]
    },
    {
      title: "Personal Interests",
      description: "Discover what drives and inspires me outside of work.",
      longDescription: "Get to know me beyond my professional skills. Explore my personal interests, hobbies, and passions to see what makes me tick and where I find inspiration.",
      icon: <Heart className="h-10 w-10 text-rose-500" />,
      color: "from-rose-500 to-pink-600",
      link: "/interests",
      features: ["Interest categories", "Personal projects", "Inspiration sources"]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <Badge 
              className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white hover:from-primary hover:to-purple-600"
            >
              Interactive Dashboard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Welcome to {PORTFOLIO_OWNER.name}'s
              <span className="block bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Technical Profile
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-3">
              Explore my skills, experience, and interests through interactive applications
              designed to showcase what I can bring to your team.
            </p>
            <p className="text-lg text-muted-foreground mb-6 border-l-4 border-primary/30 pl-3 py-1 bg-primary/5 rounded-r-sm">
              <span className="font-semibold text-foreground">I blend systems thinking with technical versatility to solve infrastructure, automation, and integration challenges.</span>
            </p>
            <div className="flex items-center gap-3">
              <Link href="/skills">
                <Button className="gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Start Exploring
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" />
                  Chat With Me
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md aspect-square relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-4/5 h-4/5">
                <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <Code className="h-10 w-10 text-blue-500" />
                </div>
                <div className="absolute bottom-12 right-0 w-24 h-24 bg-purple-500/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <BrainCircuit className="h-12 w-12 text-purple-500" />
                </div>
                <div className="absolute bottom-0 left-12 w-16 h-16 bg-rose-500/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-rose-500" />
                </div>
                <div className="absolute top-10 right-8 w-14 h-14 bg-green-500/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-green-500" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-primary/10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <Globe className="h-14 w-14 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Translator Feature */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5 rounded-xl border border-primary/20 p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center mb-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Skill Translator
              </h2>
              <p className="text-lg text-muted-foreground">
                This tool <span className="font-semibold text-foreground">identifies which of my skills are relevant to your specific needs</span>. 
                Describe a workplace challenge, and see exactly how my relevant skills can be applied.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow space-y-2">
                <label htmlFor="scenario" className="text-sm font-medium">
                  Describe your technical challenge or project:
                </label>
                <textarea 
                  id="scenario" 
                  rows={2} 
                  placeholder="Describe a specific workplace challenge or technical problem you're trying to solve..."
                  className="w-full rounded-md border border-input bg-background/80 p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="md:flex-shrink-0 mt-2 md:mt-0 w-full md:w-auto">
                <Link href="/skills" className="w-full md:w-auto block">
                  <Button className="bg-gradient-to-r from-primary to-purple-600 w-full md:w-auto">
                    Match Skills to Your Need
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Share Your Scenario</h4>
                <p className="text-sm text-muted-foreground">Describe a workplace challenge or technical need you're facing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Skill Mapping</h4>
                <p className="text-sm text-muted-foreground">Identifies which of my documented skills are relevant to your situation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Relevant Experience Match</h4>
                <p className="text-sm text-muted-foreground">Explains exactly how each skill applies to your specific situation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical specialties */}
      <section className="mb-16">
        <div className="space-y-6">
          {/* Engineering background transition message */}
          <Card className="border-border/50 shadow-sm bg-gradient-to-r from-orange-500/5 to-amber-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">From Nuclear Engineering to IT Systems</h3>
                  <p className="text-muted-foreground">
                    My journey began as a nuclear operator on submarines and reactors, followed by process engineering experience. 
                    This foundation gave me a unique analytical approach to technical problems. The transition to IT was natural—both 
                    domains require system thinking, careful analysis, and precision. This background gives me a different perspective 
                    than pure computer science graduates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/50 shadow-sm bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Infrastructure & Automation Specialist</h3>
                    <p className="text-muted-foreground">
                      I have a comprehensive understanding of IT ecosystems—from computer architecture to infrastructure. 
                      I work at the intersection of traditional IT and modern DevOps, with expertise in how systems interact. 
                      These skills excel in Platform Engineering, Infrastructure Automation, and Technical Solutions Engineering.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Terminal className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Command Line & Scripting Expert</h3>
                    <p className="text-muted-foreground">
                      I have exceptional command line expertise and shell scripting abilities with advanced proficiency in terminal 
                      environments. This enables me to automate operations, manage systems, and solve complex problems through 
                      scripting instead of full application development. I create practical solutions that connect systems 
                      and streamline workflows.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <BarChart2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data Engineering Skills</h3>
                    <p className="text-muted-foreground">
                      My process engineering background evolved into strong data transformation skills. 
                      I excel at data analysis, ETL processes, and efficient workflows. I bridge the gap between 
                      raw data and actionable insights—extracting, transforming, and delivering information where it's needed.
                      I'm the data specialist who makes information usable and valuable across systems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main sections */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Explore Interactive Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden border-border hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="pb-2">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br border border-white/10 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm mb-4">
                    {section.longDescription}
                  </p>
                  <div className="space-y-2">
                    {section.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href={section.link}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${section.color} group-hover:shadow-md transition-all duration-300`}
                    >
                      Explore {section.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Other Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Other Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Search className="h-6 w-6 text-blue-500 mr-2" />
                <CardTitle>Interactive Search</CardTitle>
              </div>
              <CardDescription>Find exactly what you're looking for in my profile</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the powerful search functionality to quickly find specific skills, projects, or experiences.
                Filter results based on technologies, time periods, or specific requirements.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/search">
                <Button variant="outline" className="border-blue-500/20 hover:border-blue-500/50">
                  Search Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardHeader>
              <div className="flex items-center mb-2">
                <User className="h-6 w-6 text-green-500 mr-2" />
                <CardTitle>Career Match</CardTitle>
              </div>
              <CardDescription>See how my experience aligns with your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore detailed information about my professional experience and see how my 
                background aligns with the requirements of your team or project.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/experience">
                <Button variant="outline" className="border-green-500/20 hover:border-green-500/50">
                  View Experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Call to action */}
      <section>
        <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to learn more?</h3>
                <p className="text-muted-foreground max-w-xl">
                  Start exploring my interactive resume or reach out to discuss how I can contribute to your team.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/skills">
                  <Button size="lg" className="gap-2">
                    <BrainCircuit className="h-4 w-4" />
                    Start Exploring
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Me
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

export default Dashboard;