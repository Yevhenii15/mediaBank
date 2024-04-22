/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      sm: '560px',
      md: '768px',
      lg: '1060px',
      xl: '1200px',
      xxl: '1440px',
      xxxl: '1600px'
    },
    fontFamily: {
      'futura': ['futura-pt', 'sans-serif'],
        },
    fontSize: {
      'h1': '65px',
      'p': '23px',
      'h3': '20px',
    },
    extend: {
      colors: {
        main: '#5d89b3',
        text: '#646469',
        text2: '#a7a7a7',
      },
    }
  },
  plugins: [],
}
