import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        subtext: "var(--subtext)",
        "youtube-bg": "var(--youtube-bg)",
        "youtube-icon": "var(--youtube-icon)",
        "discord-bg": "var(--discord-bg)",
        "discord-icon": "var(--discord-icon)",
        "github-bg": "var(--github-bg)",
        "github-icon": "var(--github-icon)",
      },
      backgroundImage: {
        // This maps 'bg-instagram' to your CSS variable
        'instagram-bg': "var(--instagram-bg-gradient)",
        'instagram-icon': "var(--instagram-icon-gradient)",
      }
    },
    fontFamily: {
      pixel: ["var(--font-pixel)"], 
      sans: ["Inter", "Arial", "sans-serif"],
    },
  },
  plugins: [],
};
export default config;
