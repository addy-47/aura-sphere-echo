
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Heart,
  BarChart3,
  Clock,
  Target,
  Zap,
  Settings,
  Bell,
  Users,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const DashboardPage = () => {
  const { mood, moodColor } = useMood();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  // Overview Tab Content
  const OverviewTab = () => {
    const stats = [
      {
        title: 'Conversations',
        value: '847',
        change: '+12%',
        icon: MessageSquare,
        description: 'Total interactions this month'
      },
      {
        title: 'Personality Match',
        value: '94%',
        change: '+5%',
        icon: Brain,
        description: 'AI-human alignment score'
      },
      {
        title: 'Data Analysis',
        value: '1.2K',
        change: '+8%',
        icon: BarChart3,
        description: 'Data points processed'
      },
      {
        title: 'Response Time',
        value: '0.3s',
        change: '-15%',
        icon: Zap,
        description: 'Average processing speed'
      }
    ];

    const moodAnalysis = [
      { mood: 'Happy', percentage: 45, color: '#22c55e' },
      { mood: 'Excited', percentage: 25, color: '#f59e0b' },
      { mood: 'Calm', percentage: 20, color: '#3b82f6' },
      { mood: 'Focused', percentage: 10, color: '#8b5cf6' },
    ];

    const recentInteractions = [
      { time: '2 hours ago', topic: 'Career Goals', sentiment: 'positive' },
      { time: '5 hours ago', topic: 'Music Preferences', sentiment: 'excited' },
      { time: '1 day ago', topic: 'Travel Plans', sentiment: 'enthusiastic' },
      { time: '2 days ago', topic: 'Learning AI', sentiment: 'curious' },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: moodColor + '20' }}
                      >
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: moodColor }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: moodColor }} />
                Mood Analysis
              </CardTitle>
              <CardDescription>
                Your emotional patterns over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {moodAnalysis.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.mood}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={item.percentage} 
                      className="w-24" 
                    />
                    <span className="text-sm text-muted-foreground w-10">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Interactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: moodColor }} />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest conversation topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentInteractions.map((interaction, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{interaction.topic}</p>
                    <p className="text-xs text-muted-foreground">{interaction.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {interaction.sentiment}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Macros Tab Content
  const MacrosTab = () => {
    const [macros, setMacros] = useState([
      { id: 1, name: 'Daily Check-in', trigger: '/checkin', response: 'How are you feeling today?' },
      { id: 2, name: 'Mood Tracker', trigger: '/mood', response: 'Let me analyze your current mood...' },
      { id: 3, name: 'Goal Review', trigger: '/goals', response: 'Let\'s review your progress on current goals.' }
    ]);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Conversation Macros</h3>
            <p className="text-muted-foreground">Quick responses and automated interactions</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Macro
          </Button>
        </div>
        
        <div className="grid gap-4">
          {macros.map((macro) => (
            <Card key={macro.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{macro.name}</h4>
                    <p className="text-sm text-muted-foreground">Trigger: {macro.trigger}</p>
                    <p className="text-sm">{macro.response}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Notifications Tab Content
  const NotificationsTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Notification Settings</h3>
          <p className="text-muted-foreground">Manage how you receive updates</p>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mood Changes</h4>
                <p className="text-sm text-muted-foreground">Get notified when your mood patterns change</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Daily Insights</h4>
                <p className="text-sm text-muted-foreground">Receive daily personality insights</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Goal Reminders</h4>
                <p className="text-sm text-muted-foreground">Reminders about your growth goals</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Connections Tab Content
  const ConnectionsTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Connected Services</h3>
          <p className="text-muted-foreground">Manage your integrations and data sources</p>
        </div>
        
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Discord</h4>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline">Disconnect</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Health Data</h4>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button>Connect</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Personality Tab Content
  const PersonalityTab = () => {
    const traits = [
      { trait: 'Curiosity', value: 92 },
      { trait: 'Empathy', value: 87 },
      { trait: 'Creativity', value: 78 },
      { trait: 'Analytical', value: 85 },
      { trait: 'Optimism', value: 76 }
    ];

    const goals = [
      { goal: 'Improve Communication', progress: 65, target: 'Next Month' },
      { goal: 'Emotional Intelligence', progress: 78, target: 'Ongoing' },
      { goal: 'Creative Expression', progress: 45, target: '3 Months' },
      { goal: 'Technical Skills', progress: 82, target: 'Next Week' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" style={{ color: moodColor }} />
                Personality Traits
              </CardTitle>
              <CardDescription>
                Your dominant characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {traits.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{trait.trait}</span>
                    <span className="text-muted-foreground">{trait.value}%</span>
                  </div>
                  <Progress value={trait.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: moodColor }} />
                Growth Goals
              </CardTitle>
              <CardDescription>
                Areas for development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{goal.goal}</span>
                    <Badge variant="outline" className="text-xs">
                      {goal.target}
                    </Badge>
                  </div>
                  <Progress value={goal.progress} />
                  <p className="text-xs text-muted-foreground">{goal.progress}% complete</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Your digital personality insights and analytics
            </p>
          </div>
          <Badge 
            variant="outline" 
            className="px-3 py-1"
            style={{ borderColor: moodColor, color: moodColor }}
          >
            Current Mood: {mood}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="connections">
              <Users className="h-4 w-4 mr-2" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="macros" className="mt-6">
            <MacrosTab />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <ConnectionsTab />
          </TabsContent>

          <TabsContent value="personality" className="mt-6">
            <PersonalityTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
