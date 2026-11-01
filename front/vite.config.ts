import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "lucide-react": fileURLToPath(
        new URL("./src/shims/lucide-react.tsx", import.meta.url)
      ),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("firebase")) return "firebase";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("swiper")) return "swiper";
          if (
            id.includes("@fortawesome") ||
            id.includes("chart.js") ||
            id.includes("react-chartjs-2")
          ) {
            return "ui-vendors";
          }
          if (
            id.includes("react-router") ||
            id.includes("react-dom") ||
            id.includes("react")
          ) {
            return "react-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
