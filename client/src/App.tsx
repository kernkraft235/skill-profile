import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Main components
import NavBar from "@/components/NavBar";

// Pages
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import ExperienceExplorer from "@/pages/ExperienceExplorer";
import InterestsExplorer from "@/pages/InterestsExplorer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/skills" component={Home} />
          <Route path="/experience" component={ExperienceExplorer} />
          <Route path="/interests" component={InterestsExplorer} />
          {/* Additional routes */}
          {/* <Route path="/chat" component={ChatBot} /> */}
          {/* <Route path="/contact" component={Contact} /> */}
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
