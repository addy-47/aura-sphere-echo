
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
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
            <Logo size={32} />
            <span className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Neura</span>
          </Link>

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
                <Logo size={24} />
                <span className="text-sm font-medium">Neura</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                <Link to="/terms" className="hover:underline">Terms of Service</Link>
              </div>
              
              <div className="text-xs opacity-70">
                &copy; {new Date().getFullYear()} Neura AI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
