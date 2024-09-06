import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], // Ensure all used classes are whitelisted

  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        charcoal: '#36454F',
        orange: '#FFA500',
        teil: '#006D77',
        darkBg: '#1d2225',
        darkOrange: 'rgb(71 46 1)',
        darkesBg: '#322001',
        bgViolet: '#0D001A',
        bgTeal: '#002023',
        bgYellow: '#100F00',
        bgGreen: '#001705',
        bgBlue: '#00192D',
        bgOrange: '#180800'
      },
    },
  },
  plugins: [],
}
export default config
