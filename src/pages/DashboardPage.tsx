import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { 
  Star, 
  Clock, 
  Users, 
  Settings, 
  MessageSquare, 
  LineChart, 
  Calendar, 
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SpotifyIcon from '../components/icons/SpotifyIcon';

const data = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 30 },
  { name: 'Mar', value: 45 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 60 },
  { name: 'Jun', value: 70 },
  { name: 'Jul', value: 80 },
  { name: 'Aug', value: 90 },
  { name: 'Sep', value: 100 },
  { name: 'Oct', value: 110 },
  { name: 'Nov', value: 120 },
  { name: 'Dec', value: 130 },
];

const DashboardPage = () => {
  const { theme } = useTheme();
  const { moodColor } = useMood();
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your AI activity and insights</p>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 mt-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,853</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 
                      +12.5%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Understanding Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <Progress value={92} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">17</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" /> 
                      -3%
                    </span> from last week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">67%</div>
                  </div>
                  <Progress value={67} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>
            
            {/* Main Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Interaction History</CardTitle>
                <CardDescription>Your conversation patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16/6} className="bg-background">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={moodColor} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={moodColor} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#ffffff' : '#000000' }} />
                      <YAxis tick={{ fill: theme === 'dark' ? '#ffffff' : '#000000' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                          borderColor: theme === 'dark' ? '#333333' : '#e2e8f0',
                          color: theme === 'dark' ? '#ffffff' : '#000000'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={moodColor} 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </AspectRatio>
              </CardContent>
            </Card>
            
            {/* AI Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span>Top Features Used</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>Text Chat</span>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span>3D Visualization</span>
                      </div>
                      <span className="text-sm font-medium">64%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                        <span>Analytics</span>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>User Management</span>
                      </div>
                      <span className="text-sm font-medium">32%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Chat Session</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Settings Updated</span>
                      </div>
                      <span className="text-sm text-muted-foreground">5 hours ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Profile Customized</span>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                        <span>Data Analysis</span>
                      </div>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Connected Services */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>Manage your linked accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Card className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <SpotifyIcon className="h-5 w-5 text-green-500" />
                        <span>Spotify</span>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </CardFooter>
                  </Card>
                  
                  {/* More service cards would go here */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            {/* Activity content */}
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>Your recent activity across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Activity tab content would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            {/* Settings content */}
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>Configure your dashboard preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings tab content would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
