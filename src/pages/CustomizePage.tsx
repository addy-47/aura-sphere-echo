
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMood } from '../contexts/MoodContext';

const CustomizePage = () => {
  const [aiName, setAiName] = useState('Neura');
  const [notifications, setNotifications] = useState(true);
  const [macros, setMacros] = useState([
    { id: '1', name: 'Morning Greeting', command: 'gm', response: 'Good morning! Ready for a productive day?' },
    { id: '2', name: 'Weather Check', command: 'weather', response: 'Checking today\'s weather forecast for you...' },
  ]);
  const [newMacro, setNewMacro] = useState({ name: '', command: '', response: '' });
  const { moodColor } = useMood();

  const handleSavePersonalization = () => {
    toast.success('Personalization settings saved!');
  };

  const handleAddMacro = () => {
    if (!newMacro.name || !newMacro.command || !newMacro.response) {
      toast.error('Please fill in all macro fields');
      return;
    }
    
    setMacros([...macros, { ...newMacro, id: Date.now().toString() }]);
    setNewMacro({ name: '', command: '', response: '' });
    toast.success('Macro added successfully!');
  };

  const handleDeleteMacro = (id: string) => {
    setMacros(macros.filter(macro => macro.id !== id));
    toast.success('Macro deleted successfully!');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Customize Your AI</h1>
        
        <Tabs defaultValue="personalization">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personalization">Personalization</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personalization">
            <Card>
              <CardHeader>
                <CardTitle>Personalization</CardTitle>
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
                
                <div className="space-y-2">
                  <Label htmlFor="personality-traits">Personality Traits</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Analytical', 'Creative', 'Supportive', 'Direct', 'Humorous', 'Efficient', 'Patient', 'Motivating'].map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <input type="checkbox" id={trait} className="h-4 w-4" />
                        <Label htmlFor={trait} className="text-sm font-normal">{trait}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePersonalization}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="macros">
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
          
          <TabsContent value="notifications">
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomizePage;
