/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { stark: { dark: '#0a0c10', card: '#161b22', blue: '#007bff', cyan: '#00d4ff' } } } },
  plugins: [],
}
