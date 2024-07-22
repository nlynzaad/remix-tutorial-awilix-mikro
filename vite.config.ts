import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {expressDevServer} from "remix-express-dev-server";
import { envOnlyMacros } from "vite-env-only";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
    expressDevServer({
      exportName: 'server'
    }),
    envOnlyMacros(),
  ],
  build: {
    target: 'esnext'
  },
});
