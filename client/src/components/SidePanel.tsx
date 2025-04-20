import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Skill } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { X, Filter, Sparkles, Search, Loader2 } from 'lucide-react';
import * as SiIcons from 'react-icons/si';

interface SidePanelProps {
  selectedSkillIds: number[];
  onFilterToggle: (skillId: number) => void;
  onGenerateSynthetic: (prompt: string) => void;
}

const SidePanel = ({ 
  selectedSkillIds, 
  onFilterToggle,
  onGenerateSynthetic
}: SidePanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Fetch skills data for the selected skill IDs
  const { data: selectedSkills, isLoading } = useQuery({
    queryKey: ['selected-skills', selectedSkillIds],
    queryFn: async () => {
      if (selectedSkillIds.length === 0) return [];
      
      // Get skills one by one (ideally we'd have a batch endpoint)
      const skills = await Promise.all(
        selectedSkillIds.map(async (id) => {
          const res = await apiRequest('GET', `/api/skills/${id}`);
          return res.json();
        })
      );
      
      return skills as Skill[];
    },
    enabled: selectedSkillIds.length > 0,
    initialData: []
  });
  
  const handleGenerateClick = () => {
    setIsGenerating(true);
    onGenerateSynthetic(prompt);
    // In a real implementation, we'd want to reset this after the generation is complete
    setTimeout(() => setIsGenerating(false), 3000);
  };
  
  const getSkillIcon = (iconName: string) => {
    // @ts-ignore - dynamic icon import
    const IconComponent = SiIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4 text-primary" />;
    }
    return <div className="h-4 w-4 rounded-full bg-primary/20"></div>;
  };
  
  return (
    <div className="w-80 border-l border-border overflow-auto p-4 space-y-6">
      <div>
        <h3 className="font-semibold flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Selected Skills
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {selectedSkillIds.length === 0 
            ? "Select skills to filter examples or generate custom examples." 
            : `${selectedSkillIds.length} skill${selectedSkillIds.length > 1 ? 's' : ''} selected`}
        </p>
        
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : selectedSkills.length > 0 ? (
            selectedSkills.map((skill) => (
              <div 
                key={skill.id} 
                className="flex items-center justify-between group bg-muted/50 rounded-md p-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  {getSkillIcon(skill.icon || '')}
                  <span>{skill.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onFilterToggle(skill.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-muted-foreground py-4">
              No skills selected
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-semibold flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
          Generate Example
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Create a synthetic example showcasing your selected skills
        </p>
        
        <div className="space-y-3">
          <Textarea
            placeholder="Describe what kind of example you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-none h-24"
            disabled={selectedSkillIds.length === 0 || isGenerating}
          />
          
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={!prompt || selectedSkillIds.length === 0 || isGenerating}
            onClick={handleGenerateClick}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Example
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-semibold flex items-center">
          <Search className="h-4 w-4 mr-2" />
          Quick Search
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          Find examples by keyword
        </p>
        
        <Button variant="outline" className="w-full text-muted-foreground" disabled>
          <Search className="h-4 w-4 mr-2" />
          Search examples...
        </Button>
      </div>
    </div>
  );
};

export default SidePanel;