import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SkillExample, Skill } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Sparkles, Loader2 } from "lucide-react";

interface ExampleDetailProps {
  exampleId: number;
  onBack: () => void;
}

interface ExampleWithSkills extends SkillExample {
  skills: Skill[];
}

const ExampleDetail = ({ exampleId, onBack }: ExampleDetailProps) => {
  // Fetch example details including related skills
  const { data: example, isLoading } = useQuery<ExampleWithSkills>({
    queryKey: [`/api/skill-examples/${exampleId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/skill-examples/${exampleId}`);
      const data = await res.json();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!example) {
    return <div>Example not found</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="group hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-6">
        <Card className="overflow-hidden border-border">
          {example.image && (
            <div
              className="h-64 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${example.image})` }}
            ></div>
          )}

          <CardHeader className="pb-2 relative">
            {example.isSynthetic && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
            <CardTitle className="text-2xl">{example.title}</CardTitle>
            <CardDescription>{example.description}</CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {example.skills &&
                  example.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      {skill.name}
                    </Badge>
                  ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Details</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {example.details}
                </p>
              </div>
            </div>
          </CardContent>

          {example.link && (
            <CardFooter className="pt-2">
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() =>
                  example.link && window.open(example.link, "_blank")
                }
              >
                View Project
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ExampleDetail;
