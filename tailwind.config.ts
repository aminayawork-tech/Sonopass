import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // SonoPass Professional Medical Palette
        sono: {
          teal: {
            deep: "hsl(var(--sono-teal-deep))",
            medium: "hsl(var(--sono-teal-medium))",
          },
          blue: {
            soft: "hsl(var(--sono-blue-soft))",
            light: "hsl(var(--sono-blue-light))",
          },
          green: {
            ultrasound: "hsl(var(--sono-green-ultrasound))",
            soft: "hsl(var(--sono-green-soft))",
          },
          gray: {
            50: "hsl(var(--sono-gray-50))",
            100: "hsl(var(--sono-gray-100))",
            300: "hsl(var(--sono-gray-300))",
            600: "hsl(var(--sono-gray-600))",
            900: "hsl(var(--sono-gray-900))",
          },
          amber: "hsl(var(--sono-amber))",
          orange: "hsl(var(--sono-orange))",
          purple: "hsl(var(--sono-purple))",
          red: "hsl(var(--sono-red))",
          white: "hsl(var(--sono-white))",
        },
        // Mapped Tailwind Variables
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
