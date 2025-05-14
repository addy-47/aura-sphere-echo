
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
}

const Layout: React.FC<LayoutProps> = ({ children, minimal = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { moodColor } = useMood();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
    { path: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
    { path: '/customize', icon: <Settings className="h-5 w-5" />, label: 'Customize' },
    { path: '/dashboard', icon: <User className="h-5 w-5" />, label: 'Dashboard' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {!minimal && (
        <header 
          className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 transition-all"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="hover-scale">
                <Logo />
              </Link>
              
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover-lift ${
                      location.pathname === item.path 
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-secondary'
                    }`}
                    style={location.pathname === item.path ? { 
                      boxShadow: `0 0 8px ${moodColor}40`,
                      borderColor: moodColor
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
                  className="rounded-full hover-scale"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                
                <div className="md:hidden">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-3 p-3 rounded-lg glassmorphism animate-in fade-in slide-in-from-top">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        location.pathname === item.path 
                          ? 'bg-primary/20 text-primary font-medium'
                          : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {!minimal && (
        <footer 
          className="border-t py-10 backdrop-blur-sm bg-background/60"
          style={{ borderColor: moodColor + '20' }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Logo size="md" />
                <p className="mt-2 text-muted-foreground text-sm">
                  Your digital doppelganger that grows with you
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-3 text-foreground">Platform</h3>
                  <ul className="space-y-2">
                    <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
                    <li><Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">Chat</Link></li>
                    <li><Link to="/customize" className="text-muted-foreground hover:text-foreground transition-colors">Customize</Link></li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-3 text-foreground">Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                  </ul>
                </div>
                
                <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
                  <h3 className="font-semibold mb-3 text-foreground">Connect</h3>
                  <div className="flex gap-4">
                    <a href="#" className="rounded-full p-2 bg-secondary hover:bg-primary/20 transition-colors">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="rounded-full p-2 bg-secondary hover:bg-primary/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href="#" className="rounded-full p-2 bg-secondary hover:bg-primary/20 transition-colors">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Neura AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
      
      {/* Only show mobile bottom nav if not on chat page or we're on chat page but not mobile */}
      {!minimal && (location.pathname !== '/chat' || !isMobile) && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-2 flex justify-around">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                location.pathname === item.path 
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
              style={location.pathname === item.path ? { color: moodColor } : {}}
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
