import { motion } from "framer-motion";
import { User, Mail, Github, Linkedin, BookOpen, Globe, Award, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PORTFOLIO_OWNER, HIGHLIGHTS, CERTIFICATIONS } from "../lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AboutMe = () => {
  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          About Me
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get to know me better - my background, interests, values, and what drives me as a professional.
        </p>
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Personal info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-500/20"></div>
            <div className="flex justify-center -mt-16">
              <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden">
                <img
                  src={PORTFOLIO_OWNER.photo}
                  alt={PORTFOLIO_OWNER.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <CardHeader className="text-center pt-2">
              <CardTitle className="text-2xl">{PORTFOLIO_OWNER.name}</CardTitle>
              <CardDescription>{PORTFOLIO_OWNER.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{PORTFOLIO_OWNER.yearsExperience}+ years of experience</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${PORTFOLIO_OWNER.email}`} className="hover:text-primary transition-colors">
                    {PORTFOLIO_OWNER.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={PORTFOLIO_OWNER.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    GitHub Profile
                  </a>
                </div>
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={PORTFOLIO_OWNER.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <h4 className="font-medium">{cert.name}</h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>{cert.issuer}</span>
                      <span>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                My Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="professional">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="values">Values & Approach</TabsTrigger>
                </TabsList>
                
                <TabsContent value="professional" className="space-y-4">
                  <p>
                    I'm a passionate full-stack developer with over {PORTFOLIO_OWNER.yearsExperience} years of experience building web and mobile applications. 
                    My journey began with a strong curiosity about how things work, which eventually led me to programming.
                  </p>
                  <p>
                    Throughout my career, I've had the opportunity to work with diverse teams on challenging projects across various industries. 
                    I specialize in JavaScript/TypeScript ecosystems, with particular expertise in React and Node.js. 
                    What excites me most is solving complex problems and creating intuitive user experiences.
                  </p>
                  <p>
                    I'm constantly learning and adapting to new technologies, believing that staying current is essential in our rapidly evolving field. 
                    I enjoy mentoring junior developers and sharing knowledge with the community through contributions to open-source projects.
                  </p>
                </TabsContent>
                
                <TabsContent value="personal" className="space-y-4">
                  <p>
                    Beyond coding, I'm an avid hiker and nature enthusiast who finds inspiration in the outdoors. 
                    On weekends, you might find me on a trail, experimenting with photography, or diving into a good book.
                  </p>
                  <p>
                    I'm passionate about continuous learning, not just in technology but across diverse subjects. 
                    I enjoy attending local tech meetups and conferences, where I can connect with like-minded professionals and expand my knowledge.
                  </p>
                  <p>
                    I believe in work-life balance and maintaining creative pursuits outside of my professional work. 
                    These diverse interests help me approach problem-solving from unique perspectives and keep my thinking fresh.
                  </p>
                </TabsContent>
                
                <TabsContent value="values" className="space-y-4">
                  <p>
                    I approach development with a focus on creating sustainable, maintainable solutions rather than quick fixes. 
                    I value clean code, thorough testing, and thoughtful documentation to ensure that what I build can be extended and maintained by others.
                  </p>
                  <p>
                    Collaboration is central to my work philosophy. I believe the best products emerge from diverse teams where everyone feels empowered to contribute ideas. 
                    I strive to be an effective communicator, translating technical concepts for non-technical stakeholders and ensuring everyone is aligned.
                  </p>
                  <p>
                    I'm driven by impact - creating software that genuinely improves experiences for users and adds value to businesses. 
                    I consider not just the technical implementation but the broader context of how a solution will be used and what problems it solves.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {HIGHLIGHTS.map((highlight, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <h3 className="font-medium mb-2">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What type of projects do you enjoy working on the most?</AccordionTrigger>
                  <AccordionContent>
                    I'm most passionate about projects that solve real user problems and offer opportunities to work with modern technologies. 
                    I particularly enjoy building interactive web applications with rich user experiences, especially when they involve interesting technical challenges 
                    or require creative solutions. Projects with a positive social impact or that help people in their daily lives are especially rewarding.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do you approach learning new technologies?</AccordionTrigger>
                  <AccordionContent>
                    I follow a hands-on approach to learning new technologies. After researching the fundamentals, I immediately start building small projects 
                    to apply what I've learned. I find that practical application helps solidify concepts better than just reading documentation. 
                    I also engage with the community through forums, Discord channels, and local meetups to learn best practices and stay updated on developments.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do you handle tight deadlines and pressure?</AccordionTrigger>
                  <AccordionContent>
                    I approach tight deadlines with a combination of prioritization, communication, and focus. First, I break down the work into must-haves and 
                    nice-to-haves, ensuring critical functionality is delivered first. I maintain clear communication with team members and stakeholders about progress 
                    and potential challenges. When working under pressure, I minimize distractions and focus on consistently moving forward, taking short breaks 
                    to maintain productivity rather than burning out.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What do you look for in a team or company culture?</AccordionTrigger>
                  <AccordionContent>
                    I thrive in environments that value collaboration, continuous learning, and work-life balance. I look for teams where members support each other, 
                    share knowledge openly, and feel comfortable both giving and receiving constructive feedback. I appreciate companies that provide opportunities for 
                    professional growth and encourage innovation. A culture that celebrates diversity of thought and approaches problems with curiosity rather than rigid 
                    processes helps bring out my best work.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do you stay current with rapidly evolving technologies?</AccordionTrigger>
                  <AccordionContent>
                    I maintain a structured approach to staying current, dedicating time each week to learning. I follow industry blogs, newsletters, and podcasts to 
                    keep up with trends. I participate in online communities and follow thought leaders on platforms like Twitter. I regularly experiment with new tools 
                    and frameworks through small side projects. Additionally, I attend virtual conferences and workshops when possible. Perhaps most importantly, 
                    I focus on mastering fundamentals and concepts that transfer across technologies rather than chasing every new framework.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;