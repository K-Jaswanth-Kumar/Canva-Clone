# Canva-Clone

Perfect 👍 I'll create a **developer-focused README** that explains the project structure, setup, and how to run everything locally.

---

# Project README

## Overview

This project is a **full-stack web application** for creating and managing AI-powered designs with subscription-based access.
It consists of two main parts:

* **Client (Frontend)** → A Next.js application providing the user interface, authentication, and editor.
* **Server (Backend)** → A Node.js microservices architecture handling authentication, design storage, uploads, AI image generation, and subscriptions.

---

## Repository Structure

```
client/          # Next.js frontend
server/          # Backend microservices
```

### Client (Next.js)

```
client/
  .env.local          # Environment variables
  package.json
  src/
    app/              # Next.js App Router
    components/       # Reusable UI components
    auth.js           # Authentication setup
    middleware.js     # Middleware (e.g., auth)
```

Key features:

* User authentication (NextAuth)
* AI-powered editor with multiple tools (draw, elements, text, templates, uploads)
* Subscription success/cancel flows
* Responsive UI with modern styling

---

### Server (Microservices)

```
server/
  api-gateway/            # Entry point, handles routing & auth
  design-service/         # Manages user designs
  subscription-service/   # Payments & subscriptions
  upload-service/         # File & AI image uploads
```

Each service contains:

* `server.js` → Express.js server
* `controllers/` → Business logic
* `models/` → Data models
* `routes/` → REST API endpoints
* `middleware/` → Auth & validation
* `.env` → Service-specific environment variables

---

## Getting Started

### 1. Clone the repository

### 2. Install dependencies

**Client:**

```bash
cd client
npm install
```

**Server (all services):**

```bash
cd server
# example for api-gateway
cd api-gateway && npm install
```

(repeat for each service)

---

### 3. Environment Variables

#### Client (`client/.env.local`)

```env
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
API_GATEWAY_URL=http://localhost:4000
```

#### Server Services (`server/*/.env`)

Each service has its own `.env` file. Example:

**api-gateway/.env**

```env
PORT=4000
JWT_SECRET=your_secret
```

**design-service/.env**

```env
PORT=4001
MONGO_URI=mongodb://localhost:27017/designs
```

**subscription-service/.env**

```env
PORT=4002
STRIPE_SECRET_KEY=your_stripe_key
```

**upload-service/.env**

```env
PORT=4003
AI_API_KEY=your_ai_api_key
```

---

### 4. Running the project

**Start backend services (in separate terminals):**

```bash
cd server/api-gateway && npm start
cd server/design-service && npm start
cd server/subscription-service && npm start
cd server/upload-service && npm start
```

**Start frontend:**

```bash
cd client
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

---

## Architecture

* **Frontend:** Next.js (React, NextAuth, API routes)
* **Backend:** Node.js microservices (Express.js)

  * **API Gateway** → routes requests to services
  * **Design Service** → handles CRUD for designs
  * **Subscription Service** → integrates with Stripe for payments
  * **Upload Service** → handles file uploads + AI generation
* **Database:** MongoDB
* **Authentication:** JWT + NextAuth

---

## Scripts

**Client**

* `npm run dev` → start dev server
* `npm run build` → build production bundle
* `npm run start` → start production server

**Server**

* `npm start` → run service


