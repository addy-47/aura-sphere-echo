
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Settings, MessageCircle, User, Home, Menu, X, Github, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import Logo from './Logo';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  minimal?: boolean;
  isAuthenticated?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, minimal = false, isAuthenticated = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { moodColor } = useMood();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Define nav items based on authentication status
  const navItems = isAuthenticated 
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

  // Return minimal layout without navbar and footer
  if (minimal) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Navigation at the top */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-5 px-4 sm:px-8 z-50 backdrop-blur-xl bg-black/70 transition-all border-b border-white/10">
          <Link to="/" className="hover-scale flex items-center">
            <Logo />
          </Link>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link to="/chat" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Chat</Link>
            <Link to="/customize" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Customize</Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full hover-scale text-gray-400"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/10 hover:text-white rounded-full text-sm py-1 px-3 sm:px-4 sm:py-2"
            >
              <Link to="/chat">
                Sign in
              </Link>
            </Button>
          </div>
        </nav>
        
        <main className="flex-1 mt-16">{children}</main>
        
        {/* Footer for minimal layout */}
        <footer className="border-t border-white/10 py-10 bg-black mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Logo size="md" />
                <p className="mt-2 text-gray-400 text-sm">
                  Your digital doppelganger that grows with you
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-3 text-white">Platform</h3>
                  <ul className="space-y-2">
                    <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                    <li><Link to="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link></li>
                    <li><Link to="/customize" className="text-gray-400 hover:text-white transition-colors">Customize</Link></li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-3 text-white">Legal</h3>
                  <ul className="space-y-2">
                    <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
                  <h3 className="font-semibold mb-3 text-white">Connect</h3>
                  <div className="flex gap-4">
                    <a href="#" className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-400">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href="#" className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-400">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Neura AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 transition-all border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="hover-scale">
              <Logo />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover-lift ${
                    location.pathname === item.path 
                      ? 'bg-white/10 text-white font-medium'
                      : 'hover:bg-white/5 text-gray-400'
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
              
              {!isAuthenticated && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-white/10 text-white hover:bg-white/10 hover:text-white rounded-full"
                >
                  <Link to="/signin">
                    Sign in
                  </Link>
                </Button>
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
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-gray-400'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <Link 
                    to="/signin"
                    className="flex items-center gap-2 p-2 mt-2 bg-white/10 rounded-lg text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Add padding to account for fixed header */}
      <div className={`pt-16`}></div>
      
      <main className="flex-1 min-h-[calc(100vh-16rem)]">
        {children}
      </main>
      
      <footer 
        className="border-t border-white/10 py-10 bg-black mt-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Logo size="md" />
              <p className="mt-2 text-gray-400 text-sm">
                Your digital doppelganger that grows with you
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold mb-3 text-white">Platform</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link></li>
                  <li><Link to="/customize" className="text-gray-400 hover:text-white transition-colors">Customize</Link></li>
                </ul>
              </div>
              
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold mb-3 text-white">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              
              <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
                <h3 className="font-semibold mb-3 text-white">Connect</h3>
                <div className="flex gap-4">
                  <a href="#" className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-400">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="#" className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-400">
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Neura AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Only show mobile bottom nav if not on chat page or we're on chat page but not mobile */}
      {(location.pathname !== '/chat' || !isMobile) && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-2 flex justify-around z-40">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                location.pathname === item.path 
                  ? 'text-white'
                  : 'text-gray-400'
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
