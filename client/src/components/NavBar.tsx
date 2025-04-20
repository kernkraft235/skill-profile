import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { BrainCircuit, Briefcase, Heart, User } from 'lucide-react';

const NavBar = () => {
  const [location] = useLocation();

  const navItems = [
    { 
      href: '/about', 
      label: 'About Me', 
      icon: <User className="h-5 w-5" />,
      active: location.startsWith('/about')
    },
    { 
      href: '/skills', 
      label: 'Skill Explorer', 
      icon: <BrainCircuit className="h-5 w-5" />,
      active: location === '/skills' || location.startsWith('/skills')
    },
    { 
      href: '/experience', 
      label: 'Work Experience', 
      icon: <Briefcase className="h-5 w-5" />,
      active: location.startsWith('/experience')
    },
    { 
      href: '/interests', 
      label: 'Personal Interests', 
      icon: <Heart className="h-5 w-5" />,
      active: location.startsWith('/interests')
    }
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <div className="mr-6 flex items-center space-x-2">
              <Link href="/">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Portfolio</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-1 text-sm transition-colors hover:text-primary",
                    item.active ? "text-primary" : "text-muted-foreground",
                  )}>
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center justify-between md:hidden w-full">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Portfolio</span>
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent",
                    item.active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}>
                    {item.icon}
                    <span className="sr-only">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;