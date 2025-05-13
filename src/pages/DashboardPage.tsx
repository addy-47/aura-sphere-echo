
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
  const { moodColor } = useMood();
  
  const [connectedServices, setConnectedServices] = useState({
    twitter: false,
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

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Sign in to access your Neura AI dashboard and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" onClick={handleLogin}>Sign In</Button>
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
            className="mt-4 lg:mt-0"
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
              <Card className="md:col-span-2">
                <CardHeader>
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
              
              <Card>
                <CardHeader>
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
              
              <Card>
                <CardHeader>
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
            <Card>
              <CardHeader>
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
                        id: 'twitter', 
                        name: 'Twitter', 
                        icon: '🐦', 
                        desc: 'Learn from your writing style and interests' 
                      },
                      { 
                        id: 'facebook', 
                        name: 'Facebook', 
                        icon: '👥', 
                        desc: 'Understand your social connections' 
                      },
                      { 
                        id: 'gmail', 
                        name: 'Gmail', 
                        icon: '✉️', 
                        desc: 'Analyze communication patterns' 
                      },
                      { 
                        id: 'spotify', 
                        name: 'Spotify', 
                        icon: '🎵', 
                        desc: 'Incorporate your music preferences' 
                      },
                    ].map((service) => (
                      <Card key={service.id} className="overflow-hidden">
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
