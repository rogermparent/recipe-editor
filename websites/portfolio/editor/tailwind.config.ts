import { homepageContentFilePath } from "./src/app/(editor)/homepage/paths";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/projects-collection/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/component-library/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    homepageContentFilePath,
  ],
};
export default config;
