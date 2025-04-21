import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
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
  Mail,
} from "lucide-react";
import { PORTFOLIO_OWNER, TECHNOLOGIES, HIGHLIGHTS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutMe = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "background" | "values"
  >("overview");

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
                    <AvatarImage
                      src={PORTFOLIO_OWNER.photo}
                      alt={PORTFOLIO_OWNER.name}
                    />
                    <AvatarFallback>
                      {PORTFOLIO_OWNER.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mt-4">
                    {PORTFOLIO_OWNER.name}
                  </h2>
                  <p className="text-muted-foreground">
                    Tech Enthusiast, Integrator, and Automator
                  </p>

                  <div className="flex gap-3 mt-4">
                    <a
                      href={PORTFOLIO_OWNER.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="icon" variant="outline">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                    <a
                      href={PORTFOLIO_OWNER.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                        <span className="text-sm text-muted-foreground">
                          Name
                        </span>
                      </div>
                      <span>{PORTFOLIO_OWNER.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Email
                        </span>
                      </div>
                      <span className="text-sm">{PORTFOLIO_OWNER.email}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Experience
                        </span>
                      </div>
                      <span>{PORTFOLIO_OWNER.yearsExperience}+ Years</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <Link href="/contact">
                    <Button className="w-full">Contact Me</Button>
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
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "overview"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("background")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "background"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Background
              </button>
              <button
                onClick={() => setActiveTab("values")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "values"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Values & Approach
              </button>
            </div>

            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Hello, I'm {PORTFOLIO_OWNER.name}!
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    I’m a self-driven technologist with deep curiosity and a
                    bias for building. My background blends hands-on system
                    design with a strong interest in software development,
                    automation, and digital innovation. I specialize in crafting
                    interactive applications and prototyping solutions that
                    solve real problems.
                  </p>
                  <p className="text-muted-foreground">
                    This interactive resumé is built to reflect how I think,
                    what I build, and how I approach complexity. Explore the
                    sections to see how my experience and mindset can add value
                    to your team or initiative.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {HIGHLIGHTS.map((highlight, index) => (
                      <Card key={index} className="border-border/50">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-medium mb-2">
                            {highlight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {highlight.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Technologies I Work With
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECHNOLOGIES.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "background" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">My Background</h2>
                  <p className="text-muted-foreground mb-4">
                    My journey in technology has been shaped by deep curiosity,
                    systems thinking, and hands-on problem solving. I’ve built
                    my skill set through a combination of intensive technical
                    training, real-world implementation, and continuous
                    self-guided learning.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    I approach technology as a craft: not just coding, but
                    solving systemic problems, streamlining workflows, and
                    modernizing infrastructure. Most of my learning happens
                    outside traditional paths—through experimentation, deep
                    dives, and real-world application across both personal and
                    enterprise environments.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Learning Journey
                  </h3>
                  <div className="space-y-6">
                    <div className="relative pl-8 border-l border-muted pb-6">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">
                        Systems & Workflow Foundations
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learned by dissecting complex systems—both physical
                        (Naval Nuclear Power) and digital (enterprise software
                        stacks). Applied structured problem-solving under
                        operational pressure before pivoting into modern
                        software and automation tooling.
                      </p>
                    </div>

                    <div className="relative pl-8 border-l border-muted pb-6">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">
                        Front-end & UX Design
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Built dashboards, internal tools, and data
                        visualizations with an emphasis on clarity, efficiency,
                        and responsiveness. Comfortable with React and UI
                        libraries but focus is on usability and function, not
                        trend-chasing.
                      </p>
                    </div>

                    <div className="relative pl-8 border-l border-muted pb-6">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">
                        Back-end & Automation
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Develop full-stack tools using Python, Node.js, and
                        shell scripting—especially for process automation,
                        systems integration, and data pipeline cleanup.
                        Prioritize reliability and self-healing workflows over
                        flash.
                      </p>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                      <h4 className="text-lg font-medium">
                        Continuous Modernization & Problem-Solving
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Always leveling up—through obscure documentation, GitHub
                        rabbit holes, and unconventional problem-solving.
                        Projects often involve stitching together legacy
                        systems, modern APIs, and private infrastructure to
                        achieve results corporate IT can’t (or won’t) deliver.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "values" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    My Values & Approach
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    I believe technology is a force multiplier—its purpose is to
                    reduce friction, eliminate waste, and empower people to do
                    more with less. My approach is grounded in pragmatism,
                    clarity, and autonomy, shaped by real-world constraints and
                    a refusal to tolerate inefficiency.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Code className="h-4 w-4 text-blue-500" />
                        </div>
                        Systems over Scripts
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Code is just a tool. I focus on designing systems that
                        are modular, observable, and resilient—even if that
                        means fewer lines of code. Tools should enable change,
                        not become another problem to manage.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-500" />
                        </div>
                        Operational Empathy
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        I build with the end user, maintainer, and stakeholder
                        in mind. Interfaces should feel obvious. Workflows
                        should reflect reality. Good design means understanding
                        the full lifecycle of a tool—from deployment to
                        debugging.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-500" />
                        </div>
                        Relentless Improvement
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        My learning doesn’t pause. I stay sharp by
                        reverse-engineering what works, stress-testing what
                        doesn’t, and hunting for better patterns across
                        disciplines. If something feels inefficient, I assume it
                        can be fixed.
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
                        I’m wired to solve problems. I’ve got a warped sense of
                        fun—debugging flaky systems, closing feedback loops,
                        untangling janky workflows. It's not about obligation; I
                        genuinely enjoy chasing better solutions and stitching
                        things together until they click.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    My Development Process
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">
                          Context & Constraints
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          I zoom out to understand the system—what’s broken,
                          who’s involved, where the constraints are, and what
                          outcomes actually matter. Most solutions fail because
                          the problem wasn’t correctly scoped.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Leverage Points</h4>
                        <p className="text-sm text-muted-foreground">
                          I look for failure points, time sinks, or manual glue
                          that’s holding everything together. I focus where a
                          small fix or integration unlocks the most value.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">
                          Prototype Fast, Solve Precisely
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          I work iteratively. Quick wins, minimal risk. Duct
                          tape the flow first, then solidify what works.
                          Functional beats theoretical.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">4</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">
                          Stabilize & Modularize
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Once a solution holds up, I make it clean, modular,
                          and connectable. I don’t chase perfection—just
                          clarity, reliability, and alignment with adjacent
                          systems.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <span className="font-medium">5</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">
                          Track the Friction
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          I keep an eye on usage patterns, weird edge cases, and
                          where humans still struggle. That’s where the next
                          iteration starts.
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
                  Explore my skills, projects, and experience through the
                  interactive sections of this resume.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/skills">
                  <Button className="bg-gradient-to-r from-primary to-purple-600">
                    Explore My Skills
                  </Button>
                </Link>
                <Link href="/experience">
                  <Button variant="outline">View My Experience</Button>
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
