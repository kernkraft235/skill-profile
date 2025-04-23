import React from "react";
import { AITooltip } from "@/components/ui/ai-tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TooltipDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Skill Tooltips</CardTitle>
        <CardDescription>
          Hover over technical terms to see AI-powered explanations
        </CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert">
        <p className="mb-4">
          My background in <AITooltip term="Nuclear Engineering" context="Professional background and educational context">nuclear engineering</AITooltip> provided 
          me with strong analytical skills and a foundation in complex systems. I've leveraged this expertise to transition into 
          <AITooltip term="IT infrastructure" context="Technical career transition context">IT infrastructure</AITooltip> roles, where I excel at systems integration.
        </p>
        
        <p className="mb-4">
          One of my key strengths is <AITooltip term="Automation" context="In the context of IT systems and workflow optimization">automation</AITooltip>, 
          particularly using <AITooltip term="PowerShell" context="Microsoft scripting language for system administration">PowerShell</AITooltip> and 
          <AITooltip term="Bash scripting" context="Unix-based command line scripting">Bash scripting</AITooltip> to streamline operations
          and reduce manual tasks.
        </p>
        
        <p className="mb-4">
          I've also developed expertise in <AITooltip term="Data engineering" context="In the context of collecting, transforming and storing data">data engineering</AITooltip>, 
          creating <AITooltip term="ETL pipelines" context="Extract, Transform, Load processes for data management">ETL pipelines</AITooltip> that connect different systems
          and enable better decision-making through integrated data flows.
        </p>
        
        <p>
          My approach combines my <AITooltip term="Process engineering" context="Engineering focused on designing and optimizing processes">process engineering</AITooltip> mindset
          with modern <AITooltip term="DevOps" context="Development and operations integration practices">DevOps</AITooltip> practices, allowing me to bridge the gap
          between technical implementation and business requirements.
        </p>
      </CardContent>
    </Card>
  );
}