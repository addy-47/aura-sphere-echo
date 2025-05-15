
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Settings, MessageCircle, User, Home, Menu, X, Github, Facebook, Mail, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import Logo from './Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
  minimal?: boolean;
  isAuthenticated?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, minimal = false, isAuthenticated = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { moodColor } = useMood();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // For demonstration, we'll use session storage to check login status
  const storedUser = sessionStorage.getItem('user');
  const username = storedUser ? JSON.parse(storedUser).email.split('@')[0] : null;
  const isUserLoggedIn = !!username;
  
  // Define nav items based on authentication status
  const navItems = isUserLoggedIn 
    ? [
        { path: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
        { path: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
        { path: '/customize', icon: <Settings className="h-5 w-5" />, label: 'Customize' },
        { path: '/dashboard', icon: <User className="h-5 w-5" />, label: 'Dashboard' },
      ]
    : [
        { path: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
        { path: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
        { path: '/customize', icon: <Settings className="h-5 w-5" />, label: 'Customize' },
      ];

  const handleSignOut = () => {
    sessionStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Force reload to update auth state
  };

  // Hide footer on chat page in mobile view
  const showFooter = !(isMobile && location.pathname === '/chat');

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl 
          ${theme === 'dark' 
            ? 'bg-black/70 border-white/10' 
            : 'bg-white/70 border-black/10'} 
          transition-all border-b`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="hover-scale flex items-center">
              <Logo withText />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover-lift ${
                    location.pathname === item.path 
                      ? `${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'} font-medium`
                      : `${theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-600'}`
                  }`}
                  style={location.pathname === item.path ? { 
                    boxShadow: `0 0 8px ${moodColor}20`,
                  } : {}}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="rounded-full hover-scale text-gray-400"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {!isUserLoggedIn ? (
                <Button 
                  onClick={() => navigate('/signin')}
                  variant="outline" 
                  className={`${theme === 'dark' 
                    ? 'border-white/10 text-white hover:bg-white/10' 
                    : 'border-black/10 text-black hover:bg-black/10'} 
                    hover:text-white rounded-full`}
                >
                  Sign in
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`flex items-center gap-2 rounded-full
                        ${theme === 'dark' 
                          ? 'border-white/10 hover:bg-white/10' 
                          : 'border-black/10 hover:bg-black/10'}`}
                    >
                      <User className="h-4 w-4" />
                      <span>{username}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className={`${theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white/90 border-black/10'}`}
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <div className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-gray-400"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 p-3 rounded-lg backdrop-blur-xl bg-black/70 animate-in fade-in slide-in-from-top">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      location.pathname === item.path 
                        ? `${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'} font-medium`
                        : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {!isUserLoggedIn && (
                  <Link 
                    to="/signin"
                    className={`flex items-center gap-2 p-2 mt-2 rounded-lg
                      ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'} font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
                
                {isUserLoggedIn && (
                  <Button 
                    variant="ghost"
                    className="flex items-center justify-start gap-2 p-2 mt-2 rounded-lg text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Add padding to account for fixed header */}
      <div className="pt-16 md:pt-20"></div>
      
      <main className="flex-1 min-h-[calc(100vh-16rem)] px-4 md:container md:mx-auto">
        <div className="py-6 md:py-8">
          {children}
        </div>
      </main>
      
      {showFooter && (
        <footer 
          className={`border-t py-10 mt-12
            ${theme === 'dark' 
              ? 'border-white/10 bg-black' 
              : 'border-black/10 bg-white'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Logo size="md" />
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your digital doppelganger that grows with you
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-3">Platform</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/chat" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                        Chat
                      </Link>
                    </li>
                    <li>
                      <Link to="/customize" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                        Customize
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-3">Legal</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/privacy" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
                  <h3 className="font-semibold mb-3">Connect</h3>
                  <div className="flex gap-4">
                    <a href="#" className={`rounded-full p-2 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-colors text-gray-400`}>
                      <Facebook size={20} />
                    </a>
                    <a href="#" className={`rounded-full p-2 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-colors text-gray-400`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                    <a href="#" className={`rounded-full p-2 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-colors text-gray-400`}>
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>© {new Date().getFullYear()} Neura AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
      
      {/* Only show mobile bottom nav if not on chat page or we're on chat page but not mobile */}
      {(location.pathname !== '/chat' || !isMobile) && (
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-black/80 border-white/10' : 'bg-white/80 border-black/10'} backdrop-blur-xl border-t p-2 flex justify-around z-40`}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                location.pathname === item.path 
                  ? `${theme === 'dark' ? 'text-white' : 'text-black'}`
                  : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
