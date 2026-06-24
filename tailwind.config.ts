import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1A1A2E',
          '80': 'rgba(26, 26, 46, 0.8)',
          '40': 'rgba(26, 26, 46, 0.4)',
        },
        sand: {
          DEFAULT: '#F0D5B7',
          light: '#F2EBD9',
        },
        surface: {
          base: '#F8F6F0',
          elevated: '#FFFFFF',
          overlay: '#F2EBD9',
          overdue: '#FFFBF7',
        },
        border: {
          subtle: '#E2D0D5',
          elevated: '#D8D3CB',
          raised: '#C8C3BB',
        },
        priority: {
          low: {
            DEFAULT: '#7B8FA1',
            bg: '#EEF1F4',
            text: '#7B8FA1',
          },
          med: {
            DEFAULT: '#C9843A',
            bg: '#FDF3E8',
            text: '#9C6A1A',
          },
          high: {
            DEFAULT: '#D4614A',
            bg: '#FDEEE9',
            text: '#A83428',
          },
          urgent: {
            DEFAULT: '#CD392B',
            bg: '#FDEAEA',
            text: '#B61A1A',
          },
        },
        presence: {
          online: '#16AD73',
          offline: '#8B8A80',
          away: '#C9843A',
        }
      },
      spacing: {
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-5': '24px',
        'space-6': '32px',
        'space-7': '48px',
        'space-8': '64px',
        'space-9': '90px',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
export default config
