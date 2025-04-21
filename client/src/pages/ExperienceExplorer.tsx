import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { EXPERIENCES } from "@/lib/constants";
import { Experience } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Star,
} from "lucide-react";
import { formatDate, getYearFromNow } from "@/lib/utils";

type ViewState = "list" | "detail";

const ExperienceExplorer = () => {
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    number | null
  >(null);

  // Use the experience data from constants
  const [experiences, setExperiences] = useState(EXPERIENCES);
  const isLoading = false;

  // Handle experience selection
  const handleExperienceSelect = (experienceId: number) => {
    setSelectedExperienceId(experienceId);
    setViewState("detail");
  };

  // Handle going back to list view
  const handleBack = () => {
    setSelectedExperienceId(null);
    setViewState("list");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedExperience = experiences?.find(
    (exp) => exp.id === selectedExperienceId,
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {viewState === "list" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Work Experience
            </h1>
            <p className="text-muted-foreground">
              Explore my professional journey and dive into the details of my
              work experience.
            </p>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.map((experience) => (
                <Card
                  key={experience.id}
                  className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleExperienceSelect(experience.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {experience.role}
                        </CardTitle>
                        <CardDescription>{experience.company}</CardDescription>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {experience.period}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {experience.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto group-hover:text-primary group-hover:bg-primary/10"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Experience Data</h3>
              <p className="text-muted-foreground mt-2">
                Work experience information is not available.
              </p>
            </div>
          )}
        </div>
      )}

      {viewState === "detail" && selectedExperience && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="group hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">
                      {selectedExperience.role}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {selectedExperience.company}
                    </CardDescription>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {selectedExperience.period}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p>{selectedExperience.description}</p>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Key Achievements</h3>
                    <ul className="space-y-2">
                      {selectedExperience.achievements.map(
                        (achievement, index) => (
                          <li key={index} className="flex">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{achievement}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Industry</h4>
                    <p className="text-sm text-muted-foreground">Technology</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">Remote</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Company Size</h4>
                    <p className="text-sm text-muted-foreground">
                      50-200 employees
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      JavaScript
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      React
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      TypeScript
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Node.js
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      Project Management
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceExplorer;
