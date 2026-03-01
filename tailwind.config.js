/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        stark: {
          dark: '#0a0c10',
          card: '#161b22',
          blue: '#007bff',
          red: '#ff4b4b',
        }
      }
    },
  },
  plugins: [],
}
