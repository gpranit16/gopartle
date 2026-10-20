# 🎪 GoPratle — Event Requirement Posting Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.19-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_M0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-22%2F22_Passed-success?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

<p align="center">
  <strong>A production-quality, responsive event requirement posting platform designed for GoPratle — seamlessly connecting event hosts with professional event planners, performers, and production crew.</strong>
</p>

[Repository](https://github.com/gpranit16/gopartle) • [Architecture](#-architecture--data-flow) • [Quick Start](#-quick-start-run-commands) • [API Reference](#-api-documentation) • [Demo Script](#-57-minute-demo-recording-script)

</div>

---

## 📑 Table of Contents

- [Overview & Mission](#-overview--mission)
- [Key Highlights](#-key-highlights)
- [Quick Start (Run Commands)](#-quick-start-run-commands)
- [Four-Step Posting Flow](#-four-step-posting-flow)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Folder Structure](#-folder-structure)
- [Environment Configuration](#-environment-configuration)
- [Automated Testing Suite (22/22 Passed)](#-automated-testing-suite)
- [API Documentation](#-api-documentation)
- [Product & Engineering Assumptions](#-product--engineering-assumptions)
- [Security & Reliability](#-security--reliability)
- [Deployment Guide (Vercel + Render)](#-deployment-guide)
- [5–7 Minute Demo Recording Script](#-57-minute-demo-recording-script)

---

## 🌟 Overview & Mission

**GoPratle** is a next-generation event-tech marketplace connecting event hosts directly with verified service professionals. This platform provides an intuitive, high-trust requirement posting flow enabling hosts to structure, budget, review, and broadcast their event requirements across three distinct professional verticals:

1. **Event Planner:** Comprehensive management (decor, theme, catering, vendor coordination, on-day timeline).
2. **Performer:** Live artists (bands, solo musicians, DJs, emcees) requiring tech riders and performance duration specs.
3. **Crew & Operations Staff:** Production crew (lighting techs, sound engineers, stagehands) with shift and headcount metrics.

---

## ⚡ Quick Start (Run Commands)

### 1. One-Command Setup & Run (Both Backend & Frontend)

From the root directory (`gopartle/`):

```bash
# 1. Install all dependencies across the entire monorepo
npm install
cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Run BOTH Backend (Port 5000) and Frontend (Port 3000) concurrently:
npm run dev
```

> 🎯 **That's it!** Open **`http://localhost:3000`** in your browser. The header badge will immediately pulse green: **`● Backend & DB Connected`**.

---

### 2. Individual Commands (Optional)

| Action | Command (from root) | URL / Target |
| :--- | :--- | :--- |
| **Run Both Dev Servers** | `npm run dev` | Frontend: `http://localhost:3000`<br>Backend: `http://localhost:5000` |
| **Run Backend Only** | `npm run dev:backend` | `http://localhost:5000/api/health` |
| **Run Frontend Only** | `npm run dev:frontend` | `http://localhost:3000` |
| **Run All 22 Tests** | `npm run test` | 13 Backend + 9 Frontend Tests |
| **Run Backend Tests** | `npm run test:backend` | Supertest against live MongoDB Atlas |
| **Run Frontend Tests** | `npm run test:frontend` | Vitest + React Testing Library |
| **Run Typecheck** | `npm run typecheck` | TypeScript compiler across both apps |
| **Build for Production** | `npm run build` | Next.js SSG/SSR + Express `dist/` |

---

## 🎯 Four-Step Posting Flow

```
[ Step 1: Basics ] ──> [ Step 2: Dynamic Specs ] ──> [ Step 3: Logistics ] ──> [ Step 4: Review & Persist ]
   Event Name              • Planner Services          Time Window Presets       Grouped Readouts
   Category Cards          • Performer Rider           Venue Type (In/Out)       Inline Step "Edit" Jump
   Date / Date Range       • Crew Roles & Shifts       Host Contact & Email      MongoDB ObjectId Confirmation
```

### Step-by-Step Breakdown

| Step | Focus Area | Features & Engineering Highlights |
| :---: | :--- | :--- |
| **1** | **Event Basics & Category Selection** | • 3 Selectable accessible cards (**Planner**, **Performer**, **Crew**).<br>• Single-day vs Multi-day date toggle.<br>• Boundary validation: end date cannot precede start date.<br>• Dynamic "Other" custom event type input. |
| **2** | **Category-Specific Requirements** | • **Planner:** Multi-select service pills, guest attendance (Pax), scale enum (`Small`, `Medium`, `Large`, `Extravagant`), budget range in INR.<br>• **Performer:** Performance type/genre, duration (minutes), performer count, budget range, sound/PA technical rider.<br>• **Crew:** Role title, crew headcount, shift duration (hours), experience level, payment range, crew brief. |
| **3** | **Schedule, Logistics & Contact** | • Operational time window with quick presets (e.g., *Evening 6-10 PM*).<br>• Venue environment selection (*Indoor*, *Outdoor*, *Hybrid*).<br>• Venue equipment facilities & additional notes.<br>• Primary host contact name, validated email, and optional phone. |
| **4** | **Review, Guard & Submit** | • Complete summary categorized into 3 structured cards.<br>• **1-Click "Edit" actions** jumping directly back to Steps 1, 2, or 3 while preserving all input data.<br>• Duplicate submission prevention (locks button + displays loader).<br>• Error banner with actionable feedback on network/database failure.<br>• **Confirmation Screen:** Displays real returned MongoDB `ObjectId` with 1-click clipboard copy and reset flow. |

---

## 🏛 Architecture & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Host as Event Host
    participant Web as Next.js 16 (App Router)
    participant API as Express API (Port 5000)
    participant Sec as Helmet & RateLimiter (30 req / 15m)
    participant Zod as Zod Validation Middleware
    participant Mongo as MongoDB Atlas (Cluster M0)

    Host->>Web: 1. Complete Form (Step 1 -> 3)
    Host->>Web: 2. Review Screen -> Click "Confirm & Post"
    Web->>Web: 3. Client Zod Validation Pass
    Web->>API: 4. POST /api/requirements
    API->>Sec: 5. Rate limit & security header check
    Sec->>Zod: 6. Server-side validation against category schema
    alt Invalid Input
        Zod-->>Web: HTTP 400 { success: false, errors: [...] }
        Web-->>Host: Inline error alert
    else Valid Payload
        Zod->>Mongo: 7. Mongoose Requirement.create()
        Mongo-->>API: 8. Saved Document with _id
        API-->>Web: HTTP 201 { success: true, data: { id, category, createdAt } }
        Web-->>Host: 9. Success View with MongoDB ObjectId Badge
    end
```

---

## 📁 Folder Structure

```
gopartle/
├── package.json              # Monorepo scripts (concurrently, test, build, typecheck)
├── .gitignore                # Production ignore rules (protects .env / .env.local)
├── README.md                 # Complete documentation & demo guide
│
├── backend/                  # Express + TypeScript Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example          # Environment variables template
│   ├── .env                  # Configured MongoDB Atlas connection
│   ├── src/
│   │   ├── config/           # env.ts (Zod validation), db.ts (Mongoose lifecycle)
│   │   ├── controllers/      # requirement.controller.ts (create, getById, listRecent)
│   │   ├── middleware/       # errorHandler.ts, rateLimiter.ts, validateRequest.ts
│   │   ├── models/           # requirement.model.ts (Strict Mongoose Schema)
│   │   ├── routes/           # health.route.ts, requirement.route.ts
│   │   ├── types/            # requirement.types.ts
│   │   ├── validators/       # requirement.validator.ts (Discriminative Zod schemas)
│   │   ├── app.ts            # Express setup (Helmet, CORS, Morgan, Body parser)
│   │   └── server.ts         # Server listen & graceful shutdown handlers
│   └── tests/
│       ├── health.test.ts    # Health & 404 Supertest suites
│       └── requirement.test.ts # 11 Supertest integration tests against MongoDB Atlas
│
└── frontend/                 # Next.js 16 App Router Frontend
    ├── package.json
    ├── tsconfig.json
    ├── vitest.config.ts      # Vitest configuration for unit tests
    ├── playwright.config.ts  # Playwright E2E configuration
    ├── .env.example
    ├── .env.local            # NEXT_PUBLIC_API_URL
    ├── src/
    │   ├── app/              # layout.tsx (SEO metadata), page.tsx, globals.css
    │   ├── components/       # Header.tsx with live API health status
    │   ├── features/
    │   │   └── requirement-form/
    │   │       ├── StepIndicator.tsx        # 4-step progress header
    │   │       ├── Step1Basics.tsx          # Basics form & 3 category cards
    │   │       ├── Step2CategoryDetails.tsx # Dynamic role specifications
    │   │       ├── Step3ScheduleLogistics.tsx # Logistics & contact inputs
    │   │       ├── Step4ReviewSubmit.tsx    # Summary with jump edits & duplicate protection
    │   │       └── SuccessConfirmation.tsx  # Persisted confirmation & ID display
    │   ├── lib/              # api.ts (Type-safe client), validations.ts (Zod schemas)
    │   ├── types/            # requirement.ts (Shared domain models)
    │   └── tests/
    │       ├── setup.ts      # Jest-DOM matchers & window mocks
    │       └── requirement-form.test.tsx # 9 RTL unit tests
    └── e2e/
        └── posting-flow.spec.ts # Playwright E2E happy path & validation tests
```

---

## 🔐 Environment Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://pranit1207:pranit1207@green-corridor.ym5g9w9.mongodb.net/gopratle?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

*(Note: Both `.env` and `.env.local` are safely excluded from Git via `.gitignore`, while `.env.example` templates remain tracked).*

---

## 🧪 Automated Testing Suite

The repository contains **22 comprehensive automated tests** across both backend and frontend, all passing with zero errors.

```bash
npm run test
```

### Test Results Breakdown:

```
========================================================================
 RUN  v3.2.7 backend (Supertest + live MongoDB Atlas Integration)
========================================================================
 ✓ tests/health.test.ts (2 tests)
   ✓ GET /api/health returns HTTP 200 with operational status
   ✓ GET /api/unknown-endpoint returns HTTP 404
 ✓ tests/requirement.test.ts (11 tests)
   ✓ POST /api/requirements - Valid Planner submission (HTTP 201)
   ✓ POST /api/requirements - Valid Performer submission (HTTP 201)
   ✓ POST /api/requirements - Valid Crew submission (HTTP 201)
   ✓ POST /api/requirements - Rejects invalid category (HTTP 400)
   ✓ POST /api/requirements - Rejects missing required fields (HTTP 400)
   ✓ POST /api/requirements - Rejects end date preceding start date (HTTP 400)
   ✓ POST /api/requirements - Rejects budgetMax < budgetMin (HTTP 400)
   ✓ POST /api/requirements - Rejects invalid email address (HTTP 400)
   ✓ GET /api/requirements/:id - Fetches saved requirement (HTTP 200)
   ✓ GET /api/requirements/:id - Rejects malformed ObjectId (HTTP 400)
   ✓ GET /api/requirements/:id - Returns 404 for non-existent ObjectId

========================================================================
 RUN  v5.0.5 frontend (Vitest + React Testing Library)
========================================================================
 ✓ src/tests/requirement-form.test.tsx (9 tests)
   ✓ Renders Step 1 with all 3 category cards
   ✓ Validates required fields before proceeding to Step 2
   ✓ Validates date range so end date cannot precede start date
   ✓ Dynamically switches Step 2 fields when Performer category is chosen
   ✓ Dynamically switches Step 2 fields when Crew category is chosen
   ✓ Preserves form data when navigating Back and Continue
   ✓ Navigates through all 4 steps and renders Review screen
   ✓ Displays error banner when backend API submission fails
   ✓ Displays success confirmation with returned requirement ID

Test Files  3 passed (3)
     Tests  22 passed (22)
```

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Health Status
- **Method:** `GET /health`
- **Response (`200 OK`):**
  ```json
  {
    "status": "healthy",
    "uptimeSeconds": 154,
    "timestamp": "2027-01-01T10:00:00.000Z",
    "services": {
      "api": "operational",
      "database": "connected"
    }
  }
  ```

### 2. Create Requirement
- **Method:** `POST /requirements`
- **Rate Limit:** 30 requests per 15 minutes per IP
- **Headers:** `Content-Type: application/json`
- **Payload Example (Performer):**
  ```json
  {
    "eventName": "Bengaluru Indie Rock Fest",
    "eventType": "Festival",
    "date": {
      "startDate": "2027-06-20",
      "endDate": "2027-06-21"
    },
    "location": "Bengaluru",
    "venue": "Palace Grounds",
    "category": "performer",
    "categoryDetails": {
      "performanceType": "Alternative Rock Band",
      "durationMinutes": 90,
      "performerCount": 4,
      "budgetMin": 30000,
      "budgetMax": 65000,
      "technicalRequirements": "PA system, 4 vocal mics, 2 monitor wedges"
    },
    "additionalDetails": {
      "preferredTimeWindow": "Evening (6:00 PM – 10:00 PM)",
      "venueType": "outdoor",
      "contactName": "Vikram Malhotra",
      "contactEmail": "vikram@example.com",
      "contactPhone": "+91 9876543210"
    }
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Requirement created successfully",
    "data": {
      "id": "67b748f2c31e9a21b4a0a19f",
      "category": "performer",
      "createdAt": "2027-06-20T10:14:00.000Z"
    }
  }
  ```

### 3. Fetch Requirement by ID
- **Method:** `GET /requirements/:id`
- **Response (`200 OK`):** Returns the full saved requirement document.

---

## 🧠 Product & Engineering Assumptions

1. **Category Specific Fields:**
   - **Event Planners:** Require breadth of services (curation, hospitality, decor, AV), guest capacity (Pax), and qualitative complexity scale (`Small`, `Medium`, `Large`, `Extravagant`) to establish accurate quote brackets.
   - **Performers:** Require genre specificity, set length in minutes (5 to 720 mins), troupe count, and a technical rider input to ensure venue audio compatibility.
   - **Crew & Staff:** Require operational role definitions (Sound Tech, Stagehand, Camera), shift hours (1 to 24 hours), and experience seniority tiers (`Entry`, `Mid`, `Lead / Senior`).
2. **Date Flexibility:**
   - Single-day events only require `startDate`.
   - Multi-day events activate `endDate` with strict validation enforcing `endDate >= startDate`.
3. **No Auth in MVP:**
   - Kept as a frictionless public requirement posting flow per assignment instructions.

---

## 🛡 Security & Reliability

- **Hardened Security Headers:** Implemented via `helmet()` across all routes.
- **Explicit CORS Origin Allowlist:** Restricts incoming requests to authorized frontend origins.
- **Express Rate Limiting:** Enforces strict 30 write submissions per 15-minute window to eliminate bot spam.
- **1MB Request Body Cap:** Prevents memory exhaustion attacks via large payloads.
- **Zero Stack Traces in Production:** Centralized error handling masks internal database errors from API consumers.

---

## 🚢 Deployment Guide

### Deploying Backend to Render (Free)
1. Go to [Render Dashboard](https://dashboard.render.com/) → **New Web Service**.
2. Connect `https://github.com/gpranit16/gopartle`.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Set Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://pranit1207:pranit1207@green-corridor.ym5g9w9.mongodb.net/gopratle?retryWrites=true&w=majority`
   - `FRONTEND_URL` = `*` (or your Vercel URL)

### Deploying Frontend to Vercel (Free)
1. Go to [Vercel Dashboard](https://vercel.com/) → **Add New Project**.
2. Select `gpranit16/gopartle`.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://<your-render-backend-url>/api`
5. Click **Deploy**.

---

## 🎥 5–7 Minute Demo Recording Script

Use this structured walkthrough for your submission screen recording:

| Time | Segment | What to Show & Say |
| :---: | :--- | :--- |
| **0:00–0:40** | **Introduction** | Introduce yourself as a candidate for the GoPratle Full-Stack Developer Intern position. State the objective: building a production-ready 4-step event requirement platform for Planners, Performers, and Crew with live MongoDB Atlas integration. |
| **0:40–2:30** | **Complete User Flow Demo** | 1. Open `http://localhost:3000`. Point out the header badge indicating `● Backend & DB Connected`.<br>2. **Step 1:** Select **Performer**, toggle multi-day range, demonstrate date validation if end date precedes start date.<br>3. **Step 2:** Show how fields dynamically adapt to Performer (genre, duration, performer count, budget, tech rider).<br>4. **Step 3:** Choose operational time preset, select 'Outdoor Grounds', fill contact details.<br>5. **Step 4:** Show grouped review screen. Click **"Edit"** on Step 2 to demonstrate instantaneous backward navigation with preserved inputs.<br>6. Click **"Confirm & Post Requirement"**: Point out the loading spinner, disabled state to prevent duplicate submissions, and the confirmation screen with the returned MongoDB `ObjectId` and copy button. |
| **2:30–3:40** | **Frontend Code Architecture** | Open VS Code. Walk through Next.js 16 App Router structure (`frontend/src/app` and `frontend/src/features`). Explain component state preservation across steps, Zod schema validation, warm neutral Tailwind tokens, and accessibility attributes (`aria-current="step"`, keyboard focus). |
| **3:40–4:40** | **Backend API & Security** | Open `backend/src/app.ts` and `requirement.route.ts`. Walk through Helmet headers, CORS origin allowlist, write rate limiting (30 req / 15m), and the centralized operational error handler. |
| **4:40–5:30** | **MongoDB Atlas Data Verification** | Open MongoDB Atlas (or Compass) and show the freshly saved requirement document. Highlight the `category` index, `categoryDetails` subdocument, and `createdAt` timestamp. |
| **5:30–6:20** | **Automated Tests** | Run `npm run test` in terminal. Show all 22 tests passing (13 backend Supertest tests including edge cases + 9 frontend React Testing Library tests). |
| **6:20–7:00** | **Limitations & Conclusion** | Summarize engineering trade-offs, explain potential next steps (OAuth authentication for hosts, PDF technical rider uploads, real-time vendor matching alerts), and close with a thank you to the GoPratle team. |

---

*Authored for the GoPratle Full-Stack Developer Technical Assessment.*
