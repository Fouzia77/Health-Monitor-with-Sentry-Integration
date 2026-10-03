require("dotenv").config();

const Sentry = require("@sentry/node");
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.SENTRY_RELEASE,
  environment: "development",
  tracesSampleRate: 1.0
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  Sentry.captureException(reason);
});

app.use(
  cors({
    origin: FRONTEND_URL
  })
);

app.use(express.json());

/*
 * In-memory database.
 * The assignment explicitly allows an in-memory database.
 */
let items = [
  {
    id: 1,
    title: "Welcome Note",
    content: "Welcome to the Release Health Monitor."
  },
  {
    id: 2,
    title: "Sentry",
    content: "This application is monitored with Sentry."
  }
];

let nextId = 3;

/*
 * Health endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "release-health-monitor-backend",
    release: process.env.SENTRY_RELEASE
  });
});

/*
 * GET /api/items
 * Fetch all items
 */
app.get("/api/items", (req, res) => {
  res.status(200).json(items);
});

/*
 * GET /api/items/:id
 * Fetch one item
 */
app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find((item) => item.id === id);

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  res.status(200).json(item);
});

/*
 * POST /api/items
 * Create an item
 */
app.post("/api/items", (req, res) => {
  const { title, content } = req.body;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({
      error: "Title and content are required"
    });
  }

  const item = {
    id: nextId++,
    title: title.trim(),
    content: content.trim()
  };

  items.push(item);

  res.status(201).json(item);
});

/*
 * PUT /api/items/:id
 * Update an item
 */
app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  const { title, content } = req.body;

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({
      error: "Title and content are required"
    });
  }

  items[itemIndex] = {
    id,
    title: title.trim(),
    content: content.trim()
  };

  res.status(200).json(items[itemIndex]);
});

/*
 * DELETE /api/items/:id
 * Delete an item
 */
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  items.splice(itemIndex, 1);

  res.status(204).send();
});

/*
 * v1.0.0 intentionally unhandled async rejection.
 *
 * Do not "catch" this promise because the assignment specifically
 * requires an unhandled asynchronous rejection for v1.0.0.
 */
app.get("/api/sentry/unhandled-async", (req, res) => {
  Promise.reject(
    new Error("Intentional Unhandled Async Rejection!")
  );

  res.status(202).json({
    message: "Intentional async rejection triggered"
  });
});

/*
 * Backend error used for alert testing.
 */
app.get("/api/sentry/error", (req, res) => {
  throw new Error("Intentional Backend Alert Error!");
});

/*
 * Catch unknown routes.
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

/*
 * Sentry error handler.
 *
 * It must be registered after the routes.
 */
Sentry.setupExpressErrorHandler(app);

/*
 * Start server.
 */
app.listen(PORT, () => {
  console.log(
    `Backend running at http://localhost:${PORT}`
  );

  console.log(
    `Sentry release: ${process.env.SENTRY_RELEASE}`
  );
});