import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://127.0.0.1:3000",
      "/dashboard": "http://127.0.0.1:3000",
      "/audit": "http://127.0.0.1:3000",
      "/employees": "http://127.0.0.1:3000",
      "/departments": "http://127.0.0.1:3000",
      "/leave-requests": "http://127.0.0.1:3000",
      "/attendance": "http://127.0.0.1:3000",
      "/employee": "http://127.0.0.1:3000",
    },
  },
});