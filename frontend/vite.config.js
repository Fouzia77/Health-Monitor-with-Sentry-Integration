import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),

    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: {
        name:
          process.env.SENTRY_RELEASE ||
          "release-health-monitor@1.0.0"
      },
      sourcemaps: {
      }
    })
  ],

  build: {
    sourcemap: true
  }
});