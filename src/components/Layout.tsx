
import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import UserMenu from './UserMenu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger 
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  minimal?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, minimal = false, hideFooter = false }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
      
      // Updated routes array - removed '/customize'
      const routes = ['/', '/chat', '/dashboard'];
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Custom navigation link component
  const NavLink = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    );
  });
  NavLink.displayName = "NavLink";

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark bg-black text-white' : 'light bg-white text-gray-900'}`}>
      {/* Header - Improved for mobile */}
      <header className={`${minimal ? 'py-3' : 'py-4'} px-4 border-b sticky top-0 z-40 bg-background/80 backdrop-blur-lg transition-all ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <Logo size={isMobile ? "sm" : "md"} withText={true} />
            </Link>
          </div>

          {/* Desktop navigation - removed Customize menu item */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex mx-auto">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink
                      className={cn(
                        "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname === "/" 
                          ? "bg-accent text-accent-foreground" 
                          : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/chat">
                    <NavigationMenuLink
                      className={cn(
                        "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname === "/chat" 
                          ? "bg-accent text-accent-foreground" 
                          : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      Chat
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink
                      className={cn(
                        "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        location.pathname === "/dashboard" 
                          ? "bg-accent text-accent-foreground" 
                          : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-2">
            {/* Mobile menu - removed Customize menu item */}
            {isMobile ? (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="md:hidden rounded-full"
                    aria-label="Menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] pt-10">
                  <div className="flex flex-col gap-6 mt-6">
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
                        to="/dashboard" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors
                          ${location.pathname === '/dashboard' 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary/10'}`}
                      >
                        Dashboard
                      </Link>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={toggleTheme} 
                        className="w-full justify-start rounded-md px-4 py-3 text-base"
                      >
                        {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </Button>
                      
                      <div className="mt-4">
                        <UserMenu showInMobileMenu={true} />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - improved responsive layout */}
      {!hideFooter && (
        <footer className="py-6 px-4 border-t mt-auto">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
              {/* Logo on the left */}
              <div className="flex items-center">
                <Logo size="sm" withText={true} />
              </div>
              
              {/* Links centered */}
              <div className="flex flex-wrap gap-6 text-sm justify-center">
                <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                <Link to="/terms" className="hover:underline">Terms of Service</Link>
              </div>
              
              {/* Copyright on the right */}
              <div className="text-sm text-muted-foreground">
                © 2025 Neura AI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
