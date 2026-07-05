/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0EA5A4",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        pharma237: {
          primary: "#0EA5A4",
          secondary: "#1E3A8A",
          accent: "#F59E0B",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#3ABFF8",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      "light",
    ],
  },
};
