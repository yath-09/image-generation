import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",  // Includes all Next.js App Router components
    "./pages/**/*.{ts,tsx,js,jsx}", // If using the Pages Router
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
