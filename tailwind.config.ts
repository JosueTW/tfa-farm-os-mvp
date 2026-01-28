import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // TFA Brand Colors (from logo) - Updated January 2026
        'tfa-primary': {
          DEFAULT: '#2B7035',
          light: '#3D8F47',
          dark: '#1F5227',
          50: 'rgba(43, 112, 53, 0.1)',
          100: 'rgba(43, 112, 53, 0.2)',
        },
        'tfa-secondary': {
          DEFAULT: '#025373',
          light: '#0A6B8F',
          dark: '#094C6A',
        },
        'tfa-accent': {
          DEFAULT: '#01E3C2',
          light: '#33EACD',
          dark: '#01AB93',
          muted: '#018F7B',
        },
        'tfa-tertiary': {
          DEFAULT: '#A37A51',
          light: '#B8936A',
          dark: '#8B6644',
        },
        // Legacy aliases for backward compatibility
        'tfa-green': {
          DEFAULT: '#2B7035',
          dark: '#1F5227',
          light: '#3D8F47',
        },
        'tfa-blue': {
          DEFAULT: '#025373',
          dark: '#094C6A',
          light: '#0A6B8F',
        },
        'tfa-teal': {
          DEFAULT: '#01E3C2',
          mid: '#01AB93',
        },
        'tfa-gold': {
          DEFAULT: '#A37A51',
          light: '#B8936A',
        },
        // Theme-aware surface colors (switches with light/dark mode)
        'tfa-bg': {
          primary: 'var(--tfa-bg-primary)',
          secondary: 'var(--tfa-bg-secondary)',
          tertiary: 'var(--tfa-bg-tertiary)',
          elevated: 'var(--tfa-bg-elevated)',
        },
        'tfa-text': {
          primary: 'var(--tfa-text-primary)',
          secondary: 'var(--tfa-text-secondary)',
          muted: 'var(--tfa-text-muted)',
        },
        'tfa-border': {
          DEFAULT: 'var(--tfa-border)',
          light: 'var(--tfa-border-light)',
        },
        'tfa-card': 'var(--tfa-card)',
        // Legacy dark mode aliases
        'tfa-charcoal': '#0A0F0A',
        'tfa-slate': '#141A14',
        
        // Semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        
        // Status/Semantic colors
        success: {
          DEFAULT: '#2B7035', // Same as primary
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#D35230',
          dark: '#B84520',
          foreground: '#FFFFFF',
        },
        error: {
          DEFAULT: '#D94848',
          dark: '#C03030',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: '#025373', // Same as secondary
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'tfa-sm': '0 1px 2px rgba(0,0,0,0.3)',
        'tfa-md': '0 4px 6px rgba(0,0,0,0.35)',
        'tfa-lg': '0 10px 20px rgba(0,0,0,0.4)',
        'tfa-glow-teal': '0 0 16px rgba(1,227,194,0.4)',
        'tfa-glow-gold': '0 0 16px rgba(163,122,81,0.4)',
        'tfa-glow-green': '0 0 16px rgba(43,112,53,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'tfa-gradient': 'linear-gradient(135deg, #2B7035 0%, #1F5227 100%)',
        'tfa-gradient-primary': 'linear-gradient(135deg, #2B7035 0%, #1F5227 100%)',
        'tfa-gradient-accent': 'linear-gradient(135deg, #01E3C2 0%, #01AB93 100%)',
        'tfa-gradient-hero': 'linear-gradient(180deg, #0A0F0A 0%, #141A14 50%, #1E261E 100%)',
        'tfa-gradient-energy': 'linear-gradient(90deg, #2B7035 0%, #01AB93 33%, #025373 66%, #A37A51 100%)',
        // Legacy gradients (deprecated)
        'tfa-gradient-dark': 'linear-gradient(135deg, #1F5227 0%, #094C6A 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
