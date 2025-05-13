
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMood } from '../contexts/MoodContext';
import Layout from '../components/Layout';
import Sphere3D from '../components/Sphere3D';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Neura, your digital doppelganger. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mood, setMood, moodColor } = useMood();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateResponse = (userMessage: string) => {
    // This is a mock function - in a real app, you'd call an AI API
    return new Promise<string>((resolve) => {
      setIsProcessing(true);
      
      const responses = [
        "I'm analyzing that information now...",
        "That's interesting! Tell me more about it.",
        "I'm learning more about you with every conversation.",
        "I've noted this preference in your profile.",
        "Thanks for sharing. This helps me understand you better.",
      ];
      
      // Detect mood from message (very simplistic for demo)
      if (userMessage.toLowerCase().includes('happy') || userMessage.toLowerCase().includes('great')) {
        setMood('happy');
      } else if (userMessage.toLowerCase().includes('sad') || userMessage.toLowerCase().includes('depressed')) {
        setMood('sad');
      } else if (userMessage.toLowerCase().includes('excited') || userMessage.toLowerCase().includes('amazing')) {
        setMood('excited');
      } else if (userMessage.toLowerCase().includes('angry') || userMessage.toLowerCase().includes('annoyed')) {
        setMood('angry');
      }
      
      // Simulate typing delay
      setTimeout(() => {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve(randomResponse);
        setIsProcessing(false);
      }, 1500);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Get AI response
    const responseText = await simulateResponse(input);
    
    // Add AI message
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 md:min-h-[70vh]">
        {/* 3D Sphere */}
        <div className="w-full md:w-1/2 flex-none md:h-auto h-[300px]">
          <Card className="w-full h-full overflow-hidden rounded-xl shadow-lg border flex items-center justify-center">
            <Sphere3D isProcessing={isProcessing} />
          </Card>
        </div>
        
        {/* Chat Interface */}
        <div className="w-full md:w-1/2 flex flex-col">
          <Card className="flex-1 rounded-xl shadow-lg border flex flex-col">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground border border-border'
                    }`}
                    style={{
                      borderColor: message.sender === 'ai' ? moodColor : undefined,
                    }}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button type="submit" disabled={isProcessing || input.trim() === ''}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isProcessing && (
                <p className="text-xs text-muted-foreground mt-2">Neura is thinking...</p>
              )}
            </form>
          </Card>
          
          {/* Mood indicator */}
          <div className="flex items-center justify-center space-x-3 mt-4">
            <span className="text-sm">Current Mood:</span>
            <div className="flex space-x-1">
              {(['neutral', 'happy', 'sad', 'excited', 'angry'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    mood === m ? 'scale-110 border-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: useMood().moodColors[m] }}
                  title={m.charAt(0).toUpperCase() + m.slice(1)}
                  aria-label={`Set mood to ${m}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
