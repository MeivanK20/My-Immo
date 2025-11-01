import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚡ Configuration Vite compatible Appwrite
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,                  // Port local pour ton frontend
    strictPort: true,            // Ne change pas automatiquement le port
    open: true,                  // Ouvre automatiquement le navigateur
    cors: {
      origin: ["http://localhost:5173"], // Domaine autorisé pour Appwrite
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    },
  },
  build: {
    outDir: "dist",              // Dossier de build
    sourcemap: true,             // Génère des sourcemaps pour debugging
  },
  define: {
    "process.env": {},           // Évite les erreurs liées à process.env
  },
});
