/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        headline: "1.625rem",
        subheadline: "1.125rem",
        large: "1rem",
        regular: "0.875rem",
        small: "0.75rem",
      },
    },
  },
  plugins: [],
};
