import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    darkMode: 'selector',
    theme: {
        extend: {},
    },
    plugins: [],
};
export default config;