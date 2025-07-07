import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Tạo __dirname trong môi trường ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@layout": path.resolve(__dirname, "./src/layouts"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@components-signup": path.resolve(__dirname, "./src/components/Signup"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@pages-admin": path.resolve(__dirname, "./src/pages/Admin"),
      "@pages-user": path.resolve(__dirname, "./src/pages/User"),
      "@pages-auth": path.resolve(__dirname, "./src/pages/Auth"),
      "@api": path.resolve(__dirname, "./src/apiCalls"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
