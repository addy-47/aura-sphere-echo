
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to generate a mood-based gradient
export function getMoodGradient(moodColor: string) {
  return `linear-gradient(135deg, ${moodColor}, ${moodColor}70)`
}

// Helper function to generate a glow effect
export function getMoodGlow(moodColor: string, intensity: number = 40) {
  return `0 0 15px ${moodColor}${intensity}`
}
