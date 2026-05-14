import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    alias: {
      // TODO: Revisit when Nitro/Vite no longer bundles tslib CJS helpers into SSR chunks.
      tslib: "tslib/tslib.es6.mjs",
    },
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: "error",
      },
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});

export default config;
