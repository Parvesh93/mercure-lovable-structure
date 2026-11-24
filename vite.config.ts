import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * This Mercure website is currently a frontend-only application.
 * Use React/Vite directly rather than invoking TanStack Start's
 * local SSR server (which was failing before the React app rendered).
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  preview: {
    port: 8080,
  },
});
