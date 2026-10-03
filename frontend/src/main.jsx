import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";

import App from "./App";
import "./styles.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  environment: "development",
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  tracePropagationTargets: [
    "localhost",
    /^\/api/
  ]
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);