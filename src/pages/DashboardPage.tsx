import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Star, 
  Clock, 
  Users, 
  Settings, 
  MessageSquare, 
  Calendar, 
  ArrowUp,
  ArrowDown,
  Layers,
  Bell,
  Check,
  X,
  Link,
  LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  Circle,
  CircleDot,
  Plus
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SpotifyIcon from '../components/icons/SpotifyIcon';
import { Toggle } from '@/components/ui/toggle';
import PersonalityTree from '../components/PersonalityTree';
import { toast } from 'sonner';

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

const activityData = [
  { 
    id: 1,
    type: 'chat',
    title: 'AI Chat Session',
    description: 'Discussed project requirements',
    timestamp: '2 hours ago',
    duration: '15 min',
    completed: true
  },
  { 
    id: 2,
    type: 'analysis',
    title: 'Data Analysis',
    description: 'Analyzed Q2 marketing performance',
    timestamp: '5 hours ago',
    duration: '42 min',
    completed: true
  },
  { 
    id: 3,
    type: 'settings',
    title: 'Settings Updated',
    description: 'Changed notification preferences',
    timestamp: '1 day ago',
    duration: '3 min',
    completed: true
  },
  { 
    id: 4,
    type: 'customize',
    title: 'AI Customization',
    description: 'Adjusted personality parameters',
    timestamp: '3 days ago',
    duration: '12 min',
    completed: true
  },
  { 
    id: 5,
    type: 'system',
    title: 'System Maintenance',
    description: 'Scheduled maintenance backup',
    timestamp: '5 days ago',
    duration: '25 min',
    completed: true
  }
];

const connectionsData = [
  { 
    id: 1, 
    name: 'Spotify', 
    icon: <SpotifyIcon className="h-5 w-5 text-green-500" />, 
    status: 'Connected',
    lastSync: '2 hours ago' 
  },
  { 
    id: 2, 
    name: 'GitHub', 
    icon: <Github className="h-5 w-5 text-purple-500" />, 
    status: 'Connected',
    lastSync: '1 day ago' 
  },
  { 
    id: 3, 
    name: 'Twitter', 
    icon: <Twitter className="h-5 w-5 text-blue-500" />, 
    status: 'Disconnected',
    lastSync: 'Never' 
  },
  { 
    id: 4, 
    name: 'LinkedIn', 
    icon: <Linkedin className="h-5 w-5 text-blue-700" />, 
    status: 'Connected',
    lastSync: '3 days ago' 
  },
  { 
    id: 5, 
    name: 'Google Mail', 
    icon: <Mail className="h-5 w-5 text-red-500" />, 
    status: 'Connected',
    lastSync: '12 hours ago' 
  },
  { 
    id: 6, 
    name: 'Personal Website', 
    icon: <Globe className="h-5 w-5 text-teal-500" />, 
    status: 'Pending',
    lastSync: 'Never' 
  },
];

