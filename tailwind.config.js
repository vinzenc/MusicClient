/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'synth-deep': '#0d0221',
        'synth-indigo': '#1a0b33',
        'synth-magenta': '#2d0a31',
        'fuchsia-neon': '#ff00ff',
        'teal-neon': '#00f3ff',
        'yellow-cyber': '#f3ff00',
        'surface-container-high': 'rgba(45, 10, 49, 0.4)',
        'surface-container': 'rgba(26, 11, 51, 0.6)',
        'on-surface': '#f5f3ff',
        'background': '#0d0221',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body': ['Manrope', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },
    },
  },
}
