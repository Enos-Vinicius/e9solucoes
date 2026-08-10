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

          // PALETA DA MARCA · eixo azul travado em 214°, marca = blue.800.
          // Papéis: 800 estrutural (1,85:1 sobre carbon — nunca texto);
          // 600 primária interativa; 400 accent/glint; 300 traço e texto
          // sobre carbon (9,43:1); 200/100 texto de destaque bem claro.
          // A família indigo/cobalto saiu: era 234–244°, ou seja violeta.
          blue: {
            950: '#001838',
            900: '#002657',
            800: '#003A85',   // ← cor de marca
            700: '#0049A8',
            600: '#005BD1',
            500: '#006FFF',
            400: '#4795FA',
            300: '#81B5F8',
            200: '#B3D2F9',
            100: '#D5E6FB',
            50:  '#EDF4FD',
          },

          // 198° · único desvio de matiz, deliberado: dá para onde os
          // gradientes viajarem.
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
              '0 0 0 1px rgba(129, 181, 248, 0.5),' +   // blue-300
              '0 0 30px -8px rgba(0, 91, 209, 0.6),' +  // blue-600
              'inset 0 0 18px -6px rgba(71, 149, 250, 0.35)', // blue-400
          },
          '50%': {
            boxShadow:
              '0 0 0 1px rgba(129, 181, 248, 0.95),' +
              '0 0 56px -6px rgba(0, 111, 255, 0.95),' + // blue-500
              'inset 0 0 26px -4px rgba(71, 149, 250, 0.6)',
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
