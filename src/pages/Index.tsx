
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  // Auto-redirect to dashboard after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="text-center animate-fade-in max-w-md">
        <div className="mb-6 text-6xl">💰</div>
        <h1 className="text-4xl font-bold mb-4 text-primary">PocketWise</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Track your expenses, manage your budget, take control of your finances
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/dashboard')}
          className="group"
        >
          Get Started 
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
