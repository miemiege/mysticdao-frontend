/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000',
        'bg-card': '#0A0A0A',
        'bg-elevated': '#111111',
        'text-primary': '#FFFFFF',
        'text-secondary': '#888888',
        'text-muted': '#555555',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-hover': 'rgba(255,255,255,0.2)',
        'border-glow': 'rgba(255,255,255,0.35)',
        'element-wood': '#4ADE80',
        'element-fire': '#F87171',
        'element-earth': '#FBBF24',
        'element-metal': '#E5E7EB',
        'element-water': '#60A5FA',
        'glow-white': 'rgba(255,255,255,0.15)',
        'glow-amber': 'rgba(245, 158, 11, 0.3)',
        gold: {
          DEFAULT: '#c8a45c',
          light: '#e8d5a3',
          dim: 'rgba(200, 164, 92, 0.15)',
        },
        wood: '#4ADE80',
        fire: '#F87171',
        earth: '#FBBF24',
        metal: '#E5E7EB',
        water: '#60A5FA',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        pill: '9999px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 40px rgba(255,255,255,0.06)" },
          "50%": { textShadow: "0 0 40px rgba(255,255,255,0.12)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(200,164,92,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(200,164,92,0.25)" },
        },
        "shake": {
          "0%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
          "100%": { transform: "translateX(0)" },
        },
        "fadeUp": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "shimmer": "shimmer 1.5s infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "spin-slower": "spin-slow 4s linear infinite",
        "bounce-down": "bounce-down 2s infinite",
        "text-glow": "text-glow 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shake": "shake 0.4s ease-in-out",
        "fadeUp": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
