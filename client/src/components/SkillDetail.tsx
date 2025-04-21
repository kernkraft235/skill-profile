import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SkillCategory, Skill } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Star, Clock, ArrowRight, Loader2 } from "lucide-react";
import * as SiIcons from "react-icons/si";

interface SkillDetailProps {
  categoryId: number;
  onSkillSelect: (skillId: number) => void;
  onBack: () => void;
  onFilterToggle: (skillId: number) => void;
  selectedSkillIds: number[];
}

const SkillDetail = ({
  categoryId,
  onSkillSelect,
  onBack,
  onFilterToggle,
  selectedSkillIds,
}: SkillDetailProps) => {
  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [`/api/skill-categories/${categoryId}`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/skill-categories/${categoryId}`,
      );
      const data = await res.json();
      return data as SkillCategory;
    },
  });

  // Fetch skills in this category
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: [`/api/skills/category/${categoryId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/skills/category/${categoryId}`);
      const data = await res.json();
      return data as Skill[];
    },
  });

  // Fetch subcategories if any
  const { data: subcategories } = useQuery({
    queryKey: [`/api/skill-categories/parent/${categoryId}`],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/skill-categories/parent/${categoryId}`,
      );
      const data = await res.json();
      return data as SkillCategory[];
    },
  });

  const getSkillIcon = (iconName: string) => {
    // @ts-ignore - dynamic icon import
    const IconComponent = SiIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 text-primary" />;
    }
    return <Star className="h-6 w-6 text-primary" />;
  };

  const renderStars = (proficiency: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < proficiency ? "text-primary fill-primary" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    );
  };

  if (categoryLoading || skillsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return <div>Category not found</div>;
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
            {category.name} Skills
          </h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Subcategories if any */}
      {subcategories && subcategories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map((subcat) => (
              <Card
                key={subcat.id}
                className="cursor-pointer hover:border-primary/50 transition-all duration-300"
                onClick={() => onSkillSelect(subcat.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{subcat.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subcat.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Explore
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills &&
            skills.map((skill) => (
              <Card
                key={skill.id}
                className={`
                hover:border-primary/50 transition-all duration-300 
                ${selectedSkillIds.includes(skill.id) ? "border-primary bg-primary/5" : ""}
              `}
              >
                <CardHeader className="pb-2 flex flex-row items-start">
                  <div className="flex items-start flex-1 gap-3">
                    <div className="bg-muted p-2 rounded-md">
                      {getSkillIcon(skill.icon || "")}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(skill.proficiencyLevel)}
                        {skill.years && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {skill.years} {skill.years === 1 ? "year" : "years"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedSkillIds.includes(skill.id)}
                    onCheckedChange={() => onFilterToggle(skill.id)}
                    className="h-5 w-5 border-primary"
                  />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => onSkillSelect(skill.id)}
                  >
                    View Examples
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
