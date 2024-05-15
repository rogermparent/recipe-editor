import { homepageContentFilePath } from "./src/app/(editor)/homepage/paths";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./node_modules/projects-collection/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/component-library/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    homepageContentFilePath,
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%, 20%, 50%, 80%, 100%": {
            transform: "translateY(0)" /* Initial and end positions */,
          },
          "40%": {
            transform: "translateY(-10px)" /* Upward bounce */,
          },
          "60%": {
            transform: "translateY(-5px)" /* Smaller bounce */,
          },
        },
      },
      animation: {
        bounce: "bounce 2s ease infinite",
      },
      colors: {
        body: {
          light: colors.gray[800],
          dark: colors.gray[100],
        },
        primary: {
          light: colors.green[700],
          dark: colors.blue[400],
        },
        background: {
          light: colors.gray[300],
          dark: colors.slate[900],
        },
        backgroundAlt: {
          light: colors.white,
          dark: colors.slate[800],
        },
      },
    },
  },
};
export default config;
