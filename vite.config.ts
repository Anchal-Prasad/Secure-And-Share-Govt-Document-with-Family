import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const minimalTagger = () => ({
  name: 'minimal-component-tagger',
});

export default defineConfig(({ mode }) => ({
  
  base: mode === 'production' ? '/Secure-And-Share-Govt-Document-with-Family/' : '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [react(), mode === "development" && minimalTagger()].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimize build output
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
}));