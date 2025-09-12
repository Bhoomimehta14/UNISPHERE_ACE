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
        'vanilla-cream': '#F0E7D5',
        'navy': '#0D1846',
        'orange-accent': '#E95623',
      },
      backgroundColor: {
        'base': '#F0E7D5',
        'primary': '#0D1846',
        'accent': '#E95623',
      },
      textColor: {
        'primary': '#0D1846',
        'light': '#F0E7D5',
      },
      borderColor: {
        'primary': '#0D1846',
        'accent': '#E95623',
      },
    },
  },
  plugins: [],
}
export default config