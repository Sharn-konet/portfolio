import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
  resolve: {
    alias: {
      "@components": path.resolve("./src/components"),
      "@lib": path.resolve("./src/lib"),
      "@data": path.resolve("./src/data"),
    },
  },
});
