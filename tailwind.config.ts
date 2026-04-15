import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#06080F',
        panel: '#0E1322',
        card: '#141B2D',
        textPrimary: '#EAF1FF',
        textSecondary: '#A8B6D6',
        accent: '#4CC9F0',
        violet: '#9B5CFF',
        success: '#2DD4BF',
        warning: '#F59E0B',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(76,201,240,0.35), 0 0 22px rgba(76,201,240,0.25)',
      },
      backgroundImage: {
        stars: 'radial-gradient(circle at 20% 20%, rgba(155,92,255,0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(76,201,240,0.12), transparent 40%), linear-gradient(180deg, #06080F 0%, #090d18 100%)'
      },
    },
  },
  plugins: [],
};

export default config;
