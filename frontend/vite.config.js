import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: '/auth/register', 
  },
  optimizeDeps: {
    exclude: ['axios']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-query': ['react-query'],
          'mui': ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
});
