// import type { Config } from "tailwindcss";

// export default {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         cartoon: {
//           sky: "hsl(var(--cartoon-sky))",
//           cream: "hsl(var(--cartoon-cream))",
//           red: "hsl(var(--cartoon-red))",
//           blue: "hsl(var(--cartoon-blue))",
//           green: "hsl(var(--cartoon-green))",
//           purple: "hsl(var(--cartoon-purple))",
//           pink: "hsl(var(--cartoon-pink))",
//           yellow: "hsl(var(--cartoon-yellow))",
//         },
//       },
//       fontFamily: {
//         sans: ["Fredoka One", "Inter", "sans-serif"],
//         cartoon: ["Fredoka One", "cursive"],
//       },
//       boxShadow: {
//         // Linked to your Global CSS variables
//         "cartoon": "var(--shadow-base)",
//         "cartoon-sm": "var(--shadow-sm)",
//         "cartoon-lg": "var(--shadow-lg)",
//         "cartoon-pink": "var(--shadow-pink)",
//         "cartoon-blue": "var(--shadow-blue)",
//         "cartoon-purple": "var(--shadow-purple)",
//         "cartoon-green": "var(--shadow-green)",
//         "cartoon-yellow": "var(--shadow-yellow)",
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//         "3xl": "1.5rem",
//         "4xl": "2rem",
//         "5xl": "3rem",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//         shimmer: {
//           "0%": { backgroundPosition: "-200% 0" },
//           "100%": { backgroundPosition: "200% 0" },
//         },
//         // Custom bounce for that U.S. Game Style
//         "squish": {
//           "0%, 100%": { transform: "scale(1, 1)" },
//           "50%": { transform: "scale(1.05, 0.95)" },
//         }
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         shimmer: "shimmer 1.8s infinite",
//         squish: "squish 0.5s ease-in-out",
//       },
//     },
//   },
//   plugins: [
//     require("tailwindcss-animate"),
//     require("tailwind-scrollbar"),
//   ],
// } satisfies Config;

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cartoon: {
          sky: "hsl(var(--cartoon-sky))",
          cream: "hsl(var(--cartoon-cream))",
          red: "hsl(var(--cartoon-red))",
          blue: "hsl(var(--cartoon-blue))",
          green: "hsl(var(--cartoon-green))",
          purple: "hsl(var(--cartoon-purple))",
          pink: "hsl(var(--cartoon-pink))",
          yellow: "hsl(var(--cartoon-yellow))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],

      },
      boxShadow: {
        // Linked to your Global CSS variables
        "cartoon": "var(--shadow-base)",
        "cartoon-sm": "var(--shadow-sm)",
        "cartoon-lg": "var(--shadow-lg)",
        "cartoon-pink": "var(--shadow-pink)",
        "cartoon-blue": "var(--shadow-blue)",
        "cartoon-purple": "var(--shadow-purple)",
        "cartoon-green": "var(--shadow-green)",
        "cartoon-yellow": "var(--shadow-yellow)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "3rem",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Custom bounce for that U.S. Game Style
        "squish": {
          "0%, 100%": { transform: "scale(1, 1)" },
          "50%": { transform: "scale(1.05, 0.95)" },
        },
        "stagger-fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.8s infinite",
        squish: "squish 0.5s ease-in-out",
        "stagger-fade-in": "stagger-fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
} satisfies Config;