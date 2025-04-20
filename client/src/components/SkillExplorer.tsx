import { useState } from 'react';
import { SkillCategory } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Paintbrush, BarChart } from 'lucide-react';

interface SkillExplorerProps {
  categories: SkillCategory[];
  onCategorySelect: (categoryId: number) => void;
}

const SkillExplorer = ({ categories, onCategorySelect }: SkillExplorerProps) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="h-10 w-10 text-primary" />;
      case 'Paintbrush':
        return <Paintbrush className="h-10 w-10 text-primary" />;
      case 'BarChart':
        return <BarChart className="h-10 w-10 text-primary" />;
      default:
        return <Code className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Skill Explorer</h1>
        <p className="text-muted-foreground">
          Browse through my diverse set of skills and discover detailed examples of my work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 group">
            <CardHeader className="p-4 md:p-6 pb-2 md:pb-3 bg-gradient-to-br from-background/20 to-background flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                {getCategoryIcon(category.icon || 'Code')}
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl">{category.name}</CardTitle>
                <CardDescription className="line-clamp-1">{category.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-3 md:pt-4">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {category.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 md:p-6 pt-0 flex justify-end">
              <Button 
                variant="ghost" 
                className="group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300"
                onClick={() => onCategorySelect(category.id)}
              >
                Explore Skills
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillExplorer;