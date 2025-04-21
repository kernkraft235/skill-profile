import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Redirect } from "wouter";
import { Loader2, ShieldAlert } from "lucide-react";

const AuthPage = () => {
  const { user, loginMutation } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/admin" />;
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column with login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <ShieldAlert className="h-10 w-10 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Sign in with administrator credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input 
                  id="login-username" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input 
                  id="login-password" 
                  type="password" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center text-muted-foreground">
            <p className="w-full">
              This area is restricted to administrators only
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right column with information */}
      <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-950 text-white p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>
          <p className="text-slate-300 mb-4">
            This authentication-protected area allows you to manage content on the portfolio site.
          </p>
          <ul className="space-y-2 text-slate-300 mb-8">
            <li className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
              Create and manage skills
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
              Organize skill categories
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
              Update profile information
            </li>
          </ul>
          <p className="text-sm text-slate-400">
            For security reasons, this area is password protected. Please login with your administrator credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;