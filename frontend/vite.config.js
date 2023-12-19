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
          'react-query': ['react-query'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'vendor': ['react', 'react-dom','react-redux','react-modal', 'react-router-dom','react-image-crop','react-error-boundary','react-cookie','react-big-calendar'],
          'other-dependencies': ['axios', 'moment','dayjs'],
        },
      },
    },
  },
});
