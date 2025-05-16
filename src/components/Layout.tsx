
import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import UserMenu from './UserMenu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface LayoutProps {
  children: ReactNode;
  minimal?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, minimal = false }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Swipe threshold in pixels
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      const routes = ['/', '/chat', '/customize', '/dashboard'];
      const currentIndex = routes.indexOf(location.pathname);
      
      if (isLeftSwipe && currentIndex < routes.length - 1) {
        // Navigate to the next route
        navigate(routes[currentIndex + 1]);
      } 
      else if (isRightSwipe && currentIndex > 0) {
        // Navigate to the previous route
        navigate(routes[currentIndex - 1]);
      }
      
      // Reset values
      setTouchStart(null);
      setTouchEnd(null);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, location.pathname, navigate]);

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark bg-black text-white' : 'light bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${minimal ? 'py-4' : 'py-6'} px-4 border-b transition-all ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <Logo size="md" withText={true} />
            </Link>
          </div>

          {/* Desktop navigation - centered */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8 mx-auto">
              <Link 
                to="/" 
                className={`text-sm font-medium ${location.pathname === '/' ? 'text-primary' : 'text-opacity-80'} transition-colors hover:text-opacity-100`}
              >
                Home
              </Link>
              <Link 
                to="/chat" 
                className={`text-sm font-medium ${location.pathname === '/chat' ? 'text-primary' : 'text-opacity-80'} transition-colors hover:text-opacity-100`}
              >
                Chat
              </Link>
              <Link 
                to="/customize" 
                className={`text-sm font-medium ${location.pathname === '/customize' ? 'text-primary' : 'text-opacity-80'} transition-colors hover:text-opacity-100`}
              >
                Customize
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            {/* Mobile menu - enhanced */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden flex gap-2 items-center">
                    <Menu className="h-5 w-5" />
                    <span>Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] pt-10">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="flex items-center justify-center mb-8">
                      <Logo size="md" withText={true} />
                    </div>
                    <div className="space-y-1">
                      <Link 
                        to="/" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors
                          ${location.pathname === '/' 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary/10'}`}
                      >
                        Home
                      </Link>
                      <Link 
                        to="/chat" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors
                          ${location.pathname === '/chat' 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary/10'}`}
                      >
                        Chat
                      </Link>
                      <Link 
                        to="/customize" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors
                          ${location.pathname === '/customize' 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary/10'}`}
                      >
                        Customize
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors
                          ${location.pathname === '/dashboard' 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary/10'}`}
                      >
                        Dashboard
                      </Link>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-border">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={toggleTheme} 
                        className="w-full justify-start rounded-md px-4 py-3 text-base"
                      >
                        {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
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

      {/* Footer - updated layout */}
      <footer className="py-6 px-4 border-t mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center mb-4 sm:mb-0">
              <Logo size="sm" withText={true} />
            </div>
            
            {/* Links centered */}
            <div className="flex gap-6 text-sm justify-center mx-auto">
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
            </div>
            
            {/* Copyright on the right */}
            <div className="text-sm text-muted-foreground mt-4 sm:mt-0">
              © 2025 Neura AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
