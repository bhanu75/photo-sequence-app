
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        surface: '#111827',
        border: '#1F2937',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#F9FAFB'
        },
        secondary: '#9CA3AF',
        success: '#22C55E',
        danger: '#EF4444',
        muted: '#374151'
      },
      fontFamily: {
        inter: ['Inter'],
      }
    },
  },
  plugins: [],
}
