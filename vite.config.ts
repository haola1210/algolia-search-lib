import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "./src/main.tsx", // Entry file for your component
      name: "AlgoliaSearch",
      fileName: "algoliasearch",
      formats: ["umd"], // Universal Module Definition
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Exclude React and ReactDOM
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"), // Or "development"
  },
});
