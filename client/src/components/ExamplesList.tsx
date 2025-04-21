import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SkillExample } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";

interface ExamplesListProps {
  skillId: number;
  onExampleSelect: (exampleId: number) => void;
  onBack: () => void;
}

const ExamplesList = ({
  skillId,
  onExampleSelect,
  onBack,
}: ExamplesListProps) => {
  // Fetch examples for the selected skill
  const { data: examples, isLoading } = useQuery({
    queryKey: [`/api/skill-examples/skill/${skillId}`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/skill-examples/skill/${skillId}`,
      );
      const data = await res.json();
      return data as SkillExample[];
    },
  });

  // Fetch skill details to show the skill name
  const { data: skill } = useQuery({
    queryKey: [`/api/skills/${skillId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/skills/${skillId}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="group hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {skill ? `${skill.name} Examples` : "Skill Examples"}
          </h1>
          <p className="text-muted-foreground">
            Browse examples demonstrating {skill?.name || "this skill"} in
            action
          </p>
        </div>
      </div>

      {examples && examples.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example) => (
            <Card
              key={example.id}
              className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 group"
            >
              {example.image && (
                <div
                  className="h-48 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${example.image})` }}
                />
              )}

              <CardHeader className="pb-2 relative">
                {example.isSynthetic && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {example.details}
                </p>
              </CardContent>

              <CardFooter className="pt-0 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExampleSelect(example.id)}
                  className="group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {example.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      example.link && window.open(example.link, "_blank")
                    }
                  >
                    Link
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg border border-border">
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No Examples Found</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            There are no examples available for this skill yet. You can create a
            synthetic example with AI.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExamplesList;
