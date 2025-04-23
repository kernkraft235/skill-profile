import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle, Loader2 } from "lucide-react";
import { useAIExplanation } from "@/hooks/use-ai-explanation";

interface AITooltipProps {
  /**
   * The term or concept that needs explanation
   */
  term: string;
  
  /**
   * Optional context to help the AI generate better explanations
   */
  context?: string;
  
  /**
   * Children to wrap with the tooltip
   */
  children: React.ReactNode;
  
  /**
   * Whether to show a help icon beside the children
   */
  showHelpIcon?: boolean;
  
  /**
   * Optional CSS class name for the trigger
   */
  className?: string;
}

/**
 * A tooltip component that provides AI-generated explanations for technical terms
 */
export function AITooltip({
  term,
  context,
  children,
  showHelpIcon = true,
  className,
}: AITooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { explanation, isLoading, error, fetchExplanation } = useAIExplanation();
  
  // Only fetch explanation when tooltip is opened
  const handleTooltipOpen = () => {
    setIsOpen(true);
    if (!explanation && !isLoading && !error) {
      fetchExplanation(term, context);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild onClick={handleTooltipOpen}>
          <div className={`inline-flex items-center gap-1 cursor-help ${className}`}>
            {children}
            {showHelpIcon && (
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-4 text-sm" side="bottom">
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Generating explanation...</span>
            </div>
          ) : error ? (
            <div className="text-destructive">
              <p>Unable to generate explanation.</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchExplanation(term, context)}
                className="mt-2"
              >
                Try again
              </Button>
            </div>
          ) : explanation ? (
            <div>
              <h4 className="font-medium mb-1">{term}</h4>
              <p>{explanation}</p>
            </div>
          ) : (
            <div>
              <h4 className="font-medium mb-1">{term}</h4>
              <p>Preparing explanation...</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}