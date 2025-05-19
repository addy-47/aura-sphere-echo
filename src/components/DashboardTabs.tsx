
import React, { useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  tabs 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Helper function to capitalize first letter
  const formatTabName = (tab: string) => {
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  return (
    <div className="mb-6 border-b">
      <ScrollArea className="w-full">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-none pb-2 px-1"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 flex-shrink-0 font-medium rounded-t-lg transition-colors whitespace-nowrap
                ${activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              {formatTabName(tab)}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardTabs;
