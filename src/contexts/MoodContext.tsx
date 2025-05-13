
import React, { createContext, useContext, useState, useEffect } from 'react';

type Mood = 'neutral' | 'happy' | 'sad' | 'excited' | 'angry';

interface MoodContextType {
  mood: Mood;
  setMood: (mood: Mood) => void;
  moodColor: string;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const moodColors = {
  neutral: '#9f9ea1',
  happy: '#7dc4e4',
  sad: '#5e81ac',
  excited: '#d08770',
  angry: '#bf616a',
};

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState<Mood>('neutral');
  const [moodColor, setMoodColor] = useState<string>(moodColors.neutral);

  useEffect(() => {
    setMoodColor(moodColors[mood]);
  }, [mood]);

  return (
    <MoodContext.Provider value={{ mood, setMood, moodColor }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