const DashboardPage = () => {
  const { theme } = useTheme();
  const { moodColor } = useMood();
  
  // State for dashboard layout and chart style
  const [dashboardLayout, setDashboardLayout] = useState<'standard' | 'compact' | 'expanded'>('standard');
  const [chartStyle, setChartStyle] = useState<'area' | 'line' | 'bar'>('area');
  
  // State for active tab to manage redirection
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for customization features (moved from CustomizePage)
  const [aiName, setAiName] = useState('Neura');
  const [notifications, setNotifications] = useState(true);
  const [macros, setMacros] = useState([
    { id: '1', name: 'Morning Greeting', command: 'gm', response: 'Good morning! Ready for a productive day?' },
    { id: '2', name: 'Weather Check', command: 'weather', response: 'Checking today\'s weather forecast for you...' },
  ]);
  const [newMacro, setNewMacro] = useState({ name: '', command: '', response: '' });
  
  // Function to handle saving personalization settings
  const handleSavePersonalization = () => {
    toast.success('Personalization settings saved!');
  };

  // Function to handle adding a new macro
  const handleAddMacro = () => {
    if (!newMacro.name || !newMacro.command || !newMacro.response) {
      toast.error('Please fill in all macro fields');
      return;
    }
    
    setMacros([...macros, { ...newMacro, id: Date.now().toString() }]);
    setNewMacro({ name: '', command: '', response: '' });
    toast.success('Macro added successfully!');
  };

  // Function to handle deleting a macro
  const handleDeleteMacro = (id: string) => {
    setMacros(macros.filter(macro => macro.id !== id));
    toast.success('Macro deleted successfully!');
  };
  
  // Function to handle redirecting to connections tab
  const handleAddNewConnection = () => {
    setActiveTab('connections');
  };
  
  // Function to render the appropriate chart based on selected style
  const renderChart = () => {
    switch(chartStyle) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={moodColor} 
                strokeWidth={2}
                dot={{ fill: moodColor }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
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
              <Bar 
                dataKey="value" 
                fill={moodColor} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default: // 'area'
        return (
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
        );
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your AI activity and insights</p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <ScrollArea className="w-full relative">
            <TabsList className="inline-flex w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="macros">Macros</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          <TabsContent value="overview" className="space-y-8 mt-6">
            {/* Analytics Cards */}
            <div className={`grid grid-cols-1 ${
              dashboardLayout === 'compact' ? 'md:grid-cols-4 gap-2' : 
              dashboardLayout === 'expanded' ? 'md:grid-cols-2 gap-6' : 
              'md:grid-cols-2 lg:grid-cols-4 gap-4'
            }`}>
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
                  {renderChart()}
                </AspectRatio>
              </CardContent>
            </Card>
            
            {/* AI Features Section */}
            <div className={`grid grid-cols-1 ${
              dashboardLayout === 'compact' ? 'md:grid-cols-2 gap-2' : 
              dashboardLayout === 'expanded' ? 'md:grid-cols-1 gap-6' : 
              'md:grid-cols-2 gap-4'
            }`}>
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
            
            {/* Connected Services (Modified to only show connected services) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>Manage your linked accounts</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddNewConnection}>
                  <Link className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {connectionsData
                    .filter(conn => conn.status === 'Connected')
                    .slice(0, 4) // Show only first 4 connected services
                    .map(conn => (
                      <Card key={conn.id} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {conn.icon}
                            <span>{conn.name}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                          <p className="text-xs text-muted-foreground">Connected • {conn.lastSync}</p>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            {/* Activity content - improved and filled in */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>Your recent activity across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activityData.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'chat' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'analysis' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'settings' ? 'bg-amber-100 text-amber-600' :
                        activity.type === 'customize' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      } dark:bg-opacity-20`}>
                        {activity.type === 'chat' && <MessageSquare className="h-5 w-5" />}
                        {activity.type === 'analysis' && <LineChart className="h-5 w-5" />}
                        {activity.type === 'settings' && <Settings className="h-5 w-5" />}
                        {activity.type === 'customize' && <Users className="h-5 w-5" />}
                        {activity.type === 'system' && <Bell className="h-5 w-5" />}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.title}</p>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{activity.duration}</span>
                          {activity.completed && (
                            <span className="inline-flex items-center ml-2 text-green-600 dark:text-green-400">
                              <Check className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Timeline */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Timeline of your AI interaction sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  
                  <div className="space-y-8 relative pl-10">
                    <div className="relative">
                      <div className="absolute -left-6 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                      <div>
                        <h4 className="text-sm font-medium">Advanced AI Brainstorming</h4>
                        <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                        <p className="mt-2 text-sm">Generated 5 project ideas with detailed analysis</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-6 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                      <div>
                        <h4 className="text-sm font-medium">Document Analysis</h4>
                        <p className="text-xs text-muted-foreground">Yesterday at 3:15 PM</p>
                        <p className="mt-2 text-sm">Processed 3 legal documents with 98% accuracy</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-6 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                      <div>
                        <h4 className="text-sm font-medium">Weekly Status Report</h4>
                        <p className="text-xs text-muted-foreground">June 15, 2025</p>
                        <p className="mt-2 text-sm">Generated weekly summary and analytics report</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* New Connections Tab */}
          <TabsContent value="connections" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts & Services</CardTitle>
                <CardDescription>Manage your external service integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {connectionsData.map((connection) => (
                    <div key={connection.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 rounded-full bg-secondary/20">
                        {connection.icon}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{connection.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {connection.status === 'Connected' ? (
                            <CircleDot className="h-3 w-3 text-green-500" />
                          ) : connection.status === 'Pending' ? (
                            <Circle className="h-3 w-3 text-amber-500" />
                          ) : (
                            <Circle className="h-3 w-3 text-gray-400" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {connection.status} • Last sync: {connection.lastSync}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant={connection.status === 'Connected' ? "outline" : "default"} 
                        size="sm"
                      >
                        {connection.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Add New Connection</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {['Slack', 'Discord', 'Notion', 'Dropbox'].map((service) => (
                      <Button key={service} variant="outline" className="h-auto py-6 flex flex-col gap-2">
                        <LinkIcon className="h-6 w-6" />
                        <span>{service}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Updated Personality Tab with AI name and Voice Type */}
          <TabsContent value="personality" className="mt-6 space-y-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Personalization</CardTitle>
                <CardDescription>
                  Customize how your AI looks and behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ai-name">AI Name</Label>
                  <Input 
                    id="ai-name" 
                    value={aiName} 
                    onChange={(e) => setAiName(e.target.value)}
                    placeholder="Enter a name for your AI"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voice-type">Voice Type</Label>
                  <select 
                    id="voice-type" 
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="cheerful">Cheerful</option>
                    <option value="calm">Calm</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePersonalization}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <PersonalityTree />
          </TabsContent>
          
          {/* New Macros Tab */}
          <TabsContent value="macros" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Macros</CardTitle>
                <CardDescription>
                  Create shortcuts for common interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Macros</h3>
                  <div className="space-y-4">
                    {macros.map((macro) => (
                      <div key={macro.id} className="p-4 border rounded-md relative">
                        <div className="absolute top-2 right-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteMacro(macro.id)}
                            className="h-6 w-6 p-0"
                          >
                            ✕
                          </Button>
                        </div>
                        <div className="grid gap-2">
                          <div>
                            <span className="font-medium">{macro.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Command: <code className="bg-secondary px-1 py-0.5 rounded">{macro.command}</code>
                          </div>
                          <div className="text-sm">
                            Response: {macro.response}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Add New Macro</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="macro-name">Macro Name</Label>
                      <Input 
                        id="macro-name"
                        value={newMacro.name}
                        onChange={(e) => setNewMacro({...newMacro, name: e.target.value})}
                        placeholder="e.g., Weather Check"
                      />
                    </div>
                    <div>
                      <Label htmlFor="macro-command">Command</Label>
                      <Input 
                        id="macro-command"
                        value={newMacro.command}
                        onChange={(e) => setNewMacro({...newMacro, command: e.target.value})}
                        placeholder="e.g., weather"
                      />
                    </div>
                    <div>
                      <Label htmlFor="macro-response">Response</Label>
                      <Textarea 
                        id="macro-response"
                        value={newMacro.response}
                        onChange={(e) => setNewMacro({...newMacro, response: e.target.value})}
                        placeholder="Enter the AI's response when this command is used"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddMacro}>Add Macro</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* New Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how your AI should notify you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Enable Notifications</h3>
                    <p className="text-sm text-muted-foreground">Allow your AI to send you notifications</p>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Categories</h3>
                  
                  {[
                    { id: 'reminders', name: 'Reminders', desc: 'Tasks and calendar events' },
                    { id: 'insights', name: 'Insights', desc: 'Patterns and suggestions' },
                    { id: 'messages', name: 'Messages', desc: 'New AI messages and updates' },
                    { id: 'learning', name: 'Learning Progress', desc: 'Updates on AI learning' },
                  ].map((category) => (
                    <div key={category.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <Label htmlFor={category.id} className="font-medium">{category.name}</Label>
                        <p className="text-sm text-muted-foreground">{category.desc}</p>
                      </div>
                      <Switch id={category.id} defaultChecked={category.id === 'messages'} disabled={!notifications} />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quiet-hours">Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time" className="text-sm">Start</Label>
                      <Input 
                        id="start-time" 
                        type="time" 
                        defaultValue="22:00" 
                        disabled={!notifications}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time" className="text-sm">End</Label>
                      <Input 
                        id="end-time" 
                        type="time" 
                        defaultValue="08:00" 
                        disabled={!notifications}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Notification settings saved!')} disabled={!notifications}>
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6 space-y-6">
            {/* Settings content - improved and filled in */}
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>Configure your dashboard preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Privacy & Data</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Share Analytics</p>
                      <p className="text-sm text-muted-foreground">Allow anonymous usage data sharing to improve AI</p>
                    </div>
                    <Switch id="share-analytics" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cloud Storage</p>
                      <p className="text-sm text-muted-foreground">Store your interactions in the cloud</p>
                    </div>
                    <Switch id="cloud-storage" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Personalization</p>
                      <p className="text-sm text-muted-foreground">Allow AI to adapt to your preferences</p>
                    </div>
                    <Switch id="personalization" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Updates</p>
                      <p className="text-sm text-muted-foreground">Receive weekly summaries and updates</p>
                    </div>
                    <Switch id="email-updates" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about important system changes</p>
                    </div>
                    <Switch id="system-alerts" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Display Settings</h3>
                  
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Dashboard Layout</p>
                    <div className="flex flex-wrap gap-2">
                      <Toggle 
                        variant="outline" 
                        aria-label="Standard layout"
                        pressed={dashboardLayout === 'standard'}
                        onClick={() => setDashboardLayout('standard')}
                      >
                        <p className="text-xs">Standard</p>
                      </Toggle>
                      <Toggle 
                        variant="outline" 
                        aria-label="Compact layout"
                        pressed={dashboardLayout === 'compact'}
                        onClick={() => setDashboardLayout('compact')}
                      >
                        <p className="text-xs">Compact</p>
                      </Toggle>
                      <Toggle 
                        variant="outline" 
                        aria-label="Expanded layout"
                        pressed={dashboardLayout === 'expanded'}
                        onClick={() => setDashboardLayout('expanded')}
                      >
                        <p className="text-xs">Expanded</p>
                      </Toggle>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Graph Style</p>
                    <div className="flex flex-wrap gap-2">
                      <Toggle 
                        variant="outline" 
                        aria-label="Area chart"
                        pressed={chartStyle === 'area'}
                        onClick={() => setChartStyle('area')}
                      >
                        <p className="text-xs">Area</p>
                      </Toggle>
                      <Toggle 
                        variant="outline" 
                        aria-label="Line chart"
                        pressed={chartStyle === 'line'}
                        onClick={() => setChartStyle('line')}
                      >
                        <p className="text-xs">Line</p>
                      </Toggle>
                      <Toggle 
                        variant="outline" 
                        aria-label="Bar chart"
                        pressed={chartStyle === 'bar'}
                        onClick={() => setChartStyle('bar')}
                      >
                        <p className="text-xs">Bar</p>
                      </Toggle>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account & Data</CardTitle>
                <CardDescription>Manage your account settings and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Data Management</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export All Data</p>
                      <p className="text-sm text-muted-foreground">Download all your data in JSON format</p>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Clear History</p>
                      <p className="text-sm text-muted-foreground">Delete all your recent activity</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Clear</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-red-500">Danger Zone</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
