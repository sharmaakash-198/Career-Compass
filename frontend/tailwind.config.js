// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Simple, solid neutral colors
        background: '#ffffff', // Clean white
        surface: '#f8fafc',    // Off-white / light slate
        border: '#e2e8f0',     // Light grey border
        primary: '#0f172a',    // Deep charcoal/black
        text: '#334155',       // Slate grey text
      }
    }
  }
}
