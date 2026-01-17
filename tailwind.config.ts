import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        black: '#0A0A0B',
        darker: '#111113',
        dark: '#1A1A1F',
        medium: '#252529',
        // Accents
        gold: {
          DEFAULT: '#C9A227',
          light: '#E5C454',
          dark: '#9A7B1C',
        },
        pink: '#FF6B9D',
        // Text
        cream: '#F5F1E8',
        muted: '#6B6B6B',
        // Heat Map
        heat: {
          tier1: '#C45C3E', // ≤5M - Terracotta
          tier2: '#4ECDC4', // ≤10M - Teal
          tier3: '#FF6B9D', // ≤15M - Pink
          tier4: '#C9A227', // >20M - Gold
        },
        // Category colors
        category: {
          wood: '#8B5E3C',
          ceramics: '#E67E22',
          stone: '#7F8C8D',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(201, 162, 39, 0.3)',
        hover: '0 8px 24px rgba(201, 162, 39, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
