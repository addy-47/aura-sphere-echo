
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Mood-based colors
				happy: {
					DEFAULT: '#7dc4e4',  // light blue
					foreground: '#ffffff'
				},
				sad: {
					DEFAULT: '#5e81ac',  // dark blue
					foreground: '#ffffff'
				},
				neutral: {
					DEFAULT: '#9f9ea1',  // silver gray
					foreground: '#ffffff'
				},
				excited: {
					DEFAULT: '#d08770',  // orange
					foreground: '#ffffff'
				},
				angry: {
					DEFAULT: '#bf616a',  // red
					foreground: '#ffffff'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'spin-slow': {
					to: { transform: 'rotate(360deg)' },
				},
				'wave': {
					'0%': { transform: 'translateY(0)' },
					'25%': { transform: 'translateY(-5px)' },
					'50%': { transform: 'translateY(0)' },
					'75%': { transform: 'translateY(5px)' },
					'100%': { transform: 'translateY(0)' },
				},
				'gradient-x': {
					'0%, 100%': {
						'background-position': '0% 50%',
					},
					'50%': {
						'background-position': '100% 50%',
					},
				},
				'glow': {
					'0%, 100%': { 
						'box-shadow': '0 0 10px 2px rgba(255, 255, 255, 0.2)' 
					},
					'50%': { 
						'box-shadow': '0 0 20px 5px rgba(255, 255, 255, 0.4)' 
					},
				},
				'shimmer': {
					'0%': {
						'background-position': '-40rem 0'
					},
					'100%': {
						'background-position': '40rem 0'
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s infinite',
				'float': 'float 6s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'wave': 'wave 2s ease-in-out infinite',
				'gradient-x': 'gradient-x 5s ease infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
				'shimmer': 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
