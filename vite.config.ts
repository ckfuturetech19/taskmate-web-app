import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readFileSync, writeFileSync } from "fs";

// Plugin to inject environment variables into firebase-config.js for service worker
const injectFirebaseConfig = () => {
  return {
    name: "inject-firebase-config",
    buildStart() {
      // Read the template
      const configPath = path.resolve(__dirname, "public/firebase-config.js");
      let configContent = readFileSync(configPath, "utf-8");

      // Replace with environment variables if available
      const env = process.env;
      const replacements: Record<string, string> = {
        apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBU1on-3Dn33IsUfdoHYi3kluC63FIA2bs",
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "taskmate-e7cc9.firebaseapp.com",
        projectId: env.VITE_FIREBASE_PROJECT_ID || "taskmate-e7cc9",
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "taskmate-e7cc9.firebasestorage.app",
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "425325230785",
        appId: env.VITE_FIREBASE_APP_ID || "1:425325230785:web:5471398c240d7d8d46b240",
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-0921EG4E7W",
      };

      // Replace values in the config file
      Object.entries(replacements).forEach(([key, value]) => {
        const regex = new RegExp(`"${key}":\\s*"[^"]*"`, "g");
        configContent = configContent.replace(regex, `"${key}": "${value}"`);
      });

      // Write back the updated config
      writeFileSync(configPath, configContent, "utf-8");
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    injectFirebaseConfig(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
