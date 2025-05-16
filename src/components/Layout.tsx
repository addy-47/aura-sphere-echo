
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
              <Logo size="md" withText={false} />
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
            {/* Mobile menu - improved */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] pt-10">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="flex items-center justify-center mb-8">
                      <Logo size="md" withText={true} />
                    </div>
                    <Link 
                      to="/" 
                      className={`flex justify-center items-center gap-2 px-2 py-3 rounded-md text-lg 
                        ${location.pathname === '/' ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/chat" 
                      className={`flex justify-center items-center gap-2 px-2 py-3 rounded-md text-lg 
                        ${location.pathname === '/chat' ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      Chat
                    </Link>
                    <Link 
                      to="/customize" 
                      className={`flex justify-center items-center gap-2 px-2 py-3 rounded-md text-lg 
                        ${location.pathname === '/customize' ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      Customize
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className={`flex justify-center items-center gap-2 px-2 py-3 rounded-md text-lg 
                        ${location.pathname === '/dashboard' ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      Dashboard
                    </Link>
                    
                    <div className="mt-auto pt-6 border-t border-border flex justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleTheme} 
                        className="rounded-full"
                      >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
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

      {/* Footer - centered alignment */}
      <footer className="py-6 px-4 border-t mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Logo size="sm" withText={false} />
            </div>
            
            <div className="flex gap-6 text-sm justify-center">
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
            </div>
            
            <div className="text-sm text-muted-foreground mt-1">
              © 2025 Neura AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
