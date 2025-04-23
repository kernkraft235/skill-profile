import React from "react";
import { TooltipDemo } from "@/components/ui/tooltip-demo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TooltipsDemo() {
  return (
    <div className="container py-6 md:py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">AI-Powered Contextual Help</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        This feature provides contextual explanations for technical terms using AI. Hover over
        highlighted terms to see AI-generated explanations tailored to the specific context.
      </p>
      
      <TooltipDemo />
      
      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">For Visitors</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hover over any highlighted technical term to see an explanation</li>
              <li>Explanations are tailored to the profile context</li>
              <li>Helps bridge knowledge gaps for non-technical visitors</li>
              <li>Makes technical terms more accessible and understandable</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Technical Implementation</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI-powered backend generates contextual explanations</li>
              <li>Definitions are created on-demand when a term is first hovered</li>
              <li>Context-aware explanations incorporate profile information</li>
              <li>Tooltips follow accessibility best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}