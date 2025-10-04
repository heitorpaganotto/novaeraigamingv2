/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))", // define o border-border
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // aqui você pode adicionar outras cores do seu design system se quiser
      },
    },
  },
  plugins: [],
}
