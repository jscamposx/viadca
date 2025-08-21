import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin de compresión gzip
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024, // Solo comprimir archivos mayores a 1KB
      deleteOriginFile: false, // Mantener archivos originales
    }),
    // También generar archivos Brotli para mejor compresión
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  build: {
    // Objetivo moderno: sólo navegadores actuales (sin polyfills legacy)
    target: "es2018",
    // Optimizaciones adicionales para el build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          maps: ["@vis.gl/react-google-maps"],
          ui: ["react-icons"],
        },
      },
    },
    // Habilitar sourcemaps comprimidos
    sourcemap: true,
    // Configuración de compresión
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      },
    },
  },
});
