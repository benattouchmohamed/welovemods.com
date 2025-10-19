import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
      <div className="text-center max-w-md mx-auto px-4 animate-fade-in-up">
        <div className="mb-8 animate-float">
          <AlertTriangle className="mx-auto w-24 h-24 text-gaming-primary animate-pulse" />
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-gaming-gradient animate-pulse-slow">
          404
        </h1>
        
        <h2 className="mb-4 text-2xl font-semibold text-foreground animate-fade-in-delay">
          Oops! Page not found
        </h2>
        
        <p className="mb-8 text-lg text-foreground/70 leading-relaxed animate-stagger-1">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to exploring amazing games!
        </p>
        
        <Link to="/">
          <Button className="btn-gaming hover-scale inline-flex items-center animate-stagger-2">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        
      </div>
    </div>
  );
};

export default NotFound;
