import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts"

import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: process.env.NODE_ENV === "production" ? "./" : "./dev",
  plugins: [vue(), vueJsx(), dts({
    skipDiagnostics: false,
    logDiagnostics: true,
    insertTypesEntry: true,
    noEmitOnError: true,
  })],
  server: {
    port: 3600,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      adminlab: path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "adminlab",
    },
    // build.rollupOptions.plugins
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          const { name } = assetInfo;
          if (name === "style.css") return "adminlab.css";
          return name;
        },
      },
    },
    outDir: "dist",
  },
  
});
