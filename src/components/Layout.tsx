
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Settings, MessageCircle, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { moodColor } = useMood();
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
    { path: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
    { path: '/customize', icon: <Settings className="h-5 w-5" />, label: 'Customize' },
    { path: '/dashboard', icon: <User className="h-5 w-5" />, label: 'Dashboard' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: moodColor }}></div>
            <span className="font-bold text-xl">Neura AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-2 flex justify-around">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-md ${
                location.pathname === item.path 
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground md:mb-0 mb-16">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Neura AI. Your digital doppelganger.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
