import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        highland: "#17324D",
        heather: "#765B78",
        moss: "#71806A",
        parchment: "#F6F0E5",
        canal: "#3D7F98",
        tulip: "#D86B5E",
        brass: "#C6A15B",
        ink: "#25282B",
        cream: "#FFF9EF",
      },
      fontFamily: {
        serif: ["Libre Baskerville", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 50, 77, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
