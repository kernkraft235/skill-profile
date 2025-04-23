import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Main components
import NavBar from "@/components/NavBar";

// Pages
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import AboutMe from "@/pages/AboutMe";
import ExperienceExplorer from "@/pages/ExperienceExplorer";
import InterestsExplorer from "@/pages/InterestsExplorer";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/auth-page";
import TooltipsDemo from "@/pages/TooltipsDemo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/about" component={AboutMe} />
          <Route path="/skills" component={Home} />
          <Route path="/experience" component={ExperienceExplorer} />
          <Route path="/interests" component={InterestsExplorer} />
          {/* Auth route */}
          <Route path="/auth" component={AuthPage} />
          {/* Protected Admin route */}
          <ProtectedRoute path="/admin" component={Admin} />
          {/* Additional routes */}
          <Route path="/tooltips" component={TooltipsDemo} />
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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
