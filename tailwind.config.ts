import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Guyana flag-inspired — richer, more saturated
        brand: {
          green: {
            50: '#eafff3',
            100: '#c8ffe3',
            200: '#96ffc8',
            300: '#54f5a4',
            400: '#1ee07c',
            500: '#009E49',
            600: '#00843d',
            700: '#006a32',
            800: '#005428',
            900: '#003d1e',
            950: '#002312',
          },
          gold: {
            50: '#fffef0',
            100: '#fffacc',
            200: '#fff099',
            300: '#ffe44d',
            400: '#ffd700',
            500: '#FCD116',
            600: '#e0b800',
            700: '#b89400',
            800: '#8f7300',
            900: '#6b5600',
          },
          red: {
            500: '#CE1126',
            600: '#B00F20',
          },
        },
        surface: {
          warm: '#FAFAF7',
          card: '#FFFFFF',
          muted: '#F0EDE8',
          dark: '#0C1F0F',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          inverse: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
        'elevated': '0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
        'glow-green': '0 0 30px rgba(0,158,73,0.15), 0 0 60px rgba(0,158,73,0.05)',
        'glow-gold': '0 0 30px rgba(252,209,22,0.2), 0 0 60px rgba(252,209,22,0.05)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #003d1e 0%, #009E49 50%, #006a32 100%)',
        'hero-mesh': 'radial-gradient(at 20% 30%, rgba(252,209,22,0.15) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(0,158,73,0.3) 0%, transparent 50%), radial-gradient(at 50% 0%, rgba(206,17,38,0.1) 0%, transparent 40%)',
        'gold-shimmer': 'linear-gradient(135deg, #FCD116 0%, #ffe44d 50%, #FCD116 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-up-delay-1': 'fadeUp 0.6s ease-out 0.1s both',
        'fade-up-delay-2': 'fadeUp 0.6s ease-out 0.2s both',
        'fade-up-delay-3': 'fadeUp 0.6s ease-out 0.3s both',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
