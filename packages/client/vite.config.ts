import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { env } from "./src/env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    port: env.PORT,
    proxy: {
      "/api": {
        changeOrigin: true,
        target: env.API_URL,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
