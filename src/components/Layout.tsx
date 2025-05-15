
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Home, MessageSquare, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: ReactNode;
  minimal?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, minimal = false }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isChat = location.pathname === '/chat';

  // Determine if we should show the footer
  const showFooter = !(isMobile && isChat);

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark bg-black text-white' : 'light bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${minimal ? 'py-4' : 'py-6'} px-4 border-b transition-all ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" />
            {/* Use conditional text color for better visibility in light mode */}
            <span className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Neura</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm ${location.pathname === '/' ? 'font-medium' : 'text-opacity-80'} transition-colors hover:text-opacity-100`}>Home</Link>
            <Link to="/chat" className={`text-sm ${location.pathname === '/chat' ? 'font-medium' : 'text-opacity-80'} transition-colors hover:text-opacity-100`}>Chat</Link>
            <Link to="/customize" className={`text-sm ${location.pathname === '/customize' ? 'font-medium' : 'text-opacity-80'} transition-colors hover:text-opacity-100`}>Customize</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer (hidden in mobile chat view) */}
      {showFooter && (
        <footer className="py-6 px-4 border-t mt-auto">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Logo size="sm" />
                {/* Only show text on md+ screens */}
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  &copy; {new Date().getFullYear()} Neura AI
                </span>
              </div>
              
              <div className="flex gap-6 text-sm justify-center">
                <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                <Link to="/terms" className="hover:underline">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Navigation Bar at bottom */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center p-2 z-50">
          <Link 
            to="/" 
            className={`flex flex-col items-center p-2 rounded ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link 
            to="/chat" 
            className={`flex flex-col items-center p-2 rounded ${location.pathname === '/chat' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <MessageSquare size={20} />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          <Link 
            to="/customize" 
            className={`flex flex-col items-center p-2 rounded ${location.pathname === '/customize' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Customize</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
