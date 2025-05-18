
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Home, ChevronDown } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserInfo {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

interface UserMenuProps {
  showInMobileMenu?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ showInMobileMenu = false }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount and when storage changes
    const checkAuth = () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleSignOut = () => {
    // Remove user from session storage
    sessionStorage.removeItem('user');
    setUser(null);
    toast.success("Signed out successfully");
    navigate('/');
  };

  const handleDashboardClick = () => {
    // Check if user is authenticated before navigating to dashboard
    if (!user) {
      toast.error("You need to sign in first");
      navigate('/signin');
      return;
    }
    navigate('/dashboard');
  };

  // If showing in mobile menu, render direct links
  if (showInMobileMenu) {
    if (!user) {
      return (
        <div className="flex flex-col gap-2">
          <Button variant="default" asChild className="w-full">
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="px-4 py-2 text-sm font-medium">
          Signed in as: <span className="font-bold">{user.name}</span>
        </div>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent/50 rounded-md">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <button 
          onClick={handleDashboardClick}
          className="flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-accent/50 rounded-md w-full"
        >
          <Settings className="h-4 w-4" />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-left text-red-500 hover:bg-red-500/10 rounded-md w-full mt-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    );
  }

  // Regular dropdown for desktop
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to="/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  // If user is logged in, show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline-block">{user.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/" className="flex items-center cursor-pointer w-full">
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDashboardClick} className="flex items-center cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
