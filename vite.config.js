import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Всі запити, що починаються з /api, перенаправляємо на бекенд
      "/api": {
        target: "http://127.0.0.1:8080", // Твій порт бекенду
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self'",
      "X-Frame-Options": "SAMEORIGIN",
    },
  },
});
