
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMood } from '../contexts/MoodContext';
import { Eye, EyeOff, Facebook, Mail } from 'lucide-react';

// Simulated chart data
const chartData = [
  { day: 'Mon', interactions: 5, sentiment: 60 },
  { day: 'Tue', interactions: 12, sentiment: 75 },
  { day: 'Wed', interactions: 15, sentiment: 85 },
  { day: 'Thu', interactions: 10, sentiment: 70 },
  { day: 'Fri', interactions: 8, sentiment: 65 },
  { day: 'Sat', interactions: 20, sentiment: 90 },
  { day: 'Sun', interactions: 16, sentiment: 85 },
];

const DashboardPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { moodColor } = useMood();
  
  const [connectedServices, setConnectedServices] = useState({
    x: false,
    facebook: false,
    gmail: false,
    spotify: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Simulate login
    toast.success('Login successful!');
    setIsLoggedIn(true);
  };

  const handleConnectService = (service: keyof typeof connectedServices) => {
    setConnectedServices({ ...connectedServices, [service]: !connectedServices[service] });
    if (!connectedServices[service]) {
      toast.success(`Connected to ${service}!`);
    } else {
      toast.success(`Disconnected from ${service}!`);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    toast.info(`Signing in with ${provider}...`);
    // Simulate social login
    setTimeout(() => {
      toast.success(`${provider} login successful!`);
      setIsLoggedIn(true);
    }, 1000);
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Card className="w-full max-w-md overflow-hidden">
            <CardHeader className="space-y-1 bg-gradient-to-r from-background to-background/80 pb-6">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Sign in to access your Neura AI dashboard and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  type="submit"
                  style={{
                    background: moodColor,
                    boxShadow: `0 0 10px ${moodColor}40`
                  }}
                >
                  Sign In
                </Button>
              </form>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-border w-full"></div>
                <span className="bg-card px-2 text-xs text-muted-foreground absolute">OR CONTINUE WITH</span>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleSocialSignIn('Google')}
                  className="w-full hover-lift"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Continue with Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleSocialSignIn('Facebook')}
                  className="w-full hover-lift"
                >
                  <Facebook className="mr-2 h-5 w-5" />
                  Continue with Facebook
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleSocialSignIn('X')}
                  className="w-full hover-lift"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" className="mr-2">
                    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Continue with X
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <a href="#" className="text-primary hover:underline" onClick={() => toast.info('Sign up functionality coming soon!')}>
                  Sign up
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your AI preferences and connection settings
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 lg:mt-0 hover-lift"
            onClick={() => setIsLoggedIn(false)}
          >
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2 overflow-hidden hover-lift">
                <CardHeader className="bg-gradient-to-r from-background/80 to-background">
                  <CardTitle>AI Interaction Analytics</CardTitle>
                  <CardDescription>
                    Your interaction history with Neura AI over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="interactions" stroke={moodColor} strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="sentiment" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover-lift">
                <CardHeader className="bg-gradient-to-r from-background/80 to-background">
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>
                    How well Neura is learning from your interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {[
                      { label: 'Communication Style', value: 75 },
                      { label: 'Preferences', value: 62 },
                      { label: 'Personal Knowledge', value: 45 },
                      { label: 'Predictive Accuracy', value: 58 },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500 ease-in-out"
                            style={{ 
                              width: `${item.value}%`, 
                              backgroundColor: moodColor 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover-lift">
                <CardHeader className="bg-gradient-to-r from-background/80 to-background">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest interactions with Neura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Morning Greeting', time: '08:32 AM', desc: 'Neura welcomed you with weather info' },
                      { title: 'Calendar Sync', time: '10:15 AM', desc: 'Synchronized your upcoming events' },
                      { title: 'Chat Session', time: '02:45 PM', desc: '23 messages exchanged' },
                      { title: 'Settings Update', time: '04:12 PM', desc: 'You updated notification preferences' },
                    ].map((activity, i) => (
                      <div key={i} className="pb-3 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.desc}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        {i < 3 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-background/80 to-background">
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Connect your accounts to enhance your AI's personalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Neura AI can utilize data from your connected accounts to better understand your preferences and style.
                    Your data is kept private and secure.
                  </p>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      { 
                        id: 'x', 
                        name: 'X', 
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        ), 
                        desc: 'Learn from your writing style and interests' 
                      },
                      { 
                        id: 'facebook', 
                        name: 'Facebook', 
                        icon: <Facebook />, 
                        desc: 'Understand your social connections' 
                      },
                      { 
                        id: 'gmail', 
                        name: 'Gmail', 
                        icon: <Mail />, 
                        desc: 'Analyze communication patterns' 
                      },
                      { 
                        id: 'spotify', 
                        name: 'Spotify', 
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="4" />
                            <path d="M4.9 4.9 9 9" />
                            <path d="M4.9 19.1 9 15" />
                            <path d="M19.1 4.9 15 9" />
                            <path d="M19.1 19.1 15 15" />
                          </svg>
                        ), 
                        desc: 'Incorporate your music preferences' 
                      },
                    ].map((service) => (
                      <Card key={service.id} className="overflow-hidden hover-lift">
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">{service.icon}</div>
                              <div>
                                <h3 className="font-medium">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.desc}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-secondary/50 px-6 py-4">
                          <Button
                            variant={connectedServices[service.id as keyof typeof connectedServices] ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleConnectService(service.id as keyof typeof connectedServices)}
                          >
                            {connectedServices[service.id as keyof typeof connectedServices] ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="text-sm text-muted-foreground">
                  By connecting services, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">data usage policy</a>. 
                  You can disconnect any service at any time.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
