# LeadsIQ — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript. Manage your sales pipeline with real-time filtering, role-based access, and CSV exports.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Vite |
| Backend   | Node.js, Express, TypeScript            |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT + bcryptjs                          |
| State     | TanStack Query (React Query v5)         |
| Forms     | React Hook Form                         |
| Container | Docker + Docker Compose                 |

---

## Features

- **JWT Authentication** — Register, login, protected routes
- **Role-Based Access Control** — Admin and Sales roles
- **Leads CRUD** — Create, view, edit, delete leads
- **Advanced Filtering** — Filter by status, source, search (debounced), sort by date
- **Backend Pagination** — 10 records/page with metadata
- **CSV Export** — Export filtered leads instantly
- **Dark Mode** — System-aware with manual toggle
- **Responsive Design** — Mobile-first layout
- **Docker Support** — Full stack containerized

---

## Project Structure

```
leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, app config
│   │   ├── controllers/     # authController, leadsController
│   │   ├── middleware/      # auth, validate, errorHandler
│   │   ├── models/          # User, Lead (Mongoose)
│   │   ├── routes/          # auth.ts, leads.ts
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── utils/           # jwt, response, csv helpers
│   │   └── index.ts         # Express server entry
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute
│   │   │   ├── layout/      # Navbar, Layout
│   │   │   ├── leads/       # LeadForm, LeadTable, FiltersBar, LeadDetail, StatsCards
│   │   │   └── ui/          # Button, Input, Select, Badge, Modal, Pagination
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useDebounce, useLeads
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage
│   │   ├── services/        # api.ts (Axios client)
│   │   ├── types/           # TypeScript interfaces
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Option 1 — Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/leads-dashboard.git
cd leads-dashboard

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your secrets

# 3. Build and run
docker compose up --build

# App is now running at:
#   Frontend → http://localhost:80
#   Backend  → http://localhost:5000
#   MongoDB  → localhost:27017
```

### Option 2 — Local Development

**Prerequisites:** Node.js 18+, MongoDB running locally

```bash
# ── Backend ──────────────────────────────
cd backend
cp .env.example .env        # Edit as needed
npm install
npm run dev                 # Starts on http://localhost:5000

# ── Frontend (new terminal) ───────────────
cd frontend
cp .env.example .env        # Edit VITE_API_URL if needed
npm install
npm run dev                 # Starts on http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Default                              | Description              |
|-----------------|--------------------------------------|--------------------------|
| `PORT`          | `5000`                               | Server port              |
| `MONGO_URI`     | `mongodb://localhost:27017/leads_...`| MongoDB connection string|
| `JWT_SECRET`    | —                                    | JWT signing secret       |
| `JWT_EXPIRES_IN`| `7d`                                 | Token expiry             |
| `BCRYPT_ROUNDS` | `10`                                 | Password hash rounds     |
| `CLIENT_URL`    | `http://localhost:3000`              | CORS allowed origin      |

### Frontend (`frontend/.env`)

| Variable       | Default                   | Description      |
|----------------|---------------------------|------------------|
| `VITE_API_URL` | `/api` (proxied via Vite) | Backend API base |

---

## API Documentation

### Base URL
- Local: `http://localhost:5000/api`
- Docker: `http://localhost:80/api`

### Authentication

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

#### `POST /api/auth/register`
Register a new user.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "name": "John Doe", "email": "...", "role": "sales" }
  }
}
```

---

#### `POST /api/auth/login`
Login with email and password.

**Request body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "eyJhbGci...", "user": { ... } }
}
```

---

#### `GET /api/auth/me` 🔒
Get the currently authenticated user.

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "John", "email": "...", "role": "sales" }
}
```

---

#### `GET /api/leads` 🔒
Fetch paginated leads with optional filters.

**Query parameters:**

| Param    | Type   | Values                                    |
|----------|--------|-------------------------------------------|
| `status` | string | `New` \| `Contacted` \| `Qualified` \| `Lost` |
| `source` | string | `Website` \| `Instagram` \| `Referral`   |
| `search` | string | Name or email substring                  |
| `sort`   | string | `latest` (default) \| `oldest`           |
| `page`   | number | Default `1`                              |
| `limit`  | number | Default `10`, max `100`                  |

**Example:**
```
GET /api/leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [ { "_id": "...", "name": "...", "email": "...", "status": "Qualified", ... } ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### `GET /api/leads/:id` 🔒
Get a single lead by ID.

---

#### `POST /api/leads` 🔒
Create a new lead.

**Request body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in enterprise plan"
}
```

**Response `201`:** Returns created lead object.

---

#### `PUT /api/leads/:id` 🔒
Update an existing lead (same body as POST).

---

#### `DELETE /api/leads/:id` 🔒 (Admin only)
Delete a lead. Only users with `role: admin` can delete.

**Response `200`:**
```json
{ "success": true, "message": "Lead deleted successfully" }
```

---

#### `GET /api/leads/export/csv` 🔒
Export leads as a CSV file. Accepts same filter params as `GET /api/leads` (excluding pagination).

**Response:** `text/csv` file download (`leads.csv`)

---

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

| Status | Meaning                   |
|--------|---------------------------|
| `400`  | Validation failed         |
| `401`  | Unauthorized / bad token  |
| `403`  | Forbidden (wrong role)    |
| `404`  | Resource not found        |
| `409`  | Conflict (duplicate email)|
| `500`  | Internal server error     |

---

## Role Permissions

| Action              | Admin | Sales |
|---------------------|:-----:|:-----:|
| View leads          | ✅    | ✅    |
| Create lead         | ✅    | ✅    |
| Edit lead           | ✅    | ✅    |
| Delete lead         | ✅    | ❌    |
| Export CSV          | ✅    | ✅    |

---

## Scripts

### Backend
```bash
npm run dev       # Dev server with hot reload
npm run build     # Compile TypeScript
npm run start     # Run compiled output
npm run lint      # TypeScript type check
```

### Frontend
```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # TypeScript type check
```

---

## Git Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add CSV export functionality
fix: resolve pagination off-by-one error
chore: update dependencies
refactor: extract useLeads hook
docs: update API documentation
```

---

## Submission

**Email:** ritik.yadav@servicehive.tech  
**Subject:** `MERN Internship Assignment Submission - Your Name`

Include:
- GitHub Repository URL
- Updated Resume
- Deployment Link (if available)
