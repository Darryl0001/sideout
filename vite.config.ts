import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Replace __dirname with import.meta.dirname
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
