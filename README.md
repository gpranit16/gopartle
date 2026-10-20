# GoPratle — Event Requirement Posting Platform

> A production-quality, responsive event requirement posting platform designed for **GoPratle** — connecting event hosts with professional event planners, performers, and production crew.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Screenshots](#screenshots)
4. [Technology Stack](#technology-stack)
5. [Architecture & Data Flow](#architecture--data-flow)
6. [Folder Structure](#folder-structure)
7. [Prerequisites](#prerequisites)
8. [Local Installation & Setup](#local-installation--setup)
9. [Environment Variables](#environment-variables)
10. [MongoDB Atlas Setup](#mongodb-atlas-setup)
11. [Running the Application](#running-the-application)
12. [Testing & Verification](#testing--verification)
13. [API Documentation](#api-documentation)
14. [Product & Field Assumptions](#product--field-assumptions)
15. [Deployment Guide](#deployment-guide)
16. [Security & Reliability](#security--reliability)
17. [Known Limitations & Future Roadmap](#known-limitations--future-roadmap)
18. [5–7 Minute Demo Recording Outline](#57-minute-demo-recording-outline)

---

## 🌟 Project Overview

**GoPratle** is a marketplace platform connecting hosts with professional event specialists. This repository contains the complete implementation of the **Event Requirement Posting Flow**, allowing hosts to define and publish structured requirements across three distinct specialist verticals:
1. **Event Planner:** Full-scale event coordination, styling, venue sourcing, vendor management, and guest handling.
2. **Performer:** Musical bands, DJs, anchors, solo artists, and live acts requiring technical riders and performance timing.
3. **Crew & Staff:** Operations technicians, stagehands, sound/lighting engineers, and event runners requiring shifts and role definitions.

Built with a **clean, warm neutral aesthetic** (warm stone/linen background, restrained dark typography, and refined amber accenting), the platform delivers a high-trust, accessible experience.

---

## ✨ Key Features

- **Four-Step Guided Workflow:**
  - **Step 1: Event Basics:** Event name, event type (with custom 'Other' specification), single date or multi-day range with boundary validation, location, optional venue, and interactive category selector cards.
  - **Step 2: Category-Specific Requirements:** Dynamically renders inputs tailored exclusively to the chosen category (Planner, Performer, or Crew).
  - **Step 3: Schedule, Logistics & Point of Contact:** Time window presets, venue environment (Indoor/Outdoor/Hybrid), facilities requirements, and verified contact details.
  - **Step 4: Review & Submit:** Grouped readouts of all entered parameters with 1-click "Edit" jumps back to earlier steps, double-click/duplicate submission guards, and interactive state feedback.
- **True Persistence with MongoDB Atlas:** Every successful submission returns a real MongoDB document ObjectId and timestamp.
- **Live Health Status:** Header features a real-time health indicator showing whether the backend and MongoDB database connection are online.
- **Resilient State Management:** Draft inputs survive forward/backward navigation between steps.
- **Server & Client Double-Layer Validation:** Powered by Zod schemas shared in specification across Next.js and Express.

---

## 📸 Screenshots

*(To capture live screenshots: run `npm run dev` and navigate through `http://localhost:3000`)*

| Screen | Description |
| :--- | :--- |
| **Step 1: Event Basics** | Category cards (Planner, Performer, Crew) with single/multi-day date picker. |
| **Step 2: Dynamic Requirements** | Role-specific parameters (e.g., set duration & tech rider for Performers; crew roles & shift hours for Crew). |
| **Step 3: Logistics & Contact** | Time window presets, venue environment tags, and host contact inputs. |
| **Step 4: Review & Submit** | Grouped summary with inline Edit actions and loading indicator. |
| **Confirmation Screen** | MongoDB ObjectId badge with 1-click clipboard copy and reset action. |

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS with custom warm-neutral design tokens
- **Form State & Validation:** React Hook Form + Zod (`@hookform/resolvers`)
- **Icons:** Lucide React
- **Testing:** Vitest, React Testing Library, `@testing-library/jest-dom`, JSDOM, Playwright

### Backend
- **Runtime & Server:** Node.js v22 + Express.js with TypeScript (`tsx`)
- **Database & ODM:** MongoDB Atlas with Mongoose
- **Validation:** Zod schemas with custom refinements
- **Security:** Helmet (secure HTTP headers), CORS allowlist, and express-rate-limit
- **Logging:** Morgan (sanitized, zero-credential logs)
- **Testing:** Vitest, Supertest

---

## 🏛 Architecture & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Host as Event Host
    participant Web as Next.js 16 Frontend
    participant API as Express API (Port 5000)
    participant Rate as Rate Limiter & Helmet
    participant Zod as Zod Validation Middleware
    participant Mongo as MongoDB Atlas Cluster

    Host->>Web: 1. Complete Step 1-3 Form & Review
    Host->>Web: 2. Click "Confirm & Post Requirement"
    Web->>Web: 3. Client Validation Check
    Web->>API: 4. POST /api/requirements
    API->>Rate: 5. Check Rate Limit (30 req / 15m)
    API->>Zod: 6. Parse & Validate Payload Schema
    alt Validation Failure
        Zod-->>Web: HTTP 400 (Field-level error details)
        Web-->>Host: Display actionable error alert
    else Validation Success
        Zod->>Mongo: 7. Mongoose Requirement.create(doc)
        Mongo-->>API: 8. Persisted Document (ObjectId)
        API-->>Web: HTTP 201 { success: true, data: { id, category, createdAt } }
        Web-->>Host: 9. Display Confirmation & Requirement ID
    end
```

---

## 📂 Folder Structure

```
gopartle/
├── package.json              # Monorepo scripts (build, test, dev, typecheck)
├── .gitignore                # Git ignore rules for node_modules, build artifacts, env
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env                  # Local backend environment variables (contains MONGODB_URI)
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts        # Zod environment variable validation
│   │   │   └── db.ts         # Mongoose connection & lifecycle
│   │   ├── controllers/
│   │   │   └── requirement.controller.ts # Handlers (create, getById, listRecent)
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts           # Centralized operational error & 404 handler
│   │   │   ├── rateLimiter.ts            # General and write endpoint rate limiters
│   │   │   └── validateRequest.ts        # Express Zod validation middleware
│   │   ├── models/
│   │   │   └── requirement.model.ts      # Strict Mongoose schema with transforms
│   │   ├── routes/
│   │   │   ├── health.route.ts           # GET /api/health
│   │   │   └── requirement.route.ts      # POST & GET /api/requirements
│   │   ├── types/
│   │   │   └── requirement.types.ts      # Backend TypeScript contracts
│   │   ├── validators/
│   │   │   └── requirement.validator.ts  # Discriminative Zod schemas
│   │   ├── app.ts            # Express application setup (CORS, Helmet, parser)
│   │   └── server.ts         # Server boot & graceful shutdown listener
│   └── tests/
│       ├── health.test.ts    # Health check & 404 tests (Supertest)
│       └── requirement.test.ts # 11 integration tests against real MongoDB
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   ├── .env.example
│   ├── .env.local            # NEXT_PUBLIC_API_URL
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout with SEO metadata & Inter font
│   │   │   ├── page.tsx      # Main posting flow page & orchestrator
│   │   │   └── globals.css   # Custom warm neutral theme & accessibility tokens
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Header.tsx # GoPratle branding & live backend connection status
│   │   ├── features/
│   │   │   └── requirement-form/
│   │   │       ├── StepIndicator.tsx        # 4-step progress header
│   │   │       ├── Step1Basics.tsx          # Basics form & 3 category cards
│   │   │       ├── Step2CategoryDetails.tsx # Dynamic specifications form
│   │   │       ├── Step3ScheduleLogistics.tsx # Logistics & contact inputs
│   │   │       ├── Step4ReviewSubmit.tsx    # Summary with jump edits & duplicate protection
│   │   │       └── SuccessConfirmation.tsx  # Persisted confirmation & ID display
│   │   ├── lib/
│   │   │   ├── api.ts          # Type-safe API client
│   │   │   └── validations.ts  # Client-side Zod validation schemas
│   │   ├── types/
│   │   │   └── requirement.ts  # Shared frontend domain interfaces
│   │   └── tests/
│   │       ├── setup.ts        # Jest-DOM matchers & window mocks
│   │       └── requirement-form.test.tsx # 9 RTL unit tests
│   └── e2e/
│       └── posting-flow.spec.ts # Playwright E2E happy path & validation tests
└── README.md
```

---

## ⚡ Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended; verified with v22.19.0)
- **npm**: v9.0.0 or higher
- **MongoDB Atlas Account**: or a local MongoDB connection URI

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd gopartle
   ```

2. **Install all dependencies:**
   ```bash
   # Install backend dependencies
   cd backend && npm install
   cd ..

   # Install frontend dependencies
   cd frontend && npm install
   cd ..
   ```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://pranit1207:pranit1207@green-corridor.ym5g9w9.mongodb.net/gopratle?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
Create `frontend/.env.local` based on `frontend/.env.example`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🍃 MongoDB Atlas Setup

1. **Create an Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. **Deploy a Free Cluster**: Choose the M0 Shared cluster tier in your closest region.
3. **Database Access**: Create a database user with `readWriteAnyDatabase` or scoped read/write privileges on the `gopratle` database.
4. **Network Access**: Add `0.0.0.0/0` (Allow Access from Anywhere) for cloud deployment, or whitelist your specific static IP.
5. **Connection String**: Copy the SRV string in format:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/gopratle?retryWrites=true&w=majority`
   Place this in `backend/.env` under `MONGODB_URI`.

---

## 🏃 Running the Application

### Option A: Using Monorepo Root Commands
```bash
# Start backend dev server (Port 5000)
npm run dev:backend

# In a separate terminal, start frontend dev server (Port 3000)
npm run dev:frontend
```

### Option B: Running Individually
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit **`http://localhost:3000`** in your browser. The header badge will immediately switch to **"Backend & DB Connected"**.

---

## 🧪 Testing & Verification

The project includes unit, integration, and E2E test suites with 100% passing results:

### Running Tests
```bash
# Run all test suites across backend and frontend
npm run test

# Run backend tests only (Supertest + live MongoDB Atlas integration)
npm run test:backend

# Run frontend tests only (Vitest + React Testing Library)
npm run test:frontend

# Run typecheck across both projects
npm run typecheck

# Run production builds
npm run build
```

### Verified Test Results Summary
- **Backend (13/13 Passed):**
  - `POST /api/requirements` - Valid Planner submission returns HTTP 201
  - `POST /api/requirements` - Valid Performer submission returns HTTP 201
  - `POST /api/requirements` - Valid Crew submission returns HTTP 201
  - `POST /api/requirements` - Invalid category returns HTTP 400
  - `POST /api/requirements` - Missing required fields return HTTP 400
  - `POST /api/requirements` - End date preceding start date returns HTTP 400
  - `POST /api/requirements` - BudgetMax < BudgetMin returns HTTP 400
  - `POST /api/requirements` - Invalid email returns HTTP 400
  - `GET /api/requirements/:id` - Fetching valid ObjectId returns HTTP 200
  - `GET /api/requirements/:id` - Malformed ObjectId returns HTTP 400
  - `GET /api/requirements/:id` - Non-existent ObjectId returns HTTP 404
  - `GET /api/health` - Operational status returns HTTP 200
  - `GET /api/unknown-route` - Catch-all returns HTTP 404
- **Frontend (9/9 Passed):**
  - Renders Step 1 with all 3 category cards (Planner, Performer, Crew)
  - Validates required fields before allowing Step 1 continuation
  - Validates date range so end date cannot precede start date
  - Dynamically switches Step 2 fields when Performer is selected
  - Dynamically switches Step 2 fields when Crew is selected
  - Preserves entered form values when navigating Back and Continue
  - Complete 4-step navigation renders comprehensive review summary
  - Displays error banner when backend API submission fails
  - Displays confirmation card with MongoDB ObjectId upon success

---

## 📡 API Documentation

### Base URL: `/api`

### 1. Health Check
`GET /api/health`
- **Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "uptimeSeconds": 142,
    "timestamp": "2027-01-01T12:00:00.000Z",
    "services": {
      "api": "operational",
      "database": "connected"
    }
  }
  ```

### 2. Create Requirement
`POST /api/requirements`
- **Rate Limit:** 30 requests per 15 minutes per IP
- **Sample Request (Performer):**
  ```json
  {
    "eventName": "Summer Music Festival",
    "eventType": "Festival",
    "date": {
      "startDate": "2027-05-15",
      "endDate": "2027-05-16"
    },
    "location": "Bengaluru",
    "venue": "Palace Grounds",
    "category": "performer",
    "categoryDetails": {
      "performanceType": "Live Rock Band",
      "durationMinutes": 90,
      "performerCount": 4,
      "budgetMin": 25000,
      "budgetMax": 60000,
      "technicalRequirements": "Sound system, 4 vocal mics, drum monitors"
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
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Requirement created successfully",
    "data": {
      "id": "67b748f2c31e9a21b4a0a19f",
      "category": "performer",
      "createdAt": "2027-05-15T10:14:00.000Z"
    }
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "field": "categoryDetails.budgetMax",
        "message": "Maximum budget must be greater than or equal to minimum budget"
      }
    ]
  }
  ```

### 3. Fetch Requirement by ID
`GET /api/requirements/:id`
- **Response (200 OK):** Returns saved requirement document.

---

## 💡 Product & Field Assumptions

To balance structure with vendor marketplace flexibility, the following field choices were engineered:
1. **Event Planner:**
   - *Services Required:* Multi-select checkboxes (`Venue Sourcing`, `Hospitality & Catering`, `Stage & Decor`, `AV/Lighting`, `On-Day Coordination`).
   - *Attendees & Scale:* Numerical guest count + scale enum (`Small`, `Medium`, `Large`, `Extravagant`).
   - *Budget Range:* Minimum & Maximum in INR (budgetMax >= budgetMin).
2. **Performer:**
   - *Performance Type:* Free-text with autocomplete suggestions (e.g., Live Band, DJ, Classical Soloist).
   - *Set Duration:* Integer minutes (5 to 720 minutes).
   - *Performer Count:* Integer headcount (1 to 100 artists).
3. **Crew & Operational Staff:**
   - *Crew Role:* Specific role title (e.g., Sound Engineer, Lighting Tech, Stagehand).
   - *Shift Hours:* 1 to 24 hours per shift.
   - *Experience Level:* `Entry Level`, `Mid Level`, or `Lead / Senior`.
4. **Dates:**
   - Single-day events send `startDate` with `endDate` as empty or identical.
   - Multi-day events enforce `endDate >= startDate`.

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Push repository to GitHub.
2. In Vercel, import the repository and select **Root Directory** as `frontend`.
3. Set Framework Preset: **Next.js**.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend API URL (e.g., `https://gopratle-api.onrender.com/api`).
5. Deploy.

### Deploying Backend to Render / Railway
1. Create a new **Web Service** pointing to your repository.
2. Set Root Directory: `backend`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or host-assigned port)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: Your deployed Vercel frontend URL (e.g., `https://gopratle.vercel.app`)

---

## 🛡 Security & Reliability

- **Helmet Security Headers:** Enforces CSP, X-Frame-Options, DNS prefetch control, and HSTS.
- **Strict CORS Origin Whitelist:** Only approved frontend URLs can execute cross-origin requests.
- **Rate Limiting:** Protects `/api/requirements` from spam and brute-force (30 submissions/15m).
- **Request Size Limiting:** Express body parser restricted to 1MB to prevent memory exhaustion attacks.
- **Data Normalization & Sanitization:** Trims strings and strips MongoDB internal properties (`_id` -> `id`, removes `__v`).
- **Safe Error Shielding:** Database connection strings, stack traces, and internal server internals are withheld in production responses.

---

## 🔮 Known Limitations & Future Roadmap

- **Authentication:** In line with assignment guidelines, this MVP is an open posting flow. A production iteration would introduce OAuth / JWT-based session auth to allow hosts to manage their requirement drafts.
- **Real-time Notifications:** Webhooks or WebSocket channels (e.g. Socket.io) could be added to alert matched event planners as soon as a requirement is published.
- **Attachment Uploads:** Supporting PDF riders, event mood boards, or venue blueprints via S3/Cloudinary presigned URLs.

---

## 🎥 5–7 Minute Demo Recording Outline

Use this structured script for the assignment walkthrough recording:

| Time | Topic | What to Show & Say |
| :--- | :--- | :--- |
| **0:00–0:40** | **Introduction & Problem Statement** | Introduce yourself as a candidate for the Full-Stack Developer Intern role. Briefly state GoPratle's mission: connecting event hosts with planners, performers, and crew through a structured, high-trust requirement flow. |
| **0:40–2:30** | **Complete User Journey Walkthrough** | 1. Open `http://localhost:3000`. Point out the header with the live backend status indicator.<br>2. Demonstrate Step 1: Select **Performer**, toggle multi-day range, demonstrate date validation if end date precedes start date.<br>3. Advance to Step 2: Show dynamic fields adapting to Performer (performance type, set duration, headcount, budget range).<br>4. Advance to Step 3: Enter logistics, select 'Outdoor Grounds', fill contact details.<br>5. Advance to Step 4: Show grouped review screen, click "Edit" to jump back to Step 2 and modify budget, jump forward again.<br>6. Click "Confirm & Post Requirement": Show loading spinner, disabled state, and the confirmation screen with the generated MongoDB ObjectId and copy button. |
| **2:30–3:40** | **Frontend Architecture** | Show Next.js 16 App Router structure (`frontend/src/app` and `frontend/src/features`). Explain component state preservation across step navigation, Zod schema validation, Tailwind token system, and accessibility attributes (`aria-current="step"`, keyboard focus). |
| **3:40–4:40** | **Backend API & Security** | Open `backend/src/app.ts` and `requirement.route.ts`. Walk through Helmet headers, CORS allowlist, submission rate limiter (30 req / 15m), and the Zod request validation middleware. |
| **4:40–5:30** | **MongoDB Atlas Data Model & Verification** | Open MongoDB Atlas (or Compass) and show the newly created requirement document. Highlight the `category` index, `categoryDetails` subdocument, and `createdAt` timestamp. |
| **5:30–6:20** | **Automated Testing Suite** | Run `npm run test` in terminal. Show all 22 tests passing (13 backend Supertest tests including edge cases + 9 frontend React Testing Library tests). Mention the Playwright E2E test suite. |
| **6:20–7:00** | **Assumptions, Limitations & Next Steps** | Summarize field design decisions, explain remaining production enhancements (authentication, attachment uploads), and thank the GoPratle team. |

---

*Authored for the GoPratle Full-Stack Developer Technical Assessment.*
