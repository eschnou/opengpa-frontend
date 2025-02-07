import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('VITE_API_URL_PLACEHOLDER'),
    'import.meta.env.VITE_SIGNUP_ENABLED': JSON.stringify('VITE_SIGNUP_ENABLED_PLACEHOLDER'),
    'import.meta.env.VITE_REQUIRE_INVITE_CODE': JSON.stringify('VITE_REQUIRE_INVITE_CODE_PLACEHOLDER'),
  },
}));