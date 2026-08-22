import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': { DEFAULT: '#B5390A', dark: '#8C2A07' },
        saffron: '#E8821A',
        gold: { DEFAULT: '#C9920D', light: '#F5D67A' },
        cream: { DEFAULT: '#FDF6EC', dark: '#F5E9D6', mid: '#EDD9BC' },
        charcoal: '#1E1A18',
        brown: '#6B5C4E',
        'brand-green': '#2A6B4A',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Kalam', 'cursive'],
        // Aliases matching the old site's font-family variable names,
        // since many components reference these class names directly.
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        kalam: ['Kalam', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'spin-slow': 'spinSlow 12s linear infinite',
      },
      typography: () => ({
        // Custom "brown" color scheme for the `prose-brown` class used across
        // static/legal pages (terms, privacy, returns, etc.), matching the
        // site's brand palette since the plugin only ships gray/slate/etc by default.
        brown: {
          css: {
            '--tw-prose-body': '#6B5C4E',
            '--tw-prose-headings': '#1E1A18',
            '--tw-prose-lead': '#6B5C4E',
            '--tw-prose-links': '#B5390A',
            '--tw-prose-bold': '#1E1A18',
            '--tw-prose-counters': '#E8821A',
            '--tw-prose-bullets': '#E8821A',
            '--tw-prose-hr': '#F5E9D6',
            '--tw-prose-quotes': '#1E1A18',
            '--tw-prose-quote-borders': '#E8821A',
            '--tw-prose-captions': '#6B5C4E',
            '--tw-prose-code': '#1E1A18',
            '--tw-prose-th-borders': '#F5E9D6',
            '--tw-prose-td-borders': '#F5E9D6',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
export default config;
