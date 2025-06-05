import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMood } from '../contexts/MoodContext';
import Layout from '../components/Layout';
import { Send, ChevronUp, ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import GlassSphere from '../components/GlassSphere';
import LoaderComponent from '../components/LoaderComponent';

// Ensure THREE is available globally
if (typeof window !== 'undefined' && !window.THREE) {
  window.THREE = THREE;
  console.log("THREE initialized in ChatPage:", THREE.REVISION);
}

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
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mood, setMood, moodColor } = useMood();
  const isMobile = useIsMobile();
  const [chatExpanded, setChatExpanded] = useState(!isMobile);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  // Special layout for mobile chat page
  if (isMobile) {
    return (
      <Layout hideFooter={true}>
        <div className="flex flex-col h-[calc(100vh-4rem)] relative">
          {/* Glass Sphere with Loader */}
          <div className="flex-grow w-full relative">
            <div 
              className="w-full h-full rounded-xl overflow-hidden border transition-all duration-300" 
              style={{ 
                minHeight: '50vh',
                background: 'rgba(var(--card), 0.95)',
                backdropFilter: 'blur(10px)',
                borderColor: moodColor + '30',
                boxShadow: `0 10px 30px ${moodColor}20`
              }}
            >
              <LoaderComponent isLoading={isLoading} />
              {!isLoading && <GlassSphere isProcessing={isProcessing} />}
            </div>
          </div>
          
          {/* Expandable chat interface - Improved positioning */}
          <div 
            className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out backdrop-blur-xl shadow-lg rounded-t-2xl border-t-0 pb-safe`}
            style={{
              height: chatExpanded ? '60vh' : '4rem',
              background: 'rgba(var(--background), 0.95)',
              boxShadow: `0 -5px 20px ${moodColor}20`,
              borderColor: moodColor + '30',
              paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' // Safe area for notched phones with minimum padding
            }}
          >
            {/* Chat toggle button - Moved above the text */}
            <button 
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded-t-xl border flex items-center justify-center shadow-md z-10 transition-all duration-300"
              onClick={() => setChatExpanded(!chatExpanded)}
              style={{ 
                background: 'rgba(var(--background), 0.95)',
                borderColor: moodColor + '30' 
              }}
            >
              {chatExpanded ? <ChevronDown /> : <ChevronUp />}
            </button>
            
            {/* Always show input form and current message */}
            <div className="flex flex-col h-full">
              {/* Collapsed state shows minimal UI with latest message */}
              {!chatExpanded ? (
                <div className="h-full flex items-center justify-between px-4">
                  <div className="truncate flex-1 text-sm">
                    {messages.length > 0 && messages[messages.length - 1].text.length > 50 
                      ? `${messages[messages.length - 1].text.substring(0, 50)}...` 
                      : messages[messages.length - 1].text}
                  </div>
                </div>
              ) : (
                <ScrollArea className="flex-1 p-4 overflow-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} `}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-3 animate-in fade-in slide-in-from-${message.sender === 'user' ? 'right' : 'left'} duration-300`}
                          style={{
                            background: message.sender === 'user' 
                              ? `linear-gradient(135deg, ${moodColor}, ${moodColor}99)`
                              : 'rgba(var(--secondary), 0.3)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: `0 2px 10px ${message.sender === 'user' ? moodColor + '40' : 'rgba(0,0,0,0.1)'}`
                          }}
                        >
                          <p className={message.sender === 'user' ? 'text-white' : ''}>{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'opacity-70'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}
              
              {/* Always visible input area - Improved positioning */}
              <form onSubmit={handleSendMessage} className="p-4 pb-safe border-t border-opacity-20" style={{ borderColor: moodColor + '30' }}>
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full bg-secondary/30 backdrop-blur-sm border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                    disabled={isProcessing}
                  />
                  <Button 
                    type="submit" 
                    disabled={isProcessing || input.trim() === ''} 
                    className="rounded-full"
                    style={{ 
                      background: moodColor,
                      boxShadow: `0 0 10px ${moodColor}40`
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {isProcessing && (
                  <p className="text-xs text-muted-foreground mt-2 animate-pulse">Neura is thinking...</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Desktop layout 
  return (
    <Layout hideFooter={true}>
      <div className="flex flex-col md:flex-row gap-6 md:min-h-[calc(100vh-9rem)] mb-4 p-4">
        {/* Glass Sphere with Loader */}
        <div className="w-full md:w-1/2 flex-none md:h-auto h-[300px] relative">
          <div 
            className="w-full h-full overflow-hidden rounded-xl shadow-xl border transition-all duration-300 hover:shadow-2xl" 
            style={{ 
              background: 'rgba(var(--card), 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 10px 30px ${moodColor}30`,
              borderColor: moodColor + '30'
            }}
          >
            <LoaderComponent isLoading={isLoading} />
            {!isLoading && <GlassSphere isProcessing={isProcessing} />}
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div 
            className="flex-1 rounded-xl shadow-xl border flex flex-col transition-all duration-300" 
            style={{ 
              background: 'rgba(var(--card), 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 10px 30px ${moodColor}20`,
              borderColor: moodColor + '30'
            }}
          >
            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-${message.sender === 'user' ? 'right' : 'left'} duration-300`}
                      style={{
                        background: message.sender === 'user' 
                          ? `linear-gradient(135deg, ${moodColor}, ${moodColor}99)`
                          : 'rgba(var(--secondary), 0.3)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: `0 2px 10px ${message.sender === 'user' ? moodColor + '40' : 'rgba(0,0,0,0.1)'}`
                      }}
                    >
                      <p className={message.sender === 'user' ? 'text-white' : ''}>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'opacity-70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-opacity-20" style={{ borderColor: moodColor + '30' }}>
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full bg-secondary/30 backdrop-blur-sm border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                  disabled={isProcessing}
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || input.trim() === ''} 
                  className="rounded-full hover-scale"
                  style={{ 
                    background: moodColor,
                    boxShadow: `0 0 10px ${moodColor}40`
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isProcessing && (
                <p className="text-xs text-muted-foreground mt-2 animate-pulse">Neura is thinking...</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
