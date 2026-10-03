# Health Monitor with Sentry Integration

A full-stack health monitoring application with an Express.js backend and Vite frontend, integrated with **Sentry** for error tracking, release monitoring, source-map debugging, alerts, and Release Health analysis.

## Overview

The **Health Monitor with Sentry Integration** project demonstrates how application errors can be monitored across both frontend and backend services while maintaining release-level visibility.

The project includes:

* RESTful CRUD APIs using Express.js
* React/Vite frontend
* Sentry integration for frontend and backend
* Release-based error tracking
* Source-map upload and verification
* Handled and unhandled error monitoring
* Release Health monitoring
* Crash-free session comparison across releases
* Sentry alerting for error thresholds
* Git-based release tags
* Verification screenshots and evidence

---

## Technology Stack

| Component                 | Technology          |
| ------------------------- | ------------------- |
| Frontend                  | React, Vite         |
| Backend                   | Node.js, Express.js |
| Error Monitoring          | Sentry              |
| API                       | REST                |
| CORS                      | Express CORS        |
| Environment Configuration | dotenv              |
| Development               | Nodemon             |
| Version Control           | Git                 |

---

## Project Structure

```text
Health Monitor with Sentry Integration/
│
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   ├── vite.config.js
│   ├── package.json
│   └── node_modules/
│
├── verification/
│   ├── alert-rule-config.png
│   ├── alert-triggered.png
│   ├── crud-api.png
│   ├── release-v1.0.0-errors.png
│   ├── release-v1.1.0-error.png
│   ├── release-health-comparison.png
│   └── sourcemap-proof.png
│
├── package.json
└── README.md
```

> `node_modules/` and environment files containing secrets should not be committed to the repository.

---

## Features

### 1. REST API

The backend provides CRUD operations for application items.

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/items`     | Retrieve all items      |
| GET    | `/api/items/:id` | Retrieve an item by ID  |
| POST   | `/api/items`     | Create a new item       |
| PUT    | `/api/items/:id` | Update an existing item |
| DELETE | `/api/items/:id` | Delete an item          |
| GET    | `/health`        | Backend health check    |

---

### 2. Sentry Error Monitoring

Sentry is integrated into both application layers.

#### Backend

The Express backend initializes Sentry using the configured DSN and release:

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.SENTRY_RELEASE,
  environment: "development",
  tracesSampleRate: 1.0
});
```

The backend also includes dedicated endpoints for generating test errors:

```text
GET /api/sentry/unhandled-async
GET /api/sentry/error
```

These endpoints are used to verify Sentry event capture and alerting.

#### Frontend

The Vite frontend uses the Sentry Vite integration to:

* Upload source maps
* Associate artifacts with releases
* Track frontend errors
* Provide readable stack traces for production bundles

---

## Release Management

The project uses Sentry releases to associate errors and application activity with specific versions.

Implemented releases:

```text
release-health-monitor@1.0.0
release-health-monitor@1.1.0
release-health-monitor@1.1.1
```

Corresponding Git tags:

```text
v1.0.0
v1.1.0
v1.1.1
```

This allows application behavior and error events to be investigated at the release level.

---

## Release v1.0.0

The initial release establishes the Sentry monitoring workflow.

It includes verification of:

* Frontend unhandled exceptions
* Backend unhandled asynchronous rejection
* Sentry event capture
* Release association

Evidence is available in:

```text
verification/release-v1.0.0-errors.png
```

---

## Release v1.1.0

The second release introduces a handled error scenario and provides release-specific monitoring.

The release demonstrates that errors explicitly captured with Sentry can still be associated with the correct application release.

Example:

```javascript
try {
  throw new Error("Intentional Handled Error v1.1.0");
} catch (error) {
  Sentry.captureException(error);
}
```

Evidence:

```text
verification/release-v1.1.0-error.png
```

---

## Release v1.1.1

The third release is used to generate successful application activity and demonstrate Release Health.

Successful sessions are generated for the release so that crash-free session metrics can be compared with the previous release.

Evidence:

```text
verification/release-health-comparison.png
```

---

## Source Maps

The frontend build is configured to upload source maps to Sentry.

This allows errors originating from the compiled production bundle to be mapped back to the original source code.

The Sentry build integration reports successful source-map upload during the production build.

The source-map verification evidence is available at:

```text
verification/sourcemap-proof.png
```

This provides evidence that Sentry can display the original source location rather than only a minified bundle location.

---

## Alerting

A Sentry alert is configured to detect an elevated number of application errors.

