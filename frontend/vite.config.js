import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import image from "@rollup/plugin-image";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    image({
      extensions: [".png", ".jpg", ".jpeg", ".gif", ".svg",".webp"],
      output: "dist/assets/images", 
    }),
  ],
  server: {
    open: "/auth/register",
  },
  optimizeDeps: {
    exclude: ["axios"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-query": ["react-query"],
          mui: ["@mui/material", "@mui/icons-material"],
        },
      },
    },
  },
});
