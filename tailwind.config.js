/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        large: "1rem",
        regular: "0.875rem",
        small: "0.75rem",
      },
    },
  },
  plugins: [],
};
