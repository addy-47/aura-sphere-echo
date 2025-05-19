import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent } from '../components/ui/tabs';
import { PersonalityTree } from '../components/PersonalityTree';
import { AdvancedSphere } from '../components/AdvancedSphere';
import { useIsMobile } from '../hooks/use-mobile';
import DashboardTabs from '../components/DashboardTabs';

const DashboardPage = () => {
  // All available tabs
  const allTabs = ['overview', 'activity', 'connections', 'personality', 'notifications', 'macros', 'settings'];
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLayout, setSelectedLayout] = useState('grid');
  const [graphStyle, setGraphStyle] = useState('bar');
  const [aiName, setAiName] = useState('Neura');
  const [voiceType, setVoiceType] = useState('Neutral');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set page title
    document.title = 'Dashboard - Neura AI';
  }, []);

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case 'overview':
        return (
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Interactions</CardTitle>
                  <CardDescription>Number of interactions with the AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4,567</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Session Length</CardTitle>
                  <CardDescription>Average time spent per session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15 minutes</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Satisfaction</CardTitle>
                  <CardDescription>Based on user feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        );
      case 'activity':
        return (
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>User A chatted about topic X</li>
                  <li>User B customized their profile</li>
                  <li>AI generated a new response template</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        );
      case 'connections':
        return (
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Connections</CardTitle>
                <CardDescription>Manage connections with other services</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Connect to services like Google Calendar, Slack, and more.</p>
                <Button>Connect</Button>
              </CardContent>
            </Card>
          </TabsContent>
        );
      case 'personality':
        return (
          <TabsContent value="personality">
            <Card>
              <CardHeader>
                <CardTitle>AI Personality</CardTitle>
                <CardDescription>Customize the AI's personality</CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalityTree />
                <AdvancedSphere />
              </CardContent>
            </Card>
          </TabsContent>
        );
      case 'notifications':
        return (
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage notification settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configure email, SMS, and push notifications.</p>
                <Button>Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        );
      case 'macros':
        return (
          <TabsContent value="macros">
            <Card>
              <CardHeader>
                <CardTitle>Macros</CardTitle>
                <CardDescription>Create and manage macros</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Automate common tasks with macros.</p>
                <Button>Create Macro</Button>
              </CardContent>
            </Card>
          </TabsContent>
        );
      case 'settings':
        return (
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure general settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    AI Name
                  </label>
                  <input
                    type="text"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Voice Type
                  </label>
                  <select
                    value={voiceType}
                    onChange={(e) => setVoiceType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option>Neutral</option>
                    <option>Friendly</option>
                    <option>Professional</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        );
      default:
        return <TabsContent value={tab}>No content for this tab yet.</TabsContent>;
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-6 md:py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Dashboard tabs */}
        {isMobile ? (
          <DashboardTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            tabs={allTabs} 
          />
        ) : (
          <div className="flex mb-6 border-b">
            {allTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors
                  ${activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        <Tabs value={activeTab} className="space-y-6">
          {renderTabContent(activeTab)}
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
