import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Tạo __dirname trong môi trường ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      //"@": path.resolve(__dirname, "./src/"),
      // "@components": path.resolve(__dirname, "./src/components/"),
      "@hooks": path.resolve(__dirname, "./src/hooks/"),
      "@layouts": path.resolve(__dirname, "./src/layouts/"),
      "@sections": path.resolve(__dirname, "./src/section/"),
      "@components-ui": path.resolve(__dirname, "./src/components/UI/"),
      "@components-states": path.resolve(__dirname, "./src/components/States/"),
      "@components-signup": path.resolve(__dirname, "./src/components/Signup/"),
      "@components-search": path.resolve(__dirname, "./src/components/Search/"),
      "@components-post": path.resolve(__dirname, "./src/components/Post/"),
      "@components-layouts": path.resolve(
        __dirname,
        "./src/components/Layouts/"
      ),
      "@components-chat": path.resolve(__dirname, "./src/components/Chat/"),
      "@components-cards": path.resolve(__dirname, "./src/components/Cards/"),
      "@pages": path.resolve(__dirname, "./src/pages/"),
      "@pages-admin": path.resolve(__dirname, "./src/pages/Admin/"),
      "@pages-user": path.resolve(__dirname, "./src/pages/User/"),
      "@pages-auth": path.resolve(__dirname, "./src/pages/Auth/"),
      "@api": path.resolve(__dirname, "./src/apiCalls/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@redux": path.resolve(__dirname, "./src/redux/"),
      "@context": path.resolve(__dirname, "./src/context/"),
      "@modals": path.resolve(__dirname, "./src/Modals/"),
    },
  },
});
