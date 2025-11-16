/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Branding palette
        brand: {
          primary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            DEFAULT: '#047857',
            light: '#14b8a6',
            dark: '#065f46'
          },
          secondary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            DEFAULT: '#0f766e',
            light: '#2dd4bf',
            dark: '#047857'
          },
          accent: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            DEFAULT: '#d97706',
            light: '#f59e0b',
            dark: '#b45309'
          }
        },
        state: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b'
        }
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        full: '9999px',
        // Component scales
        component: '6px',
        card: '8px',
        button: '6px',
        input: '6px',
        modal: '12px'
      },
      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
        40: '160px',
        48: '192px',
        64: '256px'
      },
      boxShadow: {
        brand: '0 10px 40px rgba(6, 95, 70, 0.2)',
        'brand-hover': '0 20px 60px rgba(6, 95, 70, 0.3)',
        'button-primary': '0 4px 6px -1px rgba(6, 95, 70, 0.2)',
        'button-primary-hover': '0 10px 15px -3px rgba(6, 95, 70, 0.3)'
      },
      fontFamily: {
        primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        xl: ['20px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        '2xl': ['24px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '48px', letterSpacing: '-0.03em' }]
      }
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [],
}


