
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Bell,
  Settings,
  BookOpen,
  Users,
  Globe,
  Mic,
  Camera,
  Music
} from 'lucide-react';

const DashboardPage = () => {
  const { mood, moodColor } = useMood();
  const { theme } = useTheme();

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

  // Mood analysis data
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

  const notifications = [
    { id: 1, title: 'New Feature Available', message: 'Voice recognition has been updated', time: '5 min ago', type: 'info' },
    { id: 2, title: 'Personality Update', message: 'Your empathy score increased by 3%', time: '2 hours ago', type: 'success' },
    { id: 3, title: 'Weekly Report', message: 'Your interaction summary is ready', time: '1 day ago', type: 'report' },
    { id: 4, title: 'System Maintenance', message: 'Scheduled downtime tomorrow 2-4 AM', time: '2 days ago', type: 'warning' }
  ];

  const macros = [
    { name: 'Morning Routine', description: 'Daily motivation and goal setting', usage: 23, icon: Calendar },
    { name: 'Creative Session', description: 'Brainstorming and idea generation', usage: 18, icon: Brain },
    { name: 'Study Helper', description: 'Learning assistance and note-taking', usage: 31, icon: BookOpen },
    { name: 'Social Chat', description: 'Casual conversation and mood boost', usage: 45, icon: Users }
  ];

  const integrations = [
    { name: 'Spotify', status: 'Connected', lastSync: '2 hours ago', icon: Music },
    { name: 'Google Calendar', status: 'Connected', lastSync: '1 hour ago', icon: Calendar },
    { name: 'Voice Assistant', status: 'Active', lastSync: 'Just now', icon: Mic },
    { name: 'Camera Feed', status: 'Disconnected', lastSync: '3 days ago', icon: Camera }
  ];

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

        {/* Notifications and Macros Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" style={{ color: moodColor }} />
                Notifications
              </CardTitle>
              <CardDescription>
                Recent updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    notification.type === 'report' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Macros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" style={{ color: moodColor }} />
                Quick Macros
              </CardTitle>
              <CardDescription>
                Your most used conversation starters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {macros.map((macro, index) => {
                const IconComponent = macro.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-4 w-4" style={{ color: moodColor }} />
                      <div>
                        <p className="text-sm font-medium">{macro.name}</p>
                        <p className="text-xs text-muted-foreground">{macro.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {macro.usage} uses
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Personality Insights and Growth Goals */}
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
              {[
                { trait: 'Curiosity', value: 92 },
                { trait: 'Empathy', value: 87 },
                { trait: 'Creativity', value: 78 },
                { trait: 'Analytical', value: 85 },
                { trait: 'Optimism', value: 76 }
              ].map((trait, index) => (
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
              {[
                { goal: 'Improve Communication', progress: 65, target: 'Next Month' },
                { goal: 'Emotional Intelligence', progress: 78, target: 'Ongoing' },
                { goal: 'Creative Expression', progress: 45, target: '3 Months' },
                { goal: 'Technical Skills', progress: 82, target: 'Next Week' }
              ].map((goal, index) => (
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

        {/* Integrations Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" style={{ color: moodColor }} />
              Connected Services
            </CardTitle>
            <CardDescription>
              Manage your app integrations and connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {integrations.map((integration, index) => {
                const IconComponent = integration.icon;
                return (
                  <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-muted/50 text-center">
                    <IconComponent className="h-8 w-8 mb-2" style={{ color: moodColor }} />
                    <h3 className="font-medium text-sm">{integration.name}</h3>
                    <Badge 
                      variant={integration.status === 'Connected' || integration.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs mt-1"
                    >
                      {integration.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{integration.lastSync}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
