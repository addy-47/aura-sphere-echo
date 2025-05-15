
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store user info in session storage
      sessionStorage.setItem('user', JSON.stringify({ 
        email, 
        name,
        isAuthenticated: true 
      }));
      
      // Show success message
      toast.success('Account created successfully!');
      
      // Navigate to homepage after signup
      navigate('/');
    } catch (error) {
      toast.error('Sign up failed. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className={`${theme === 'dark' ? 'border-white/5 bg-black/30' : 'border-black/5 bg-white/90'} backdrop-blur-lg`}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className={`${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="sr-only">Google</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill={theme === 'dark' ? 'white' : 'black'}>
                    <path d="M13.3174 10.7999L19.1457 4H17.9543L12.9041 9.92084L8.8654 4H4.14258L10.2114 13.4324L4 20.6855H5.19135L10.6213 14.3115L14.9695 20.6855H19.6925L13.3171 10.7999H13.3174ZM11.1036 13.5128L10.4064 12.4889L5.91631 5.92344H8.0109L11.5661 10.9847L12.2634 12.0086L17.0226 19H14.9281L11.1036 13.5131V13.5128Z"/>
                  </svg>
                  <span className="sr-only">X</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className={`w-full border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} px-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Or continue with
                  </span>
                </div>
              </div>
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text" 
                      placeholder="John Doe"
                      className={`${theme === 'dark' ? 'bg-white/5 border-white/10 focus:border-white/20' : 'bg-black/5 border-black/10 focus:border-black/20'}`}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email" 
                      placeholder="m@example.com"
                      className={`${theme === 'dark' ? 'bg-white/5 border-white/10 focus:border-white/20' : 'bg-black/5 border-black/10 focus:border-black/20'}`}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`${theme === 'dark' ? 'bg-white/5 border-white/10 focus:border-white/20' : 'bg-black/5 border-black/10 focus:border-black/20'} pr-10`}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                Already have an account?{" "}
                <Button variant="link" className={`p-0 h-auto ${theme === 'dark' ? 'text-white' : 'text-black'}`} asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;
