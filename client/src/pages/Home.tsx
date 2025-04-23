import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SkillCategory } from "@shared/schema";
import SkillExplorer from "@/components/SkillExplorer";
import SkillDetail from "@/components/SkillDetail";
import ExamplesList from "@/components/ExamplesList";
import ExampleDetail from "@/components/ExampleDetail";
import SidePanel from "@/components/SidePanel";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BrainCircuit } from "lucide-react";

// View states for the app
type ViewState = "categories" | "skills" | "examples" | "example-detail";

const Home = () => {
  const [viewState, setViewState] = useState<ViewState>("categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<number | null>(
    null,
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const { toast } = useToast();

  // Fetch root categories
  const {
    data: rootCategories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/skill-categories/root"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/skill-categories/root");
      const data = await res.json();
      return data as SkillCategory[];
    },
  });

  // Handle category selection
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setViewState("skills");
  };

  // Handle subcategory selection - remains in skills view but with new category
  const handleSubcategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    // Stays in skills view, just updates the selected category
  };

  // Handle skill selection
  const handleSkillSelect = (skillId: number) => {
    setSelectedSkillId(skillId);
    setViewState("examples");
  };

  // Handle example selection
  const handleExampleSelect = (exampleId: number) => {
    setSelectedExampleId(exampleId);
    setViewState("example-detail");
  };

  // Handle going back
  const handleBack = () => {
    if (viewState === "skills") {
      setSelectedCategoryId(null);
      setViewState("categories");
    } else if (viewState === "examples") {
      setSelectedSkillId(null);
      setViewState("skills");
    } else if (viewState === "example-detail") {
      setSelectedExampleId(null);
      setViewState("examples");
    }
  };

  // Handle filter toggle
  const handleFilterToggle = (skillId: number) => {
    setSelectedSkillIds((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  // Generate synthetic example
  const handleGenerateSynthetic = async (prompt: string) => {
    if (selectedSkillIds.length === 0) {
      toast({
        title: "No skills selected",
        description: "Please select at least one skill to generate an example.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Generating example",
        description: "Your custom example is being generated with AI...",
      });

      // Call the API to generate a synthetic example
      const res = await apiRequest("POST", "/api/skill-examples/synthetic", {
        prompt,
        relatedSkillIds: selectedSkillIds,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.message || "Failed to generate synthetic example",
        );
      }

      const data = await res.json();

      // Navigate to the generated example detail view
      if (data.example && data.example.id) {
        setSelectedExampleId(data.example.id);
        setViewState("example-detail");

        toast({
          title: "Example generated!",
          description: "Your custom example has been created successfully.",
          variant: "default",
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error generating synthetic example:", error);
      toast({
        title: "Generation failed",
        description:
          error.message ||
          "There was a problem generating your example. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Error Loading Skills</h1>
        <p className="text-muted-foreground">
          There was a problem loading the skill data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Skill Explorer</h1>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {viewState === "categories" && rootCategories && (
            <SkillExplorer
              categories={rootCategories}
              onCategorySelect={handleCategorySelect}
            />
          )}

          {viewState === "skills" && selectedCategoryId && (
            <SkillDetail
              categoryId={selectedCategoryId}
              onSkillSelect={handleSkillSelect}
              onBack={handleBack}
              onFilterToggle={handleFilterToggle}
              selectedSkillIds={selectedSkillIds}
            />
          )}

          {viewState === "examples" && selectedSkillId && (
            <ExamplesList
              skillId={selectedSkillId}
              onExampleSelect={handleExampleSelect}
              onBack={handleBack}
            />
          )}

          {viewState === "example-detail" && selectedExampleId && (
            <ExampleDetail exampleId={selectedExampleId} onBack={handleBack} />
          )}
        </main>

        {/* Side panel for filters and tools */}
        <SidePanel
          selectedSkillIds={selectedSkillIds}
          onFilterToggle={handleFilterToggle}
          onGenerateSynthetic={handleGenerateSynthetic}
        />
      </div>
    </div>
  );
};

export default Home;
