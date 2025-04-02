
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/dashboard',
    },
    {
      label: 'Add',
      icon: Plus,
      href: '/add-expense',
    },
    {
      label: 'Stats',
      icon: BarChart2,
      href: '/statistics',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              location.pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