### Alert Condition

```text
Number of events > 5
within 1 hour
```

### Notification

The alert is configured to send a notification when the threshold is exceeded.

The alert can be tested by generating multiple backend errors:

```bash
for i in {1..6}; do
  curl http://localhost:5000/api/sentry/error
done
```

Evidence:

```text
verification/alert-rule-config.png
verification/alert-triggered.png
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* A Sentry account and project

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd "Health Monitor with Sentry Integration"
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## Environment Configuration

Create the backend environment file:

```text
backend/.env
```

Configure the required environment variables based on `.env.example`.

Example:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SENTRY_DSN=<your-sentry-dsn>
SENTRY_RELEASE=release-health-monitor@1.0.0
```

Sentry authentication tokens and other secrets should remain in environment variables and should **never be committed to Git**.

---

## Running the Application

### Start the Backend

```bash
cd backend
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```bash
curl http://localhost:5000/health
```

---

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The Vite development server runs on the URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

## Production Build

To create the frontend production build:

```bash
cd frontend
npm run build
```

The build generates the production assets and uploads source maps to Sentry when the required Sentry environment variables are configured.

---

## API Testing

### Get All Items

```bash
curl http://localhost:5000/api/items
```

### Get an Item

```bash
curl http://localhost:5000/api/items/1
```

### Create an Item

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Item","content":"Created successfully"}'
```

### Update an Item

```bash
curl -X PUT http://localhost:5000/api/items/3 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Item","content":"Updated successfully"}'
```

### Delete an Item

```bash
curl -X DELETE http://localhost:5000/api/items/3
```

---

## Testing Sentry

### Backend Error

```bash
curl http://localhost:5000/api/sentry/error
```

### Unhandled Async Rejection

```bash
curl http://localhost:5000/api/sentry/unhandled-async
```

After triggering the errors, open the Sentry project and verify that the corresponding events appear under the appropriate release.

---

## Verification

The `verification/` directory contains screenshots documenting the implementation and Sentry configuration.

Key evidence includes:

| Evidence                        | Purpose                    |
| ------------------------------- | -------------------------- |
| `crud-api.png`                  | CRUD API verification      |
| `release-v1.0.0-errors.png`     | v1.0.0 error monitoring    |
| `release-v1.1.0-error.png`      | v1.1.0 handled error       |
| `sourcemap-proof.png`           | Source-map verification    |
| `release-health-comparison.png` | Release Health comparison  |
| `alert-rule-config.png`         | Sentry alert configuration |
| `alert-triggered.png`           | Alert trigger verification |

---

## Git Release Tags

The project uses Git tags to identify release versions:

```bash
git tag
```

Expected release tags:

```text
v1.0.0
v1.1.0
v1.1.1
```

To push tags to the remote repository:

```bash
git push origin --tags
```

---

## Security

Sensitive configuration should never be committed to source control.

Do not commit:

```text
.env
SENTRY_AUTH_TOKEN
private credentials
API secrets
```

Use `.env.example` to document required environment variables without exposing their values.

---

## Development Workflow

A typical development and release workflow is:

```text
Develop
   ↓
Test API and application
   ↓
Trigger/verify Sentry events
   ↓
Build frontend
   ↓
Upload source maps
   ↓
Create Sentry release
   ↓
Verify Release Health
   ↓
Capture verification evidence
   ↓
Commit changes
   ↓
Create Git tag
   ↓
Push branch and tags
```

---

## Verification Checklist

Before completing a release, verify:

* [ ] Backend starts successfully
* [ ] Frontend starts successfully
* [ ] CRUD endpoints work
* [ ] Backend errors appear in Sentry
* [ ] Frontend errors appear in Sentry
* [ ] Events are associated with the correct release
* [ ] Source maps are uploaded successfully
* [ ] Original source location is visible in Sentry
* [ ] Release Health data is available
* [ ] v1.1.1 successful sessions are recorded
* [ ] Alert rule is configured
* [ ] Alert is triggered after the configured threshold
* [ ] Verification screenshots are stored in `verification/`
* [ ] Git tags `v1.0.0`, `v1.1.0`, and `v1.1.1` exist
* [ ] No secrets are committed

---

## Conclusion

This project demonstrates a complete application monitoring workflow using Sentry across the frontend and backend. By combining release tracking, source maps, error monitoring, Release Health, and automated alerting, the application provides a structured approach to identifying and investigating issues across different application versions.

The `verification/` directory provides supporting evidence for the implemented functionality and monitoring configuration.
