/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"SF Mono"', 'monospace'],
      },
      colors: {
        e9: {
          carbon:       '#06080F',
          midnight:     '#0A0E1A',
          graphite:     '#11162A',
          stone:        '#1A2238',
          platinum:     '#E5E9F2',
          indigo:       '#4F46E5',
          'indigo-deep':'#3730A3',
          'indigo-light':'#818CF8',
          cobalt:       '#2563EB',
          'cobalt-light':'#60A5FA',
          'sky-edge':   '#38BDF8',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'core-pulse': 'corePulse 3.2s ease-in-out infinite',
        'data-render': 'dataRender 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        corePulse: {
          '0%,100%': {
            boxShadow:
              '0 0 0 1px rgba(129, 140, 248, 0.5),' +
              '0 0 30px -8px rgba(79, 70, 229, 0.6),' +
              'inset 0 0 18px -6px rgba(96, 165, 250, 0.35)',
          },
          '50%': {
            boxShadow:
              '0 0 0 1px rgba(129, 140, 248, 0.95),' +
              '0 0 56px -6px rgba(37, 99, 235, 0.95),' +
              'inset 0 0 26px -4px rgba(96, 165, 250, 0.6)',
          },
        },
        dataRender: {
          '0%':   { opacity: '0', transform: 'translateY(6px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)',   filter: 'blur(0)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
